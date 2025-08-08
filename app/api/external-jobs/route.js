import { NextResponse } from 'next/server';
import { getApiConfig } from '../../lib/apiConfig';

function get(obj, path) {
  if (!path) return obj;
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function mapJobFields(job, fieldMap) {
  if (!fieldMap) return job;
  const mapped = {};
  for (const [to, from] of Object.entries(fieldMap)) {
    const value = get(job, from);
    mapped[to] = value !== undefined && typeof value !== 'object' ? value : (typeof value === 'object' && value !== null ? '' : value);
  }
  return { ...job, ...mapped };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || '';
    const location = searchParams.get('location') || '';
    const apiSource = searchParams.get('source') || 'rapidapi';

    const config = await getApiConfig(apiSource);
    if (!config) {
      return NextResponse.json({ error: `API config for ${apiSource} not found or disabled` }, { status: 500 });
    }

    // Build URL with queryTemplate if provided
    let url = config.endpoint;
    if (config.queryTemplate && apiSource !== 'jooble') {
      url += config.queryTemplate
        .replace('{title}', encodeURIComponent(title))
        .replace('{location}', encodeURIComponent(location));
    }

    // Build headers
    let headers = {};
    if (config.headers && typeof config.headers === 'object') {
      headers = { ...config.headers };
    } else {
      // fallback for legacy configs
      if (config.key) headers['x-rapidapi-key'] = config.key;
      if (config.host) headers['x-rapidapi-host'] = config.host;
    }

    let options = {
      method: config.method || 'GET',
      headers,
    };

    // Special handling for Jooble: POST with JSON body
    if (apiSource === 'jooble') {
      // Use defaults if fields are empty
      const joobleKeywords = title || 'it';
      const joobleLocation = location || 'world jobs';
      const joobleBody = JSON.stringify({
        keywords: joobleKeywords,
        location: joobleLocation
      });
      console.log('[Jooble Debug] URL:', url);
      console.log('[Jooble Debug] Headers:', headers);
      console.log('[Jooble Debug] Body:', joobleBody);
      options.body = joobleBody;
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[External API Error] Status: ${response.status}`);
      console.error(`[External API Error] Body:`, errorText);
      if (response.status === 429) {
        return NextResponse.json({
          error: 'API quota exceeded',
          message: 'The external API has reached its monthly limit. Please try again later or contact support.',
          details: errorText
        }, { status: 429 });
      }
      return NextResponse.json({
        error: 'External API error',
        message: `Failed to fetch jobs from ${apiSource}`,
        details: errorText,
        debug: {
          url,
          headers,
          body: options.body || null
        }
      }, { status: response.status });
    }

    let data = await response.json();
    // Extract jobs array using jobsPath
    let jobsArray = get(data, config.jobsPath);
    if (!Array.isArray(jobsArray)) {
      // fallback: try root array
      if (Array.isArray(data)) jobsArray = data;
      else jobsArray = [];
    }

    // Filter by title and location (case-insensitive, partial match)
    const titleLower = title.trim().toLowerCase();
    const locationLower = location.trim().toLowerCase();
    jobsArray = jobsArray.filter(job => {
      // Try to use mapped fields if fieldMap is present
      let jobTitle = job.title || job.position || '';
      let jobLocation = job.location || '';
      if (config.fieldMap) {
        if (config.fieldMap.title && job[config.fieldMap.title]) jobTitle = job[config.fieldMap.title];
        if (config.fieldMap.location && job[config.fieldMap.location]) jobLocation = job[config.fieldMap.location];
      }
      jobTitle = jobTitle.toLowerCase();
      jobLocation = jobLocation.toLowerCase();
      const titleMatch = !titleLower || jobTitle.includes(titleLower);
      const locationMatch = !locationLower || jobLocation.includes(locationLower);
      return titleMatch && locationMatch;
    });

    // Map fields if fieldMap is present
    if (config.fieldMap) {
      jobsArray = jobsArray.map(job => mapJobFields(job, config.fieldMap));
    }

    return NextResponse.json({
      success: true,
      jobs: jobsArray,
      source: apiSource,
      count: jobsArray.length
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to fetch external jobs',
      details: error.message
    }, { status: 500 });
  }
} 