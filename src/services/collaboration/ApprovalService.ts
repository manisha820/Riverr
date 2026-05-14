import { supabase } from '@/lib/supabase/client';

export type ApprovalStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export class ApprovalService {
  /**
   * Updates the workflow status of a session.
   */
  static async updateStatus(
    sessionId: string,
    status: ApprovalStatus,
    userId: string
  ) {
    const updateData: any = { status };

    if (status === 'approved') {
      updateData.approved_by = userId;
      updateData.approved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) throw error;
  }
}
