-- 🔍 Riverr Global Semantic Search

-- Global Similarity Search Function
-- Searches across ALL sessions belonging to the user
CREATE OR REPLACE FUNCTION match_transcripts_global (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  session_id UUID,
  session_title TEXT,
  transcript_id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    te.id,
    te.session_id,
    s.title as session_title,
    te.transcript_id,
    te.content,
    1 - (te.embedding <=> query_embedding) AS similarity,
    te.metadata,
    te.created_at
  FROM public.transcript_embeddings te
  JOIN public.sessions s ON te.session_id = s.id
  WHERE s.user_id = p_user_id
    AND 1 - (te.embedding <=> query_embedding) > match_threshold
  ORDER BY te.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Additional Indexing for Global Retrieval
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_created ON public.sessions(user_id, created_at DESC);
