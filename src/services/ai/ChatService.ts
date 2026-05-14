import { supabase } from '@/lib/supabase/client';
import { EmbeddingService } from './retrieval/EmbeddingService';
import { MemoryService } from './memory/MemoryService';

export class ChatService {
  /**
   * Performs the full RAG cycle:
   * 1. Embed query
   * 2. Search for relevant chunks
   * 3. Call Chat API with context
   */
  static async ask(sessionId: string, query: string, onUpdate: (chunk: string) => void, workspaceId?: string) {
    try {
      // 1. Embed Query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // 2. Search Session Context (Episodic)
      const { data: chunks, error } = await supabase.rpc('match_transcript_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5,
        p_session_id: sessionId
      });

      if (error) throw error;

      // 3. Search Workspace Memory (Semantic/Long-term)
      let longTermContext = "";
      if (workspaceId) {
        const memories = await MemoryService.retrieveMemories(workspaceId, query, 3);
        longTermContext = memories.map((m: any) => `[Historical Context] ${m.topic}: ${m.summary}`).join('\n\n');
      }

      // 4. Assemble Full Context
      const context = `
        ## Active Session Context:
        ${chunks.map((c: any) => `[ID: ${c.transcript_id}] ${c.content}`).join('\n\n')}
        
        ## Long-Term Workspace Knowledge:
        ${longTermContext}
      `;

      // 5. Call Streaming API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context, sessionId })
      });

      if (!response.ok) throw new Error('Chat API failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          onUpdate(decoder.decode(value));
        }
      }
    } catch (error) {
      console.error('[ChatService] Error:', error);
      throw error;
    }
  }
}
