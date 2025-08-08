import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { partialRole = '', partialLocation = '' } = await req.json();
    const apiKey = process.env.GOOGLE_AI_STUDIOUS;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Google Gemini API key' }, { status: 500 });
    }
    const prompt = `Suggest the top 5 trending job roles and top 5 trending locations for tech jobs${partialLocation ? ' in ' + partialLocation : ''}${partialRole ? ' similar to ' + partialRole : ''}. Return the result as a JSON object with two arrays: roles and locations. Example: { "roles": ["Software Engineer", ...], "locations": ["Bangalore", ...] }`;

    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return NextResponse.json({ error: 'Gemini API error', details: errorText }, { status: 500 });
    }
    const geminiData = await geminiRes.json();
    let roles = [], locations = [];
    try {
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
      roles = Array.isArray(json.roles) ? json.roles : [];
      locations = Array.isArray(json.locations) ? json.locations : [];
    } catch (e) {
      roles = [];
      locations = [];
    }
    return NextResponse.json({ success: true, roles, locations });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 