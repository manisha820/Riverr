# 🎙️ Real-time Audio Chunking SOP: Riverr

## 🧬 Audio Chunk Lifecycle
1. **Capture:** `MediaRecorder` captures audio in `timeslice` intervals.
2. **Buffer:** Temporary in-memory queue handles sequence ordering.
3. **Transport:** Chunks are sent via WebSocket with sequential IDs and timestamps.
4. **Acknowledgement:** Engine sends a "received" heartbeat for every N chunks.
5. **Recovery:** If transport fails, the buffer stores up to 30 seconds of audio for retry.

## 📏 Technical Specifications
- **Chunk Size:** 250ms (Balanced for latency and network overhead).
- **Mime Type:** `audio/webm;codecs=opus`.
- **Sample Rate:** 48kHz (Highest fidelity) or 16kHz (Engine optimized).
- **Latency Target:** <1.5s End-to-End (Capture to UI).

## 🛡️ Resilience & Edge-Case Handling

### 1. Connectivity Issues
- **Packet Loss:** Chunks are indexed. If index `N+1` arrives before `N`, the receiver waits (jitter buffer).
- **Unstable Internet:** Exponential backoff reconnect. Upon reconnection, the client flushes the retry buffer.
- **Microphone Interruption:** Emit `MIC_LOST` event to UI; attempt to restart `MediaStream` every 2 seconds.

### 2. Environment States
- **Silence:** Continue streaming empty chunks (keeps WebSocket alive) but flag as `silence: true` to avoid engine costs.
- **Tab Switching:** Use `Worker` threads or `RequestAnimationFrame` to prevent the browser from throttling the `MediaRecorder` in the background.

## 🔄 Transcription Pipeline
`Audio Input` → `Buffer (Memory)` → `WebSocket (Proxy)` → `Engine Adapter` → `Refinement Layer` → `UI Renderer` → `Supabase Store`

### Deterministic Refinement Rules
- **Sentence Boundary:** Triggered by `is_final` flag from engine + pause detection (>500ms).
- **Normalization:** Apply standard English capitalization and punctuation rules.
- **Paragraphing:** Start new paragraph if pause exceeds 2 seconds or topic shift detected.
- **No Hallucination:** If confidence < 0.6, mark text as `[inaudible]` rather than guessing.

## 🔌 Adapter Architecture (Provider Agnostic)
The `TranscriptionService` uses a standard interface:
```typescript
interface STTProvider {
  connect(): Promise<void>;
  sendChunk(audio: Blob): void;
  onTranscript(callback: (data: TranscriptionEvent) => void): void;
  disconnect(): void;
}
```
*Implementations available for Deepgram, Whisper (Edge), and AssemblyAI.*

## 💓 Stability Monitoring
- **Heartbeat:** Ping/Pong every 5 seconds.
- **Sync:** Every chunk includes `client_timestamp` and `chunk_index`.
- **Duplicate Prevention:** Receiver tracks `max_processed_index`.
