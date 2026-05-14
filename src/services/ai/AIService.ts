import { supabase } from '@/lib/supabase/client';
import { MEETING_SUMMARY_PROMPT } from './prompts/meeting_summary';

export type SummaryType = 'concise' | 'detailed' | 'minutes' | 'executive';

export class AIService {
  /**
   * Orchestrates the summarization pipeline.
   * 1. Create AI job record
   * 2. Call AI Provider (Edge Route)
   * 3. Persist results
   * 4. Update job status
   */
  static async summarize(sessionId: string, transcript: string, type: SummaryType = 'concise') {
    // 1. Create Job
    const { data: job, error: jobError } = await supabase
      .from('ai_jobs')
      .insert({
        session_id: sessionId,
        job_type: 'summarization',
        status: 'processing',
        provider: 'openai/gpt-4o' // Placeholder
      })
      .select()
      .single();

    if (jobError) throw jobError;

    try {
      const startTime = Date.now();
      
      // 2. Call AI Provider (Internal API route to keep keys secret)
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, type })
      });

      if (!response.ok) throw new Error('AI Provider failed');
      const { summary } = await response.json();

      // 3. Persist Summary
      const { data: summaryRecord, error: summaryError } = await supabase
        .from('transcript_summaries')
        .insert({
          session_id: sessionId,
          content: summary,
          summary_type: type,
          model_version: 'gpt-4o'
        })
        .select()
        .single();

      if (summaryError) throw summaryError;

      // 4. Update Job
      await supabase
        .from('ai_jobs')
        .update({
          status: 'completed',
          duration_ms: Date.now() - startTime
        })
        .eq('id', job.id);

      return summaryRecord;
    } catch (error) {
      console.error('[AIService] Summarization failed:', error);
      await supabase
        .from('ai_jobs')
        .update({
          status: 'failed',
          error_log: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', job.id);
      throw error;
    }
  }
}
