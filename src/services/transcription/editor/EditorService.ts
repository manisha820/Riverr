import { supabase } from '@/lib/supabase/client';

export class EditorService {
  /**
   * Non-destructively saves an edit to a transcript segment.
   * 1. Log the atomic edit (before/after)
   * 2. Update the segment with the new text (Refined Layer)
   * 3. (Optional) Create a new version entry
   */
  static async saveSegmentEdit(
    segmentId: string, 
    sessionId: string,
    beforeText: string, 
    afterText: string,
    userId: string
  ) {
    if (beforeText === afterText) return;

    try {
      // 1. Log the edit
      const { error: editError } = await supabase
        .from('transcript_edits')
        .insert({
          segment_id: segmentId,
          session_id: sessionId,
          user_id: userId,
          before_text: beforeText,
          after_text: afterText,
          change_summary: 'Manual user edit'
        });

      if (editError) throw editError;

      // 2. Update the canonical segment text (Non-destructive to RAW because RAW is stored in audit logs)
      const { error: segmentError } = await supabase
        .from('transcript_segments')
        .update({
          transcript_text: afterText,
          last_edited_at: new Date().toISOString(),
          editor_id: userId
        })
        .eq('id', segmentId);

      if (segmentError) throw segmentError;

      console.log(`[EditorService] Segment ${segmentId} updated successfully.`);
    } catch (error) {
      console.error('[EditorService] Failed to persist edit:', error);
      throw error;
    }
  }
}
