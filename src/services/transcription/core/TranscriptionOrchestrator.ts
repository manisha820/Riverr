import { AudioRecorder } from './AudioRecorder';
import { STTProvider } from './types';
import { TranscriptionEvent } from '@/types/transcription';
import { metrics } from '../debug/MetricsCollector';
import { db } from '../../supabase/SupabaseService';

export class TranscriptionOrchestrator {
  private recorder: AudioRecorder;
  private provider: STTProvider;
  private isRunning = false;
  private currentSessionId: string | null = null;

  constructor(provider: STTProvider, sessionId?: string) {
    this.provider = provider;
    this.currentSessionId = sessionId || null;
    this.recorder = new AudioRecorder((chunk) => {
      this.provider.sendChunk(chunk);
    });

    // Wire up auto-save
    this.provider.onFinalTranscript(async (event) => {
      if (this.currentSessionId) {
        await db.saveSegment(this.currentSessionId, event);
      }
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    metrics.startSession();
    await this.provider.connect();
    await this.recorder.start(250);
    this.isRunning = true;
    console.log("[Orchestrator] System live");
  }

  stop(): void {
    this.recorder.stop();
    this.provider.disconnect();
    this.isRunning = false;
    console.log("[Orchestrator] System stopped");
  }

  onPartial(callback: (data: TranscriptionEvent) => void) {
    this.provider.onPartialTranscript(callback);
  }

  onFinal(callback: (data: TranscriptionEvent) => void) {
    this.provider.onFinalTranscript(callback);
  }

  onError(callback: (error: Error) => void) {
    this.provider.onError(callback);
  }
}
