import { supabase } from '@/lib/supabase/client';

export class CommentService {
  /**
   * Post a new comment or reply.
   */
  static async postComment(
    sessionId: string,
    content: string,
    userId: string,
    segmentId?: string,
    parentId?: string
  ) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        session_id: sessionId,
        segment_id: segmentId || null,
        parent_id: parentId || null,
        user_id: userId,
        content: content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch threaded comments for a session.
   */
  static async getComments(sessionId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:auth.users(email)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Mark a discussion thread as resolved.
   */
  static async resolveComment(commentId: string) {
    const { error } = await supabase
      .from('comments')
      .update({ is_resolved: true })
      .eq('id', commentId);

    if (error) throw error;
  }
}
