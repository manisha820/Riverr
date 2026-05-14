import { supabase } from '@/lib/supabase/client';
import { EmbeddingService } from '../retrieval/EmbeddingService';

export class MemoryService {
  /**
   * Retrieves long-term memories relevant to a query.
   */
  static async retrieveMemories(workspaceId: string, query: string, limit: number = 5) {
    try {
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      const { data, error } = await supabase.rpc('match_workspace_memories', {
        query_embedding: queryEmbedding,
        match_threshold: 0.4,
        match_count: limit,
        p_workspace_id: workspaceId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[MemoryService] Retrieval failed:', error);
      return [];
    }
  }

  /**
   * Consolidates a fact into long-term workspace memory.
   */
  static async consolidateMemory(workspaceId: string, topic: string, summary: string, sourceSessionId: string) {
    const embedding = await EmbeddingService.generateEmbedding(`${topic}: ${summary}`);
    
    const { data: memory, error } = await supabase
      .from('workspace_memories')
      .insert({
        workspace_id: workspaceId,
        topic: topic,
        summary: summary,
        embedding: embedding
      })
      .select()
      .single();

    if (error) throw error;

    // Link source
    await supabase.from('memory_sources').insert({
      memory_id: memory.id,
      session_id: sourceSessionId
    });

    return memory;
  }
}
