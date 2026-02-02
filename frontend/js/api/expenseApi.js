// frontend/js/api/expenseApi.js
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

export function listExpenses() {
  return request('/expenses', { method: 'GET' });
}

export function createExpense(payload) {
  return request('/expenses', { method: 'POST', body: JSON.stringify(payload) });
}

export function deleteExpense(id) {
  return request(`/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export default { listExpenses, createExpense, deleteExpense };
