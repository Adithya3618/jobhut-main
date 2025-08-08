import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { job } = await req.json();
    if (!job) {
      return NextResponse.json({ error: 'Missing job data' }, { status: 400 });
    }
    const apiKey = process.env.GOOGLE_AI_STUDIOUS;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Google Gemini API key' }, { status: 500 });
    }
    // Build the prompt
    const prompt = `Given the following job posting data (as JSON), extract the following fields as accurately as possible:\n\n- experience (e.g., '5+ years', 'Senior', 'Entry Level')\n- qualification (e.g., 'B.Tech', 'Bachelor', 'MCA', etc.)\n- skills (comma-separated, e.g., 'Java, Spring Boot, AWS')\n- category (e.g., 'Software', 'Finance', etc.)\n- subCategory (e.g., 'Java Developer', 'Data Engineer', etc.)\n- jobType (e.g., 'Full Time', 'Contract', 'Remote')\n- companyLogo (If the company logo is missing, generate a likely logo URL using the company domain, e.g., https://logo.clearbit.com/{domain} or the company’s website favicon. Use the organization/company name and domain from the job data to construct the logo URL if needed. Always return a companyLogo field with a valid URL if possible.)\n\nReturn the result as a JSON object with these fields.\n\nJob data:\n${JSON.stringify(job, null, 2)}`;

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
    // The response is in geminiData.candidates[0].content.parts[0].text
    let aiJson = {};
    try {
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      aiJson = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (e) {
      aiJson = {};
    }
    return NextResponse.json({ success: true, ai: aiJson });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 