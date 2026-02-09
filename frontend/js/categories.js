// ========== API ==========
const API_BASE = `${location.origin}/api/v1`;

async function apiRequest(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('Not logged in');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  return res.json().catch(() => null);
}

// ========== CATEGORY FUNCTIONS ==========
export async function createCategory(name) {
  return apiRequest('/categories', 'POST', { name: name.trim() });
}

export async function listCategories() {
  return apiRequest('/categories', 'GET');
}

export async function deleteCategory(id) {
  return apiRequest(`/categories/${id}`, 'DELETE');
}

export default { getToken, createCategory, listCategories, deleteCategory };
