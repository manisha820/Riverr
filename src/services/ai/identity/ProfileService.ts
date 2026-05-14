import { supabase } from '@/lib/supabase/client';

export interface SpeakerProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_user: boolean;
}

export class ProfileService {
  /**
   * Fetch or create a persistent profile for a speaker.
   */
  static async getOrCreateProfile(userId: string, name: string): Promise<SpeakerProfile> {
    const { data, error } = await supabase
      .from('speaker_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('full_name', name)
      .maybeSingle();

    if (data) return data;

    const { data: newProfile, error: insertError } = await supabase
      .from('speaker_profiles')
      .insert({
        user_id: userId,
        full_name: name
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newProfile;
  }

  /**
   * Bulk resolve session speakers to profiles.
   */
  static async resolveSessionSpeakers(sessionId: string) {
    // Logic to analyze session segments and map 'Speaker A' -> 'Manish'
    console.log(`[ProfileService] Resolving speakers for session ${sessionId}...`);
  }
}
