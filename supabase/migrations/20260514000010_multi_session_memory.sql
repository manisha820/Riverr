-- 🧠 Riverr Multi-Session Cognitive Memory

-- 1. Workspace Memories (Consolidated long-term facts)
CREATE TABLE IF NOT EXISTS public.workspace_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    summary TEXT NOT NULL,
    embedding VECTOR(1536), -- Dimension for text-embedding-3-small
    relevance_score FLOAT DEFAULT 1.0,
    is_pinned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Memory Sources (Traceability to episodic sessions)
CREATE TABLE IF NOT EXISTS public.memory_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID REFERENCES public.workspace_memories(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    transcript_segment_id UUID REFERENCES public.transcript_segments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workspace_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage memories in their workspaces" ON public.workspace_memories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = workspace_memories.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- 3. Memory Similarity Search
CREATE OR REPLACE FUNCTION match_workspace_memories (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_workspace_id UUID
)
RETURNS TABLE (
  id UUID,
  topic TEXT,
  summary TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.topic,
    m.summary,
    1 - (m.embedding <=> query_embedding) AS similarity,
    m.metadata
  FROM public.workspace_memories m
  WHERE m.workspace_id = p_workspace_id
    AND 1 - (m.embedding <=> query_embedding) > match_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
