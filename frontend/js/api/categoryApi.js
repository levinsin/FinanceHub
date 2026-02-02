// frontend/js/api/categoryApi.js
const API_BASE = (typeof location !== 'undefined' ? `${location.origin}` : 'http://localhost:3000') + '/api/v1';

function getToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem('token');
      if (v) return v;
    }
    if (typeof sessionStorage !== 'undefined') {
      const v = sessionStorage.getItem('token');
      if (v) return v;
    }
  } catch (e) {}
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + 'token' + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
  }
  return null;
}

async function request(path, opts = {}) {
  const token = getToken();
  if (!token) throw new Error('No token found. Please log in.');

  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers }));
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.message) || res.statusText || 'Request failed');
  }
  return res.json().catch(() => null);
}

export function listCategories() {
  return request('/categories', { method: 'GET' });
}

export function createCategory(name, extra = {}) {
  return request('/categories', { method: 'POST', body: JSON.stringify(Object.assign({ name }, extra)) });
}

export function deleteCategory(id) {
  return request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export default { getToken, listCategories, createCategory, deleteCategory };
