import { STTProvider } from '../core/types';
import { TranscriptionEvent } from '@/types/transcription';

export class MockProvider implements STTProvider {
  private partialCallback?: (data: TranscriptionEvent) => void;
  private finalCallback?: (data: TranscriptionEvent) => void;
  private errorCallback?: (error: Error) => void;
  private reconnectCallback?: () => void;
  
  private isConnected = false;
  private mockSentences = [
    "Welcome to Riverr.",
    "This is a real-time transcription test.",
    "The system is currently using a mock provider to validate the UI.",
    "Latency is simulated at approximately five hundred milliseconds.",
    "Deterministic logic ensures that your data is safe and accurately formatted."
  ];

  async connect(): Promise<void> {
    this.isConnected = true;
    console.log("[MockProvider] Connected");
  }

  disconnect(): void {
    this.isConnected = false;
    console.log("[MockProvider] Disconnected");
  }

  sendChunk(audio: Blob | ArrayBuffer): void {
    if (!this.isConnected) return;

    // We don't actually process audio in the mock, but we simulate a response
    // based on receiving "audio data"
    if (Math.random() > 0.8) {
      this.simulateSpeech();
    }
  }

  private simulateSpeech() {
    const sentence = this.mockSentences[Math.floor(Math.random() * this.mockSentences.length)];
    const words = sentence.split(" ");
    
    // Simulate partials
    let currentTranscript = "";
    words.forEach((word, index) => {
      setTimeout(() => {
        currentTranscript += (index === 0 ? "" : " ") + word;
        
        const event: TranscriptionEvent = {
          session_id: "mock-session",
          transcript: currentTranscript,
          is_final: index === words.length - 1,
          confidence: 0.95,
          metadata: { processing_time_ms: 100 }
        };

        if (event.is_final) {
          this.finalCallback?.(event);
        } else {
          this.partialCallback?.(event);
        }
      }, index * 150); // Simulate typing speed
    });
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
