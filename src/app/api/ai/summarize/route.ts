import { NextResponse } from 'next/server';
import { MEETING_SUMMARY_PROMPT } from '@/services/ai/prompts/meeting_summary';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { transcript, type } = await req.json();
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    // Mock response if key is missing for development
    return NextResponse.json({ 
      summary: "### Mock Summary\nThis is a placeholder summary. Please configure `OPENAI_API_KEY` to enable real AI summarization.\n\n- **Key Topic:** Development of Riverr platform.\n- **Decision:** Use Next.js and Supabase.\n- **Action Item:** [ ] Implement AI pipeline."
    });
  }

  try {
    const prompt = MEETING_SUMMARY_PROMPT.replace('{{transcript}}', transcript);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional transcription assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ summary: data.choices[0].message.content });
  } catch (error) {
    console.error('[AIAPI] Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
