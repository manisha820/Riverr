-- 🧠 Riverr AI Intelligence Schema

-- 1. Transcript Summaries (Non-destructive insights)
CREATE TABLE IF NOT EXISTS public.transcript_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, -- Markdown formatted summary
    summary_type TEXT CHECK (summary_type IN ('concise', 'detailed', 'minutes', 'executive')) DEFAULT 'concise',
    model_version TEXT, -- e.g., 'gpt-4o', 'claude-3-5-sonnet'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Action Items (Atomic trackable tasks)
CREATE TABLE IF NOT EXISTS public.action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    summary_id UUID REFERENCES public.transcript_summaries(id) ON DELETE CASCADE,
    task_text TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. AI Processing Jobs (Queue Tracking)
CREATE TABLE IF NOT EXISTS public.ai_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    job_type TEXT CHECK (job_type IN ('summarization', 'refinement', 'diarization')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    provider TEXT,
    error_log TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transcript_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage summaries of their sessions" ON public.transcript_summaries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_summaries.session_id
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage action items of their sessions" ON public.action_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = action_items.session_id
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their AI jobs" ON public.ai_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = ai_jobs.session_id
            AND sessions.user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_summaries_session_id ON public.transcript_summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_action_items_session_id ON public.action_items(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_session_id ON public.ai_jobs(session_id);
