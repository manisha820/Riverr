-- 💡 Riverr AI Recommendation Layer Schema

-- 1. Recommendations (Proactive insights)
CREATE TYPE recommendation_type AS ENUM (
    'related_knowledge', 'people_collaboration', 'workflow_action', 
    'predictive_risk', 'historical_memory'
);

CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    type recommendation_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    reasoning TEXT NOT NULL, -- "Explainable AI" section
    confidence_score FLOAT DEFAULT 1.0,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_dismissed BOOLEAN DEFAULT false,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Recommendation Feedback (Learning loop)
CREATE TABLE IF NOT EXISTS public.recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    feedback_type TEXT CHECK (feedback_type IN ('useful', 'irrelevant', 'incorrect')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view recommendations in their workspaces" ON public.recommendations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = recommendations.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_workspace ON public.recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON public.recommendations(type);
