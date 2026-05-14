// 💎 Riverr Transcription Types

export interface AudioChunk {
  session_id: string;
  chunk_id: number;
  audio_base64: string;
  mime_type: string;
  timestamp: string;
}

export interface TranscriptionWord {
  word: string;
  start: number;
  end: number;
  speaker?: number;
}

export interface TranscriptionEvent {
  session_id: string;
  transcript: string;
  is_final: boolean;
  confidence: number;
  words?: TranscriptionWord[];
  metadata?: {
    processing_time_ms: number;
  };
}

export interface GeneratedContent {
  session_id: string;
  content: string;
  summary: string;
  action_items: string[];
  format_version: string;
}

export type SessionStatus = 'active' | 'completed' | 'error';

export interface Session {
  id: string;
  user_id: string;
  title: string;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface Transcript {
  id: string;
  session_id: string;
  raw_text: string;
  formatted_text: string;
  meta_data: any;
  created_at: string;
}
