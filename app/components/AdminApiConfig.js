import { useState, useEffect } from 'react';
import { useState as useReactState } from 'react';
import ReactMarkdown from 'react-markdown';

function maskKey(key) {
  if (!key) return '';
  return key.length > 6 ? key.slice(0, 3) + '...' + key.slice(-3) : '***';
}

export default function AdminApiConfig() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editApi, setEditApi] = useState(null);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addApi, setAddApi] = useState({ id: '', name: '', host: '', endpoint: '', key: '', enabled: true, method: 'GET', headers: '', queryTemplate: '', jobsPath: '', fieldMap: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [showGuide, setShowGuide] = useReactState(false);
  const [guideContent, setGuideContent] = useReactState('');

  useEffect(() => {
    fetchApis();
    // Load the guide content
    fetch('/EXTERNAL_API_CONFIG_GUIDE.md')
      .then(res => res.text())
      .then(setGuideContent);
  }, []);

  async function fetchApis() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-api-configs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch APIs');
      setApis(data.apis || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch APIs');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(idx) {
    setEditIdx(idx);
    setEditApi({ ...apis[idx], headers: apis[idx].headers ? JSON.stringify(apis[idx].headers, null, 2) : '', fieldMap: apis[idx].fieldMap ? JSON.stringify(apis[idx].fieldMap, null, 2) : '' });
  }
  function cancelEdit() {
    setEditIdx(null);
    setEditApi(null);
  }
  async function saveEdit() {
    setSaving(true);
    try {
      const apiToSave = { ...editApi };
      if (apiToSave.headers) {
        try { apiToSave.headers = JSON.parse(apiToSave.headers); } catch { apiToSave.headers = {}; }
      }
      if (apiToSave.fieldMap) {
        try { apiToSave.fieldMap = JSON.parse(apiToSave.fieldMap); } catch { apiToSave.fieldMap = {}; }
      }
      const res = await fetch('/api/admin-api-configs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiToSave)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save API config');
      setEditIdx(null);
      setEditApi(null);
      fetchApis();
    } catch (err) {
      alert(err.message || 'Failed to save API config');
    } finally {
      setSaving(false);
    }
  }
  async function saveAdd() {
    setSaving(true);
    try {
      const apiToAdd = { ...addApi };
      if (apiToAdd.headers) {
        try { apiToAdd.headers = JSON.parse(apiToAdd.headers); } catch { apiToAdd.headers = {}; }
      }
      if (apiToAdd.fieldMap) {
        try { apiToAdd.fieldMap = JSON.parse(apiToAdd.fieldMap); } catch { apiToAdd.fieldMap = {}; }
      }
      const res = await fetch('/api/admin-api-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiToAdd)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add API config');
      setAdding(false);
      setAddApi({ id: '', name: '', host: '', endpoint: '', key: '', enabled: true, method: 'GET', headers: '', queryTemplate: '', jobsPath: '', fieldMap: '' });
      fetchApis();
    } catch (err) {
      alert(err.message || 'Failed to add API config');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this API config?')) return;
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin-api-configs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete API config');
      fetchApis();
    } catch (err) {
      alert(err.message || 'Failed to delete API config');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-10xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Manage External API Configs</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowGuide(true)}
        >
          API Config Guide
        </button>
      </div>
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowGuide(false)}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">How to Add a New External Job API</h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{guideContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border rounded mb-6 text-xs bg-white shadow-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">ID</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Name</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Host</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Endpoint</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Key</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Enabled</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Method</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Headers</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Query Template</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Jobs Path</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap">Field Map</th>
                <th className="border px-3 py-2 font-semibold whitespace-nowrap sticky right-0 bg-gray-100 z-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apis.map((api, idx) => (
                <tr key={api.id} className={editIdx === idx ? 'bg-yellow-50' : ''}>
                  <td className="border px-2 py-1 text-xs">{api.id}</td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-32" value={editApi.name} onChange={e => setEditApi(a => ({ ...a, name: e.target.value }))} />
                    ) : api.name}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-40" value={editApi.host} onChange={e => setEditApi(a => ({ ...a, host: e.target.value }))} />
                    ) : api.host}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-56" value={editApi.endpoint} onChange={e => setEditApi(a => ({ ...a, endpoint: e.target.value }))} />
                    ) : api.endpoint}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-40" value={editApi.key} onChange={e => setEditApi(a => ({ ...a, key: e.target.value }))} />
                    ) : <span title={api.key}>{maskKey(api.key)}</span>}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {editIdx === idx ? (
                      <input type="checkbox" checked={editApi.enabled} onChange={e => setEditApi(a => ({ ...a, enabled: e.target.checked }))} />
                    ) : (
                      <input type="checkbox" checked={api.enabled} disabled />
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-20" value={editApi.method || ''} onChange={e => setEditApi(a => ({ ...a, method: e.target.value }))} />
                    ) : api.method || 'GET'}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <textarea className="border rounded px-1 py-0.5 w-40 text-xs" value={editApi.headers || ''} onChange={e => setEditApi(a => ({ ...a, headers: e.target.value }))} />
                    ) : (api.headers ? JSON.stringify(api.headers) : '')}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-40" value={editApi.queryTemplate || ''} onChange={e => setEditApi(a => ({ ...a, queryTemplate: e.target.value }))} />
                    ) : api.queryTemplate || ''}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <input className="border rounded px-1 py-0.5 w-32" value={editApi.jobsPath || ''} onChange={e => setEditApi(a => ({ ...a, jobsPath: e.target.value }))} />
                    ) : api.jobsPath || ''}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <textarea className="border rounded px-1 py-0.5 w-28 text-xs min-h-[40px] max-h-32" style={{resize:'vertical', wordBreak:'break-all'}} value={editApi.fieldMap || ''} onChange={e => setEditApi(a => ({ ...a, fieldMap: e.target.value }))} />
                    ) : (
                      <div className="max-w-[180px] whitespace-pre-wrap break-words text-xs" style={{wordBreak:'break-all'}}>{api.fieldMap ? JSON.stringify(api.fieldMap) : ''}</div>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {editIdx === idx ? (
                      <>
                        <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={saveEdit} disabled={saving}>Save</button>
                        <button className="bg-gray-300 px-2 py-1 rounded" onClick={cancelEdit} disabled={saving}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="bg-blue-600 text-white px-2 py-1 rounded mr-2" onClick={() => startEdit(idx)}>Edit</button>
                        <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(api.id)} disabled={deletingId === api.id}>{deletingId === api.id ? 'Deleting...' : 'Delete'}</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {adding && (
                <tr className="bg-green-50">
                  <td className="border px-2 py-1 text-xs"><input className="border rounded px-1 py-0.5 w-20" value={addApi.id} onChange={e => setAddApi(a => ({ ...a, id: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-32" value={addApi.name} onChange={e => setAddApi(a => ({ ...a, name: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-40" value={addApi.host} onChange={e => setAddApi(a => ({ ...a, host: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-56" value={addApi.endpoint} onChange={e => setAddApi(a => ({ ...a, endpoint: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-40" value={addApi.key} onChange={e => setAddApi(a => ({ ...a, key: e.target.value }))} /></td>
                  <td className="border px-2 py-1 text-center"><input type="checkbox" checked={addApi.enabled} onChange={e => setAddApi(a => ({ ...a, enabled: e.target.checked }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-20" value={addApi.method} onChange={e => setAddApi(a => ({ ...a, method: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><textarea className="border rounded px-1 py-0.5 w-40 text-xs" value={addApi.headers} onChange={e => setAddApi(a => ({ ...a, headers: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-40" value={addApi.queryTemplate} onChange={e => setAddApi(a => ({ ...a, queryTemplate: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><input className="border rounded px-1 py-0.5 w-32" value={addApi.jobsPath} onChange={e => setAddApi(a => ({ ...a, jobsPath: e.target.value }))} /></td>
                  <td className="border px-2 py-1"><textarea className="border rounded px-1 py-0.5 w-40 text-xs" value={addApi.fieldMap} onChange={e => setAddApi(a => ({ ...a, fieldMap: e.target.value }))} /></td>
                  <td className="border px-2 py-1">
                    <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={saveAdd} disabled={saving}>Add</button>
                    <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => { setAdding(false); setAddApi({ id: '', name: '', host: '', endpoint: '', key: '', enabled: true, method: 'GET', headers: '', queryTemplate: '', jobsPath: '', fieldMap: '' }); }} disabled={saving}>Cancel</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setAdding(true)} disabled={adding}>Add New API</button>
    </div>
  );
} 