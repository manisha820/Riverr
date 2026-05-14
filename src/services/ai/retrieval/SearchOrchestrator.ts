import { supabase } from '@/lib/supabase/client';
import { EmbeddingService } from './EmbeddingService';

export interface SearchResult {
  id: string;
  session_id: string;
  session_title: string;
  transcript_id: string;
  content: string;
  similarity: number;
  metadata: any;
  created_at: string;
}

export class SearchOrchestrator {
  /**
   * Performs global semantic search across the entire library.
   */
  static async search(userId: string, query: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      // 1. Generate Query Embedding
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // 2. Execute Global Match
      const { data, error } = await supabase.rpc('match_transcripts_global', {
        query_embedding: queryEmbedding,
        match_threshold: 0.4,
        match_count: limit,
        p_user_id: userId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SearchOrchestrator] Search failed:', error);
      throw error;
    }
  }

  /**
   * Hybrid Search (Keyword + Vector) placeholder
   */
  static async hybridSearch(userId: string, query: string) {
    // In production, we'd merge results from RPC and FTS
    return this.search(userId, query);
  }
}
