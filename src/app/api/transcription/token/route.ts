import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json(
      { error: 'Deepgram API key not configured' },
      { status: 500 }
    );
  }

  try {
    // We request a temporary key from Deepgram
    // In a real production app, we would restrict the scope of this key
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    const projectId = projects.projects[0].project_id;

    const keyResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: 'Temporary browser key',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 3600,
      }),
    });

    if (!keyResponse.ok) {
      throw new Error('Failed to create temporary key');
    }

    const keyData = await keyResponse.json();
    return NextResponse.json({ key: keyData.key });
  } catch (error) {
    console.error('[TokenRoute] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate temporary key' },
      { status: 500 }
    );
  }
}
