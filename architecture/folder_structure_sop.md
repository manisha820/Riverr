# 📂 Folder Architecture SOP: Riverr

## 🏗️ Core Principles
- **Separation of Concerns:** Business logic (services) must be separate from UI (components).
- **Type Safety:** All data shapes must be defined in `@/types`.
- **Modularity:** Feature-based grouping where possible.

## 📁 Directory Structure
```
src/
├── app/                  # Next.js App Router (Routes & Layouts)
├── components/           # React Components
│   ├── ui/               # Base UI components (Buttons, Inputs, etc.)
│   ├── shared/           # Cross-page components (Navigation, Footer)
│   ├── transcription/    # Features: LiveEditor, Waveform, SessionControl
│   └── dashboard/        # Features: TranscriptCards, Analytics
├── services/             # Core Business Logic (Deterministic)
│   ├── transcription/    # WebSocket handlers, Deepgram/Whisper logic
│   ├── supabase/         # Database & Auth wrapper
│   └── export/           # PDF/DOCX generators
├── hooks/                # Custom React Hooks
│   ├── useTranscription.ts # Real-time state orchestration
│   ├── useAudioRecorder.ts # MediaStream API wrapper
│   └── useSupabase.ts     # Auth & Data fetching
├── types/                # TypeScript Interfaces & Enums
│   ├── database.ts       # Supabase generated types
│   ├── transcription.ts  # Payload shapes (from gemini.md)
│   └── index.ts
├── store/                # Global State (Zustand/Context)
│   └── useSessionStore.ts
└── utils/                # Helper functions (Formatting, Validation)
```

## 🔄 Execution Logic
1. UI calls a **Hook**.
2. Hook interacts with a **Service**.
3. Service executes **deterministic logic** or calls external APIs.
4. Data is persisted via **Supabase Service**.
