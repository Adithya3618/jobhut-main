import { NextResponse } from 'next/server';

async function checkLinkOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || '';
    const location = searchParams.get('location') || '';
    const apiKey = process.env.GOOGLE_AI_STUDIOUS;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Google Gemini API key' }, { status: 500 });
    }
    const prompt = `Search the web and list the latest 5 job openings for the role of '${title}' in '${location}'. For each job, provide the following fields: title, company, location, description, and a direct link to apply (applyLink).\n\nIMPORTANT:\n- Only include jobs that are currently open and accepting applications.\n- The applyLink must be a direct, working link to the job application page (not expired, not closed, not a generic company page).\n- Do not include jobs that are closed, expired, or have broken links.\n- If you are unsure if a job is open, do not include it.\n\nReturn the result as a JSON array of job objects. If you can't find any jobs, return an empty array.`;

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
    let jobs = [];
    try {
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      jobs = JSON.parse(text.match(/\[.*\]/s)?.[0] || '[]');
    } catch (e) {
      jobs = [];
    }
    // Filter out jobs without a non-empty applyLink
    jobs = jobs.filter(j => j.applyLink && typeof j.applyLink === 'string' && j.applyLink.trim().length > 0);
    // Validate applyLink URLs (HEAD request, must be HTTP 200)
    const jobsWithValidLinks = await Promise.all(
      jobs.map(async job => {
        const ok = await checkLinkOk(job.applyLink);
        return ok ? job : null;
      })
    );
    const validJobs = jobsWithValidLinks.filter(Boolean);
    return NextResponse.json({ success: true, jobs: validJobs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 