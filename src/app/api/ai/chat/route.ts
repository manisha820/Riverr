import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { query, context, sessionId } = await req.json();
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
  }

  const systemPrompt = `
    You are the Riverr AI Assistant. Your task is to answer questions about a transcript.
    
    ## Guidelines:
    - Use ONLY the provided context to answer.
    - If the answer is not in the context, say "I don't have enough information in this transcript to answer that."
    - Be concise and professional.
    - When referring to a specific part of the transcript, use citations in brackets like [ID: uuid].
    
    ## Context:
    ${context}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: true,
        temperature: 0, // Strict grounding
      }),
    });

    return new Response(response.body);
  } catch (error) {
    console.error('[ChatAPI] Error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
