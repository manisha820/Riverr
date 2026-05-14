# 💎 Data Schema: Riverr

## 🧬 Core Payload Shapes

### 1. Real-time Audio Stream (Input)
```json
{
  "session_id": "uuid",
  "chunk_id": "int",
  "audio_base64": "string",
  "mime_type": "audio/webm;codecs=opus",
  "timestamp": "iso8601"
}
```

### 2. Transcription Event (Intermediate/Live)
```json
{
  "session_id": "uuid",
  "transcript": "string",
  "is_final": "boolean",
  "confidence": "float",
  "words": [
    {
      "word": "string",
      "start": "float",
      "end": "float",
      "speaker": "int"
    }
  ],
  "metadata": {
    "processing_time_ms": "int"
  }
}
```

### 3. Generated Writing Payload (Output)
```json
{
  "session_id": "uuid",
  "content": "string", // Formatted Markdown
  "summary": "string",
  "action_items": ["string"],
  "format_version": "1.0"
}
```

## 🗄️ Supabase / PostgreSQL Schema

### `sessions`
- `id`: uuid (PK)
- `user_id`: uuid (FK)
- `title`: string
- `status`: enum (active, completed, error)
- `created_at`: timestamp
- `updated_at`: timestamp

### `transcripts`
- `id`: uuid (PK)
- `session_id`: uuid (FK)
- `raw_text`: text
- `formatted_text`: text
- `meta_data`: jsonb
- `created_at`: timestamp

### `user_preferences`
- `user_id`: uuid (PK)
- `default_language`: string
- `auto_save`: boolean
- `integration_keys`: jsonb (Encrypted)

## 🔄 Event Loop (Deterministic Flow)
1. **Capture:** Browser MediaStreamRecorder -> WebSockets.
2. **Link:** Proxy to Deepgram/Whisper.
3. **Refine:** AI Post-processing (Punctuation, Paragraphing).
4. **Broadcast:** Stream refined text back to UI.
5. **Persist:** Async write to Supabase `transcripts`.
