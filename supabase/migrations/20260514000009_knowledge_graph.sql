-- 🕸️ Riverr Knowledge Graph Schema

-- 1. Entities (Nodes)
CREATE TYPE entity_type AS ENUM (
    'person', 'topic', 'decision', 'action_item', 'project', 
    'organization', 'product', 'deadline', 'risk'
);

CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type entity_type NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, name, type)
);

-- 2. Relationships (Edges)
CREATE TYPE relationship_type AS ENUM (
    'discussed_in', 'assigned_to', 'related_to', 'depends_on', 
    'follows_up_from', 'contradicts', 'references', 'approved_by'
);

CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    source_id UUID REFERENCES public.entities(id) ON DELETE CASCADE NOT NULL,
    target_id UUID REFERENCES public.entities(id) ON DELETE CASCADE NOT NULL,
    type relationship_type NOT NULL,
    confidence_score FLOAT DEFAULT 1.0,
    source_reference_id UUID, -- Reference to a session or transcript segment
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Entity Mentions (Linking nodes to transcripts)
CREATE TABLE IF NOT EXISTS public.entity_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    segment_id UUID REFERENCES public.transcript_segments(id) ON DELETE CASCADE NOT NULL,
    confidence_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_mentions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage entities in their workspaces" ON public.entities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = entities.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage relationships in their workspaces" ON public.relationships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = relationships.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Indexes for traversal
CREATE INDEX IF NOT EXISTS idx_relationships_source ON public.relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON public.relationships(target_id);
CREATE INDEX IF NOT EXISTS idx_mentions_session ON public.entity_mentions(session_id);
