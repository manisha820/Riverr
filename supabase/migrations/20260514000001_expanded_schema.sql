-- 💎 Riverr Expanded Database Schema

-- 1. Transcript Segments (Granular storage for finalized text)
CREATE TABLE IF NOT EXISTS public.transcript_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    transcript_text TEXT NOT NULL,
    speaker_id TEXT, -- Future-ready for diarization
    start_time FLOAT, -- Start offset in seconds
    end_time FLOAT, -- End offset in seconds
    confidence_score FLOAT,
    provider_metadata JSONB DEFAULT '{}'::jsonb,
    refinement_version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Transcript Versions (Audit log for edits/refinements)
CREATE TABLE IF NOT EXISTS public.transcript_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    version_label TEXT, -- e.g., 'raw', 'refined', 'ai_summary'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Export Jobs (Asynchronous export tracking)
CREATE TABLE IF NOT EXISTS public.export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    format TEXT CHECK (format IN ('txt', 'pdf', 'docx')),
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage segments of their sessions" ON public.transcript_segments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_segments.session_id
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage versions of their sessions" ON public.transcript_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_versions.session_id
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own export jobs" ON public.export_jobs
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_segments_session_id ON public.transcript_segments(session_id);
CREATE INDEX IF NOT EXISTS idx_versions_session_id ON public.transcript_versions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
