const apiBase = '/api/v1/categories';
// Simple, secure category client
// - Reads JWT from localStorage or cookie
// - Throws early when no token available (prevents "No token provided")
// - Exposes `createCategory`, `listCategories`, `deleteCategory`

// Use same-origin API base that matches backend mounting (/api/v1)
const API_BASE = (typeof location !== 'undefined' ? `${location.origin}` : 'http://localhost:3000') + '/api/v1';

function getToken() {
  // Check common storage locations: localStorage, sessionStorage, then cookie named 'token'
  try {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem('token');
      if (v) return v;
    }
    if (typeof sessionStorage !== 'undefined') {
      const v = sessionStorage.getItem('token');
      if (v) return v;
    }
  } catch (e) {
    // silently ignore storage access errors (e.g., strict privacy settings)
  }
  // cookie fallback
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + 'token' + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
  }
  return null;
}

async function request(path, opts = {}) {
  const token = getToken();
  if (!token) {
    // Fail early with a clear error instead of sending an unauthenticated request
    throw new Error('No token found. Please log in.');
  }

  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers, body }));

  if (res.status === 401 || res.status === 403) {
    const body = await safeJson(res);
    const msg = body && body.message ? body.message : 'Unauthorized';
    throw new Error(msg);
  }

  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error((body && body.message) || res.statusText || 'Request failed');
  }

  return safeJson(res);
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function createCategory(name) {
  if (!name || !name.toString().trim()) throw new Error('Category name is required');
  return request('/categories', { method: 'POST', body: JSON.stringify({ name: name.toString().trim() }) });
}

export async function listCategories() {
  return request('/categories', { method: 'GET' });
}

export async function deleteCategory(id) {
  if (!id) throw new Error('Category id is required');
  return request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// Attach to window for quick debugging in dev
if (typeof window !== 'undefined') {
  window.CategoryAPI = { getToken, createCategory, listCategories, deleteCategory };
}

export default { getToken, createCategory, listCategories, deleteCategory };
