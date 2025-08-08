import { useState, useEffect } from 'react';

const PLACEHOLDER_LOGO = '/placeholder.svg';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function getInitialMappedJob(job) {
  // Remote OK mapping
  if (job.slug && job.apply_url && job.position && job.company) {
    return {
      title: job.position || '',
      companyName: job.company || '',
      companyLogo: job.company_logo || job.logo || '',
      overview: stripHtml(job.description) || '',
      location: job.location || '',
      salary: (job.salary_min && job.salary_max) ? `$${job.salary_min} - $${job.salary_max}` : '',
      experience: '',
      qualification: '',
      lastDate: '',
      category: '',
      subCategory: '',
      jobType: '',
      applyLink: job.apply_url || job.url || '',
      source: 'remoteok',
      externalJobId: job.id || job.slug || '',
      skills: Array.isArray(job.tags) ? job.tags.join(', ') : '',
    };
  }
  return {
    title: job.title || job.job_title || '',
    companyName: job.organization || job.company || job.company_name || '',
    companyLogo: job.organization_logo || '',
    overview: job.description_text || job.description || job.job_description || '',
    location: (job.locations_derived && job.locations_derived[0]) || (job.locations_alt_raw && job.locations_alt_raw[0]) || job.location || '',
    salary: job.salary_raw || job.salary || '',
    experience: '',
    qualification: '',
    lastDate: job.date_validthrough || '',
    category: '',
    subCategory: '',
    jobType: (job.employment_type && job.employment_type[0]) || '',
    applyLink: job.applyLink || job.url || job.job_url || '',
    source: 'external-api',
    externalJobId: job.id || job._id || job.job_id || '',
    skills: '',
  };
}

// Simple extraction helpers
function extractExperience(desc) {
  if (!desc) return '';
  const expMatch = desc.match(/([0-9]+\+?)\s*(years?|yrs?)\s*(of)?\s*experience/i);
  if (expMatch) return expMatch[0];
  if (/senior/i.test(desc)) return 'Senior';
  if (/entry level|fresher/i.test(desc)) return 'Entry Level';
  return '';
}
function extractQualification(desc) {
  if (!desc) return '';
  const quals = [
    'B.Tech', 'B.E.', 'MCA', 'B.Sc', 'M.Sc', 'Bachelor', 'Master', 'PhD', 'MBA', 'Diploma', 'Graduate', 'Postgraduate'
  ];
  for (const q of quals) {
    if (desc.toLowerCase().includes(q.toLowerCase())) return q;
  }
  return '';
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function extractSkills(desc) {
  if (!desc) return '';
  const skills = [
    'Java', 'Spring Boot', 'Hibernate', 'SQL', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Kafka', 'Jenkins', 'Git', 'GraphQL', 'REST', 'SOAP', 'Microservices', 'DevOps', 'JIRA', 'Visio', 'JSON', 'XML', 'CI', 'RDBMS', 'Linux', 'Python', 'JavaScript', 'React', 'Node', 'C#', 'C++', 'Angular', 'HTML', 'CSS', 'NoSQL', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Selenium', 'Testing', 'API', 'Cloud', 'CI/CD', 'Automation', 'Team Lead', 'Mentor', 'Leadership'
  ];
  const found = skills.filter(skill => new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i').test(desc));
  return found.join(', ');
}

export default function ExternalJobsImport() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ title: '', location: '' });
  const [importingId, setImportingId] = useState(null);
  const [apiSource, setApiSource] = useState('rapidapi');
  const [apiConfigs, setApiConfigs] = useState([]);
  const [previewJob, setPreviewJob] = useState(null);
  const [mappedJob, setMappedJob] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [showRaw, setShowRaw] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');

  // Fetch enabled API configs on mount
  useEffect(() => {
    fetch('/api/public-api-configs')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.apis)) {
          setApiConfigs(data.apis);
          // If current apiSource is not in the list, reset to first
          if (!data.apis.some(api => api.id === apiSource)) {
            setApiSource(data.apis[0]?.id || 'ai');
          }
        }
      });
  }, []);

  const fetchExternalJobs = async () => {
    setLoading(true);
    setError('');
    setJobs([]);
    try {
      let url;
      if (apiSource === 'ai') {
        url = `/api/ai-jobs?title=${encodeURIComponent(filters.title)}&location=${encodeURIComponent(filters.location)}`;
      } else {
        url = `/api/external-jobs?title=${encodeURIComponent(filters.title)}&location=${encodeURIComponent(filters.location)}&source=${apiSource}`;
      }
      
      console.log('[ExternalJobsImport] Fetching from URL:', url);
      console.log('[ExternalJobsImport] API Source:', apiSource);
      console.log('[ExternalJobsImport] Filters:', filters);
      
      const res = await fetch(url);
      console.log('[ExternalJobsImport] Response status:', res.status);
      console.log('[ExternalJobsImport] Response ok:', res.ok);
      
      const data = await res.json();
      console.log('[ExternalJobsImport] Response data:', data);
      
      if (!res.ok) {
        if (res.status === 429) {
          setError('API quota exceeded. The external API has reached its monthly limit. Please try again later or contact support.');
        } else {
          setError(data.message || `Error: ${res.status}`);
        }
        return;
      }
      
      if (data.success && data.jobs) {
        console.log('[ExternalJobsImport] Setting jobs:', data.jobs);
        console.log('[ExternalJobsImport] Jobs count:', data.jobs.length);
        setJobs(data.jobs);
      } else {
        console.log('[ExternalJobsImport] No jobs in response or invalid structure');
        setJobs([]);
      }
    } catch (err) {
      console.error('[ExternalJobsImport] Error fetching jobs:', err);
      setError(err.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (job) => {
    setPreviewJob(job);
    setMappedJob(getInitialMappedJob(job));
    if (job.locations_derived && Array.isArray(job.locations_derived) && job.locations_derived.length > 0) {
      setLocationOptions(job.locations_derived);
    } else if (job.locations_alt_raw && Array.isArray(job.locations_alt_raw) && job.locations_alt_raw.length > 0) {
      setLocationOptions(job.locations_alt_raw);
    } else {
      setLocationOptions([]);
    }
    setShowRaw(false);
    setCopySuccess('');
  };

  const handleImport = async (jobData) => {
    setImportingId(jobData.externalJobId);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(jobData)
      });
      if (!res.ok) throw new Error('Failed to import job');
      alert('Job imported successfully!');
      setPreviewJob(null);
      setMappedJob(null);
    } catch (err) {
      alert('Error importing job: ' + (err.message || 'Unknown error'));
    } finally {
      setImportingId(null);
    }
  };

  function handleCopyRaw(job) {
    navigator.clipboard.writeText(JSON.stringify(job, null, 2));
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 1500);
  }

  async function handleAnalyzeDescription() {
    if (!mappedJob || !previewJob) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: previewJob })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAiError(data.error || 'AI analysis failed');
        setAiLoading(false);
        return;
      }
      const ai = data.ai || {};
      setMappedJob(m => ({
        ...m,
        experience: ai.experience || m.experience,
        qualification: ai.qualification || m.qualification,
        skills: ai.skills || m.skills,
        category: ai.category || m.category,
        subCategory: ai.subCategory || m.subCategory,
        jobType: ai.jobType || m.jobType,
        companyLogo: ai.companyLogo || m.companyLogo,
      }));
    } catch (err) {
      setAiError(err.message || 'AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSuggestAI() {
    setSuggestLoading(true);
    setSuggestError('');
    setRoleSuggestions([]);
    setLocationSuggestions([]);
    try {
      const res = await fetch('/api/ai-suggest-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partialRole: filters.title, partialLocation: filters.location })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSuggestError(data.error || 'AI suggestion failed');
        setSuggestLoading(false);
        return;
      }
      setRoleSuggestions(data.roles || []);
      setLocationSuggestions(data.locations || []);
    } catch (err) {
      setSuggestError(err.message || 'AI suggestion failed');
    } finally {
      setSuggestLoading(false);
    }
  }

  // Automatically analyze with AI when previewJob is set
  useEffect(() => {
    if (previewJob && mappedJob && !aiLoading) {
      handleAnalyzeDescription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewJob]);

  function renderApiFields(job) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="font-semibold">Raw API Fields</h4>
          <button
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 border border-gray-300"
            onClick={() => setShowRaw((v) => !v)}
            type="button"
          >
            {showRaw ? 'Hide Raw Data' : 'Show Raw Data'}
          </button>
          {showRaw && (
            <button
              className="text-xs px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 border border-blue-300"
              onClick={() => handleCopyRaw(job)}
              type="button"
            >
              Copy to Clipboard
            </button>
          )}
          {copySuccess && <span className="text-green-600 text-xs ml-2">{copySuccess}</span>}
        </div>
        {showRaw && (
          <div className="overflow-x-auto max-w-full max-h-64 border rounded bg-gray-50">
            <pre className="text-xs p-2 whitespace-pre-wrap break-all min-w-[300px] max-w-[600px]">{JSON.stringify(job, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  function renderMappedFields() {
    if (!mappedJob) return null;
    const requiredFields = ['title', 'companyName', 'overview', 'location', 'applyLink'];
    const missingFields = requiredFields.filter(f => !mappedJob[f]);
    return (
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="font-semibold">Mapped Fields (Edit before import)</h4>
          {aiLoading && <span className="text-xs text-yellow-700 ml-2">Analyzing with AI...</span>}
          {aiError && <span className="text-xs text-red-600 ml-2">{aiError}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center gap-4 mb-2">
            <span className="text-xs font-medium text-gray-700">Company Logo:</span>
            <img
              src={mappedJob.companyLogo || PLACEHOLDER_LOGO}
              alt="Company Logo"
              className="w-16 h-16 object-contain bg-gray-100 rounded border"
              onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_LOGO; }}
            />
          </div>
          {Object.entries(mappedJob).map(([key, value]) => {
            if (key === 'companyLogo' || key === 'source' || key === 'externalJobId') return null;
            if (key === 'overview') {
              return (
                <div key={key} className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <textarea
                    className="border rounded px-2 py-1 w-full text-sm min-h-[100px]"
                    value={value}
                    onChange={e => setMappedJob(m => ({ ...m, [key]: e.target.value }))}
                  />
                </div>
              );
            }
            if (key === 'location' && locationOptions.length > 1) {
              return (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <select
                    className="border rounded px-2 py-1 w-full text-sm"
                    value={value}
                    onChange={e => setMappedJob(m => ({ ...m, [key]: e.target.value }))}
                  >
                    {locationOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (key === 'skills') {
              return (
                <div key={key} className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                  <input
                    className="border rounded px-2 py-1 w-full text-sm"
                    value={value}
                    onChange={e => setMappedJob(m => ({ ...m, [key]: e.target.value }))}
                  />
                </div>
              );
            }
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
                <input
                  className="border rounded px-2 py-1 w-full text-sm"
                  value={value}
                  onChange={e => setMappedJob(m => ({ ...m, [key]: e.target.value }))}
                  disabled={key === 'source' || key === 'externalJobId'}
                />
              </div>
            );
          })}
        </div>
        {missingFields.length > 0 && (
          <div className="mt-3 text-sm text-red-600">
            <b>Note:</b> Please fill in all required fields: {missingFields.join(', ')}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Import Jobs from External API</h2>
      {/* API Source Toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">API Source:</label>
        <div className="flex gap-4 flex-wrap">
          {apiConfigs.map(api => (
            <label className="flex items-center" key={api.id}>
              <input
                type="radio"
                value={api.id}
                checked={apiSource === api.id}
                onChange={e => setApiSource(e.target.value)}
                className="mr-2"
              />
              {api.name}
            </label>
          ))}
          <label className="flex items-center" key="ai">
            <input
              type="radio"
              value="ai"
              checked={apiSource === 'ai'}
              onChange={e => setApiSource(e.target.value)}
              className="mr-2"
            />
            AI Generated Jobs (Gemini)
          </label>
        </div>
      </div>
      <form
        className="flex flex-col sm:flex-row gap-4 mb-6"
        onSubmit={e => { e.preventDefault(); fetchExternalJobs(); }}
      >
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Role / Title"
              value={filters.title}
              onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
            />
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 border border-blue-300"
              onClick={handleSuggestAI}
              disabled={suggestLoading}
              title="Suggest trending roles and locations with AI"
            >
              {suggestLoading ? '...' : 'Suggest with AI'}
            </button>
          </div>
          {roleSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {roleSuggestions.map(role => (
                <span
                  key={role}
                  className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs"
                  onClick={() => setFilters(f => ({ ...f, title: role }))}
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Location"
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          />
          {locationSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {locationSuggestions.map(loc => (
                <span
                  key={loc}
                  className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs"
                  onClick={() => setFilters(f => ({ ...f, location: loc }))}
                >
                  {loc}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Fetch Jobs'}
        </button>
      </form>
      {suggestError && <div className="text-red-500 mb-2 text-xs">{suggestError}</div>}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="text-red-800 font-medium mb-2">Error</div>
          <div className="text-red-600 mb-3">{error}</div>
          {error.includes('quota exceeded') && (
            <div className="text-sm text-red-600">
              <p className="mb-2"><strong>What you can do:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try switching to a different API source using the radio buttons above</li>
                <li>Wait until next month when the quota resets</li>
                <li>Contact support to upgrade the API plan</li>
                <li>Add jobs manually using the "Add New Job" tab</li>
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Apply Link</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && !loading && (
              <tr><td colSpan={5} className="text-center py-4">No jobs found.</td></tr>
            )}
            {jobs.map((job, idx) => (
              <tr key={job.id || job._id || idx}>
                <td className="border px-4 py-2">{job.title || job.job_title || ''}</td>
                <td className="border px-4 py-2">{job.organization || job.company || job.company_name || ''}</td>
                <td className="border px-4 py-2">{(job.locations_derived && job.locations_derived[0]) || (job.locations_alt_raw && job.locations_alt_raw[0]) || job.location || ''}</td>
                <td className="border px-4 py-2">
                  {job.link || job.applyLink || job.url || job.job_url ? (
                    <a
                      href={job.link || job.applyLink || job.url || job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Apply
                    </a>
                  ) : ''}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={() => handlePreview(job)}
                    disabled={importingId === (job.id || job._id || job.job_id)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-400 mt-4">* Jobs imported from external API will be marked as <b>external-api</b> in the database.</div>

      {/* Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => { setPreviewJob(null); setMappedJob(null); setLocationOptions([]); }}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Preview & Import Job</h3>
            {renderApiFields(previewJob)}
            {renderMappedFields()}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => { setPreviewJob(null); setMappedJob(null); setLocationOptions([]); }}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={() => handleImport(mappedJob)}
                disabled={importingId === mappedJob.externalJobId || (['title','companyName','overview','location','applyLink'].some(f => !mappedJob[f]))}
              >
                {importingId === mappedJob.externalJobId ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 