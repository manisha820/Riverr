-- 📝 Riverr Editing & Versioning Schema

-- 1. Transcript Edits (Atomic change log)
CREATE TABLE IF NOT EXISTS public.transcript_edits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID REFERENCES public.transcript_segments(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    before_text TEXT NOT NULL,
    after_text TEXT NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Update segments to track latest edit
ALTER TABLE public.transcript_segments ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.transcript_segments ADD COLUMN IF NOT EXISTS editor_id UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE public.transcript_edits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage edits of their sessions" ON public.transcript_edits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_edits.session_id
            AND sessions.user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_edits_segment_id ON public.transcript_edits(segment_id);
CREATE INDEX IF NOT EXISTS idx_edits_session_id ON public.transcript_edits(session_id);
