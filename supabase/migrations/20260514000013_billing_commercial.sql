-- 💳 Riverr Commercial & Billing Schema

-- 1. Workspace Plans & Subscriptions
CREATE TYPE pricing_plan AS ENUM ('free', 'pro', 'enterprise');

CREATE TABLE IF NOT EXISTS public.workspace_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    plan pricing_plan DEFAULT 'free' NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    current_period_end TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id)
);

-- 2. Usage Ledger (Centralized consumption tracking)
CREATE TYPE usage_type AS ENUM (
    'recording_hours', 'ai_tokens', 'transcription_minutes', 
    'vector_storage', 'seats', 'automation_runs'
);

CREATE TABLE IF NOT EXISTS public.usage_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    type usage_type NOT NULL,
    amount DECIMAL NOT NULL DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, date_trunc('month', now())) NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, date_trunc('month', now()) + interval '1 month') NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, type, period_start)
);

-- 3. Plan Limits (Reference table)
CREATE TABLE IF NOT EXISTS public.plan_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan pricing_plan UNIQUE NOT NULL,
    max_recording_hours DECIMAL NOT NULL,
    max_ai_tokens BIGINT NOT NULL,
    max_seats INTEGER NOT NULL,
    features JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial limits
INSERT INTO public.plan_limits (plan, max_recording_hours, max_ai_tokens, max_seats, features)
VALUES 
('free', 5, 100000, 3, '{"summaries": true, "search": false}'),
('pro', 50, 2000000, 15, '{"summaries": true, "search": true, "automation": true, "memory": true}'),
('enterprise', 999999, 999999999, 999, '{"summaries": true, "search": true, "automation": true, "memory": true, "rbac": true}');

-- Enable RLS
ALTER TABLE public.workspace_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view billing plans" ON public.workspace_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = workspace_plans.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Admins can view usage" ON public.usage_ledger
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = usage_ledger.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_workspace ON public.usage_ledger(workspace_id);
CREATE INDEX IF NOT EXISTS idx_plans_stripe ON public.workspace_plans(stripe_subscription_id);
