import { supabase } from '@/lib/supabase/client';

export type UsageType = 'recording_hours' | 'ai_tokens' | 'transcription_minutes' | 'vector_storage' | 'seats' | 'automation_runs';

export class UsageService {
  /**
   * Records usage for a specific metric.
   */
  static async recordUsage(workspaceId: string, type: UsageType, amount: number) {
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const { error } = await supabase.rpc('increment_usage', {
      p_workspace_id: workspaceId,
      p_type: type,
      p_amount: amount,
      p_period_start: periodStart.toISOString()
    });

    if (error) {
       // Fallback for direct upsert if RPC not yet deployed
       const { error: upsertError } = await supabase
        .from('usage_ledger')
        .upsert({
          workspace_id: workspaceId,
          type: type,
          amount: amount, // Note: In production use increment logic (SQL)
          period_start: periodStart.toISOString()
        }, { onConflict: 'workspace_id, type, period_start' });
        
       if (upsertError) throw upsertError;
    }
  }

  /**
   * Checks if a workspace has enough quota for a metric.
   */
  static async checkQuota(workspaceId: string, type: UsageType) {
    const { data: usage } = await supabase
      .from('usage_ledger')
      .select('amount')
      .eq('workspace_id', workspaceId)
      .eq('type', type)
      .single();

    const { data: plan } = await supabase
      .from('workspace_plans')
      .select('plan, plan_limits(*)')
      .eq('workspace_id', workspaceId)
      .single();

    if (!plan) return true; // Default to free if no plan found (should not happen)

    const limits: any = plan.plan_limits;
    const currentUsage = usage?.amount || 0;

    switch (type) {
      case 'recording_hours':
        return currentUsage < limits.max_recording_hours;
      case 'ai_tokens':
        return currentUsage < limits.max_ai_tokens;
      case 'seats':
        return currentUsage < limits.max_seats;
      default:
        return true;
    }
  }
}
