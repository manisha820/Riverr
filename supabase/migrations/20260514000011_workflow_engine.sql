-- 🤖 Riverr Autonomous Workflow Engine Schema

-- 1. Workspace Integrations (Credentials & Config)
CREATE TABLE IF NOT EXISTS public.workspace_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL, -- 'slack', 'notion', 'jira', etc.
    config JSONB DEFAULT '{}'::jsonb,
    encrypted_credentials TEXT, -- Store encrypted tokens
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, provider)
);

-- 2. Automation Workflows (Rules)
CREATE TABLE IF NOT EXISTS public.automation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    trigger_event TEXT NOT NULL, -- 'action_item_detected', 'session_finalized'
    condition_logic JSONB DEFAULT '{}'::jsonb,
    action_payload JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Automation Execution Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE CASCADE NOT NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('success', 'failed', 'retrying', 'skipped')),
    error_message TEXT,
    execution_time_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workspace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage workspace integrations" ON public.workspace_integrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = workspace_integrations.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can manage workflows" ON public.automation_workflows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = automation_workflows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin', 'editor')
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_workspace ON public.automation_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_trigger ON public.automation_workflows(trigger_event);
