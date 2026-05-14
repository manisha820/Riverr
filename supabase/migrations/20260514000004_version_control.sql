-- 🌲 Riverr Version Control Schema

-- 1. Enhanced Transcript Versions (Lineage & Snapshots)
CREATE TABLE IF NOT EXISTS public.transcript_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    parent_version_id UUID REFERENCES public.transcript_versions(id) ON DELETE SET NULL,
    branch_id UUID, -- Future-ready for multi-branch editing
    version_name TEXT NOT NULL,
    version_type TEXT CHECK (version_type IN (
        'raw', 'refined', 'auto_saved_draft', 'manual_draft', 
        'published', 'client_ready', 'ai_enhanced', 'archived'
    )) DEFAULT 'manual_draft',
    content TEXT NOT NULL, -- Full snapshot for now (Hybrid logic later)
    change_summary TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_locked BOOLEAN DEFAULT false,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Version Diff Log (Detailed changes)
CREATE TABLE IF NOT EXISTS public.version_diffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID REFERENCES public.transcript_versions(id) ON DELETE CASCADE NOT NULL,
    diff_json JSONB NOT NULL, -- Detailed segment-level or word-level diff
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transcript_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_diffs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage versions of their sessions" ON public.transcript_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_versions.session_id
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view diffs of their versions" ON public.version_diffs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.transcript_versions v
            JOIN public.sessions s ON v.session_id = s.id
            WHERE v.id = version_diffs.version_id
            AND s.user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_versions_parent_id ON public.transcript_versions(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_versions_session_type ON public.transcript_versions(session_id, version_type);
