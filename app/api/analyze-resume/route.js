import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { resume, jobDescription } = body;

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_STUDIOUS;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Google Gemini API key' }, { status: 500 });
    }

    let prompt = `Analyze the following resume and provide a detailed assessment. Include:\n1. Overall Score: Give a score out of 10 and explain why\n2. Key Strengths: List the main strengths and positive aspects\n3. Areas for Improvement: Identify specific areas that need enhancement\n4. Missing Elements: List important keywords or sections that should be added\n5. Format Suggestions: Provide specific formatting recommendations\n6. Expert Advice: Share additional tips to make the resume stand out\n\nResume content:\n${resume}`;

    if (jobDescription) {
      prompt = `Analyze the following resume for the given job description. Provide a detailed assessment including:\n1. Job Fit Score: Rate the match out of 10 and explain why\n2. Matching Strengths: List skills and experiences that align with the job\n3. Gap Analysis: Identify missing qualifications or skills\n4. Keyword Optimization: Suggest important keywords from the job description\n5. Tailoring Tips: Provide specific suggestions to customize the resume\n6. Interview Preparation: Share advice to address potential concerns\n\nResume content:\n${resume}\n\nJob Description:\n${jobDescription}`;
    }

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
    let analysisText = '';
    try {
      analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      analysisText = '';
    }
    return NextResponse.json({ success: true, analysis: analysisText });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}

