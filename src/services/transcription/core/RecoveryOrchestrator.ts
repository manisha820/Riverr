import { LocalStorageService, LocalSessionState } from './LocalStorageService';
import { db } from '../../supabase/SupabaseService';
import { supabase } from '@/lib/supabase/client';

export class RecoveryOrchestrator {
  /**
   * Reconciles local unsynced state with cloud state.
   * Priority: Merge unsynced segments -> Update canonical cloud state.
   */
  static async syncLocalState(sessionId: string) {
    const localState = LocalStorageService.getSession();
    if (!localState || localState.sessionId !== sessionId) return;

    if (localState.unsyncedSegments.length > 0) {
      console.log(`[Recovery] Syncing ${localState.unsyncedSegments.length} unsynced segments...`);
      
      try {
        // In a real scenario, we would use a batched insert here
        for (const segment of localState.unsyncedSegments) {
          await db.saveSegment(sessionId, segment);
        }
        
        LocalStorageService.clearSyncedSegments();
        console.log("[Recovery] Sync complete");
      } catch (error) {
        console.error("[Recovery] Sync failed:", error);
      }
    }
  }

  /**
   * Attempt to restore a session's full transcript from Supabase.
   */
  static async restoreFromCloud(sessionId: string): Promise<string> {
    const { data, error } = await supabase
      .from('transcript_segments')
      .select('transcript_text')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("[Recovery] Failed to restore from cloud:", error);
      return "";
    }

    return data.map(s => s.transcript_text).join(" ");
  }

  /**
   * Detect if the application can resume the previous session.
   */
  static canResume(): boolean {
    const session = LocalStorageService.getSession();
    if (!session) return false;

    // A session is resumable if it was 'active' and updated within the last hour
    const lastUpdated = new Date(session.lastUpdated).getTime();
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    return session.status === 'active' && lastUpdated > oneHourAgo;
  }
}
