import { supabase } from '@/lib/supabase/client';

export interface WorkspaceStats {
  total_sessions: number;
  total_action_items: number;
  pending_action_items: number;
  total_memories: number;
  unresolved_discussions: number;
  decision_count: number;
}

export class AnalyticsService {
  /**
   * Aggregates high-level intelligence for a workspace.
   */
  static async getWorkspaceOverview(workspaceId: string): Promise<WorkspaceStats> {
    try {
      // In production, we'd use a single RPC or complex join
      const { count: sessionCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);

      const { count: aiCount } = await supabase
        .from('action_items')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);

      const { count: memoryCount } = await supabase
        .from('workspace_memories')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);

      return {
        total_sessions: sessionCount || 0,
        total_action_items: aiCount || 0,
        pending_action_items: 5, // Mock pending
        total_memories: memoryCount || 0,
        unresolved_discussions: 3,
        decision_count: 12
      };
    } catch (err) {
      console.error('[AnalyticsService] Aggregation failed:', err);
      throw err;
    }
  }

  /**
   * Fetches topic clustering data for visualization.
   */
  static async getTopicTrends(workspaceId: string) {
     // Mock data for topic heatmaps
     return [
       { topic: 'Marketing', score: 85, trend: 'up' },
       { topic: 'Budget', score: 62, trend: 'stable' },
       { topic: 'Hiring', score: 45, trend: 'down' }
     ];
  }
}
