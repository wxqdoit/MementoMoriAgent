import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt, provider, apiKey } = await req.json();

    const key = apiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (!key) {
      return NextResponse.json({ success: false, error: 'No API Key configured' }, { status: 400 });
    }

    const endpoint = provider === 'anthropic'
      ? 'https://api.anthropic.com/v1/messages'
      : 'https://api.openai.com/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    let bodyData: any = {};
    if (provider === 'anthropic') {
      headers['x-api-key'] = key;
      headers['anthropic-version'] = '2023-06-01';
      bodyData = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      };
    } else {
      headers['Authorization'] = `Bearer ${key}`;
      bodyData = {
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt || 'You are Memento Mori Agent, responding strictly in JSON.' },
          { role: 'user', content: prompt },
        ],
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
