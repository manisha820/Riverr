# 🧹 Deterministic Transcript Refinement SOP

## 🏗️ Core Philosophy
- **Deterministic:** The same raw input must always produce the same refined output.
- **Non-Semantic:** Never invent, remove, or alter the meaning of spoken words.
- **Rule-Based:** Use regex and logical conditions rather than probabilistic models for core formatting.

## 📏 Refinement Rules

### 1. Punctuation & Capitalization
- **Auto-Cap:** Capitalize the first word of every segment and every word following a sentence-ending punctuation mark (`.`, `?`, `!`).
- **Proper Nouns:** (Future) Maintain a list of user-specific proper nouns to capitalize.
- **Terminators:** If a segment ends and a pause > 1.5s is detected, append a period if no punctuation exists.

### 2. Sentence Boundaries
- **Pause-Aware:** A silence interval of > 500ms between words triggers a sentence boundary detection.
- **Engine-Driven:** Prioritize boundary markers provided by the STT engine (`is_final` and `speech_final`).

### 3. Paragraph Grouping
- **Temporal Grouping:** Create a new paragraph if the silence between segments exceeds 3 seconds.
- **Contextual Grouping:** (Optional) Start new paragraph on speaker change.

### 4. Filler Word Handling (Toggleable)
- **Removal:** Optionally strip "um", "uh", "like" (when used as filler), and "you know" if they appear at segment boundaries.
- **Preservation:** Default to preservation unless the "Clean Transcript" toggle is active.

## 🔄 Pipeline Integration
`Raw Segment` → `Normalization` → `Punctuation Check` → `Capitalization` → `Paragraph Check` → `Final Refined Segment`

## ⚠️ Safety Constraints
- **Confidence Threshold:** If a word's confidence is < 0.6, wrap it in brackets `[word?]` or mark as `[inaudible]`.
- **Zero Hallucination:** No generative AI may be used in this layer.
