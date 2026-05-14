import { supabase } from '@/lib/supabase/client';

export class EmbeddingService {
  /**
   * Generates embeddings for a given text using OpenAI.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Chunks and indexes a transcript for a session.
   */
  static async indexTranscript(sessionId: string, segments: any[]) {
    console.log(`[EmbeddingService] Indexing session ${sessionId}...`);
    
    for (const segment of segments) {
      const embedding = await this.generateEmbedding(segment.transcript_text);
      
      const { error } = await supabase
        .from('transcript_embeddings')
        .insert({
          session_id: sessionId,
          transcript_id: segment.id,
          content: segment.transcript_text,
          embedding: embedding,
          metadata: {
            start_time: segment.start_time,
            speaker_id: segment.speaker_id
          }
        });

      if (error) console.error('[EmbeddingService] Error indexing chunk:', error);
    }
  }
}
