import { supabase } from '@/lib/supabase/client';

export type VersionType = 
  | 'raw' | 'refined' | 'auto_saved_draft' | 'manual_draft' 
  | 'published' | 'client_ready' | 'ai_enhanced' | 'archived';

export class VersionService {
  /**
   * Promotes current transcript to an immutable version checkpoint.
   */
  static async promoteVersion(
    sessionId: string,
    content: string,
    name: string,
    type: VersionType,
    userId: string,
    parentVersionId?: string,
    summary?: string
  ) {
    try {
      const { data, error } = await supabase
        .from('transcript_versions')
        .insert({
          session_id: sessionId,
          parent_version_id: parentVersionId || null,
          version_name: name,
          version_type: type,
          content: content,
          change_summary: summary || `Promoted to ${type}`,
          created_by: userId,
          is_locked: type === 'published' || type === 'client_ready'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[VersionService] Failed to promote version:', error);
      throw error;
    }
  }

  /**
   * Fetch version history for a session.
   */
  static async getVersionHistory(sessionId: string) {
    const { data, error } = await supabase
      .from('transcript_versions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Restore a specific version to the active session.
   * This typically involves updating the current segments based on the version content.
   */
  static async restoreVersion(versionId: string) {
    // Logic to parse content and overwrite current transcript_segments
    // but preserving the raw source.
    console.log(`[VersionService] Restoring version ${versionId}...`);
  }
}
