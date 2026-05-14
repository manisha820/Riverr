-- 🚀 Riverr RAG & Vector Search Schema

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Transcript Embeddings (Semantic Chunks)
CREATE TABLE IF NOT EXISTS public.transcript_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES public.transcript_segments(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Dimension for text-embedding-3-small
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transcript_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage embeddings of their sessions" ON public.transcript_embeddings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = transcript_embeddings.session_id
            AND sessions.user_id = auth.uid()
        )
    );

-- 2. Similarity Search Function
CREATE OR REPLACE FUNCTION match_transcript_embeddings (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_session_id UUID
)
RETURNS TABLE (
  id UUID,
  transcript_id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    te.id,
    te.transcript_id,
    te.content,
    1 - (te.embedding <=> query_embedding) AS similarity,
    te.metadata
  FROM public.transcript_embeddings te
  WHERE te.session_id = p_session_id
    AND 1 - (te.embedding <=> query_embedding) > match_threshold
  ORDER BY te.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_embeddings_session_id ON public.transcript_embeddings(session_id);
