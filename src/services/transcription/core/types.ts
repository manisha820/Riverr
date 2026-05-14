import { TranscriptionEvent } from '@/types/transcription';

export interface STTProvider {
  connect(): Promise<void>;
  disconnect(): void;
  sendChunk(audio: Blob | ArrayBuffer): void;
  
  // Event Handlers
  onPartialTranscript(callback: (data: TranscriptionEvent) => void): void;
  onFinalTranscript(callback: (data: TranscriptionEvent) => void): void;
  onError(callback: (error: Error) => void): void;
  onReconnect(callback: () => void): void;
}

export type ProviderType = 'mock' | 'deepgram' | 'openai' | 'assembly';
