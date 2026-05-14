import { STTProvider } from '../core/types';
import { TranscriptionEvent } from '@/types/transcription';
import { metrics } from '../debug/MetricsCollector';

export class DeepgramProvider implements STTProvider {
  private socket: WebSocket | null = null;
  private partialCallback?: (data: TranscriptionEvent) => void;
  private finalCallback?: (data: TranscriptionEvent) => void;
  private errorCallback?: (error: Error) => void;
  private reconnectCallback?: () => void;
  
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(): Promise<void> {
    try {
      const response = await fetch('/api/transcription/token');
      const { key, error } = await response.json();

      if (error) throw new Error(error);

      // Deepgram options: 
      // - model: nova-2-general
      // - tier: enhanced
      // - punctuate: true
      // - interim_results: true
      // - utterance_end_ms: 1000
      const url = `wss://api.deepgram.com/v1/listen?model=nova-2-general&tier=enhanced&punctuate=true&interim_results=true&utterance_end_ms=1000`;
      
      this.socket = new WebSocket(url, ['token', key]);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log("[DeepgramProvider] WebSocket connected");
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.socket.onerror = (error) => {
        console.error("[DeepgramProvider] WebSocket error:", error);
        this.errorCallback?.(new Error("WebSocket connection error"));
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log("[DeepgramProvider] WebSocket closed");
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("[DeepgramProvider] Connection failed:", error);
      throw error;
    }
  }

  private handleMessage(data: any) {
    if (!data.channel || !data.channel.alternatives) return;

    const transcript = data.channel.alternatives[0].transcript;
    if (!transcript) return;

    const event: TranscriptionEvent = {
      session_id: data.metadata?.request_id || "deepgram-session",
      transcript: transcript,
      is_final: data.is_final,
      confidence: data.channel.alternatives[0].confidence,
      metadata: { processing_time_ms: data.metadata?.duration || 0 }
    };

    if (data.metadata?.duration) {
      metrics.logLatency(data.metadata.duration);
    }

    if (event.is_final) {
      this.finalCallback?.(event);
    } else {
      this.partialCallback?.(event);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      metrics.logReconnect();
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      console.log(`[DeepgramProvider] Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
      setTimeout(() => {
        this.connect();
        this.reconnectCallback?.();
      }, delay);
    } else {
      this.errorCallback?.(new Error("Max reconnection attempts reached"));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this.isConnected = false;
  }

  sendChunk(audio: Blob | ArrayBuffer): void {
    if (this.socket && this.isConnected && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(audio);
    }
  }

  onPartialTranscript(callback: (data: TranscriptionEvent) => void): void {
    this.partialCallback = callback;
  }

  onFinalTranscript(callback: (data: TranscriptionEvent) => void): void {
    this.finalCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  onReconnect(callback: () => void): void {
    this.reconnectCallback = callback;
  }
}
