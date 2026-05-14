# 🔎 Findings: Riverr

## 📋 Research & Discoveries
- [2026-05-14] Initialized project in empty directory `Riverr`.
- [2026-05-14] STT Engine Research: Deepgram identified as primary for <400ms latency.
- [2026-05-14] **Visual Identity (Riverr):**
    - **Header Font:** Bold Serif (Modern-Classic).
    - **UI Font:** Minimal Sans-Serif (Inter).
    - **Effects:** Glassmorphism, waveform dithering, high-elevation cards.
    - **Primary Colors:** #FFFFFF, #000000, #0070F3 (Accent).
- [2026-05-14] **Audio Architecture Assumptions:**
    - Chunks will be 250ms to minimize browser thread blocking while maintaining low latency.
    - `audio/webm;codecs=opus` selected for universal browser support and efficient compression.
    - Reconnect buffer limit set to 30s to prevent memory leaks in extreme outages.
