import { supabase } from '@/lib/supabase/client';

export type RecommendationType = 'related_knowledge' | 'people_collaboration' | 'workflow_action' | 'predictive_risk' | 'historical_memory';

export class RecommendationService {
  /**
   * Generates and persists proactive recommendations for a workspace session.
   */
  static async generateRecommendations(workspaceId: string, sessionId: string) {
    console.log(`[RecommendationService] Analyzing session ${sessionId} for proactive insights...`);
    
    // In production, this would call an LLM with:
    // 1. Current session summary
    // 2. Knowledge Graph neighborhood
    // 3. Vector search of related historical memories
    
    const mockRecommendations = [
      {
        type: 'related_knowledge' as RecommendationType,
        title: 'Previous Budget Decision',
        content: 'We discussed a similar budget constraint in the "Q2 Planning" session.',
        reasoning: 'Semantic similarity detected between today\'s "API Costs" and the "Infrastructure Budget" discussion on March 12.',
        action_url: `/history/some-session-id`
      },
      {
        type: 'people_collaboration' as RecommendationType,
        title: 'Domain Expert: Manish',
        content: 'Manish has handled 80% of discussions related to "API Security".',
        reasoning: 'Knowledge Graph indicates Manish as the primary contributor to the "Security Architecture" entity.',
      }
    ];

    for (const rec of mockRecommendations) {
      await supabase.from('recommendations').insert({
        workspace_id: workspaceId,
        session_id: sessionId,
        ...rec
      });
    }
  }

  /**
   * Fetch active recommendations for a workspace.
   */
  static async getActiveRecommendations(workspaceId: string) {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('is_dismissed', false)
      .order('confidence_score', { ascending: false });

    if (error) throw error;
    return data;
  }
}
