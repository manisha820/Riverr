import { supabase } from '@/lib/supabase/client';

/**
 * 🚭 Riverr Production Smoke Test Suite
 * 
 * Run this in the live environment after every major deployment
 * to verify critical intelligence pathways.
 */

export const ProductionValidator = {
  /**
   * Validates database connectivity and RLS.
   */
  checkDatabase: async () => {
    const { data, error } = await supabase.from('workspaces').select('id').limit(1);
    if (error) return { success: false, error: error.message };
    return { success: true, count: data.length };
  },

  /**
   * Validates AI pipeline availability.
   */
  checkAIPipeline: async () => {
    try {
      const response = await fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ test: true }) });
      return { success: response.ok, status: response.status };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Validates WebSocket Realtime health.
   */
  checkRealtime: async (workspaceId: string) => {
    return new Promise((resolve) => {
      const channel = supabase.channel(`smoke-test-${workspaceId}`);
      channel
        .on('system', { event: 'subscribe' }, () => {
          supabase.removeChannel(channel);
          resolve({ success: true });
        })
        .subscribe((status: string) => {
          if (status === 'TIMED_OUT') resolve({ success: false, error: 'Connection timed out' });
        });
    });
  }
};
