-- 👥 Riverr Speaker Identity & Diarization Schema

-- 1. Speaker Profiles (Persistent identities across sessions)
CREATE TABLE IF NOT EXISTS public.speaker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    voice_fingerprint_id TEXT, -- Reference to biometric embedding
    is_user BOOLEAN DEFAULT false, -- If this profile belongs to the session owner
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Update Transcript Segments with speaker fields
ALTER TABLE public.transcript_segments ADD COLUMN IF NOT EXISTS temporary_speaker_label TEXT; -- 'Speaker A'
ALTER TABLE public.transcript_segments ADD COLUMN IF NOT EXISTS speaker_id UUID REFERENCES public.speaker_profiles(id);
ALTER TABLE public.transcript_segments ADD COLUMN IF NOT EXISTS diarization_confidence FLOAT;

-- Enable RLS
ALTER TABLE public.speaker_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own speaker profiles" ON public.speaker_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_speaker_profiles_user_id ON public.speaker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_segments_speaker_id ON public.transcript_segments(speaker_id);
