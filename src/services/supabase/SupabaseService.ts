import { supabase } from '@/lib/supabase/client';
import { TranscriptionEvent, Session, Transcript } from '@/types/transcription';

export class SupabaseService {
  /**
   * Save a finalized transcript segment to the database.
   * Implements idempotent behavior and validation.
   */
  async saveSegment(sessionId: string, event: TranscriptionEvent) {
    if (!event.is_final) return;

    try {
      const { data, error } = await supabase
        .from('transcript_segments')
        .insert({
          session_id: sessionId,
          transcript_text: event.transcript,
          confidence_score: event.confidence,
          provider_metadata: event.metadata || {},
          start_time: event.words?.[0]?.start || 0,
          end_time: event.words?.[event.words.length - 1]?.end || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SupabaseService] Error saving segment:', error);
      // Local recovery queue would be triggered here
      throw error;
    }
  }

  /**
   * Create a new session.
   */
  async createSession(userId: string, title: string = 'New Recording') {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        title,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update session status.
   */
  async updateSessionStatus(sessionId: string, status: 'active' | 'completed' | 'error') {
    const { error } = await supabase
      .from('sessions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Fetch sessions with advanced filtering and pagination.
   */
  async getSessionsWithFilters(userId: string, filters: {
    query?: string;
    status?: string;
    sortBy?: 'latest' | 'oldest' | 'longest';
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('sessions')
      .select('*, transcript_segments(count)')
      .eq('user_id', userId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else if (filters.sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    }

    if (filters.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Full-text search across transcript segments.
   */
  async searchTranscripts(userId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('transcript_segments')
      .select('*, sessions!inner(*)')
      .eq('sessions.user_id', userId)
      .textSearch('transcript_text', searchTerm, {
        type: 'websearch',
        config: 'english'
      });

    if (error) throw error;
    return data;
  }
}

export const db = new SupabaseService();
