// ========== API FUNCTIONS ==========
const API_BASE = `${location.origin}/api/v1`;

async function apiRequest(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('token')
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

// ========== ELEMENTS ==========
const form = document.getElementById('expenseForm');
const incomeForm = document.getElementById('incomeForm');
const budgetForm = document.getElementById('budgetForm');
const chooseCategoryBtn = document.getElementById('chooseCategoryBtn');
const chooseBudgetCategoryBtn = document.getElementById('chooseBudgetCategoryBtn');
const categoryModal = document.getElementById('categoryModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const categoryList = document.getElementById('categoryList');
const categoryInput = document.getElementById('categoryInput');
const categoryLabel = document.getElementById('categoryLabel');
const budgetCategoryInput = document.getElementById('budgetCategoryInput');
const budgetCategoryLabel = document.getElementById('budgetCategoryLabel');
const newCategoryNameInput = document.getElementById('newCategoryName');
const createCategoryBtn = document.getElementById('createCategoryBtn');
const btnVariable = document.getElementById('btn-variable');
const btnFixed = document.getElementById('btn-fixed');
const costTypeInput = document.getElementById('costTypeInput');

let isBudgetCategorySelection = false;

// ========== CATEGORY MODAL ==========
function openCategoryModal() {
  categoryModal.style.display = 'block';
  categoryModal.setAttribute('aria-hidden','false');
  const content = categoryModal.querySelector('.modal-content');
  content.classList.remove('floating');
  content.classList.add('centered');
  loadCategories();
}

function openBudgetCategoryModal() {
  isBudgetCategorySelection = true;
  openCategoryModal();
}

function closeModal() {
  categoryModal.style.display = 'none';
  categoryModal.setAttribute('aria-hidden', 'true');
  isBudgetCategorySelection = false;
}

async function loadCategories() {
  categoryList.innerHTML = 'Loading...';
  try {
    const categories = await apiRequest('/categories', 'GET');
    renderCategories(categories || []);
  } catch (err) {
    categoryList.innerHTML = 'Error';
  }
}

function renderCategories(categories) {
  if (!categories.length) {
    categoryList.innerHTML = '<p>No categories yet.</p>';
    return;
  }
  
  const ul = document.createElement('ul');
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="label">${cat.name}</div>
      <button class="small del-cat">Delete</button>
    `;
    
    li.querySelector('.label').addEventListener('click', () => selectCategory(cat));
    li.querySelector('.del-cat').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete category?')) return;
      try {
        await apiRequest(`/categories/${cat._id}`, 'DELETE');
        loadCategories();
      } catch (err) {
        alert('Delete failed');
      }
    });
    
    ul.appendChild(li);
  });
  
  categoryList.innerHTML = '';
  categoryList.appendChild(ul);
}

function selectCategory(cat) {
  if (isBudgetCategorySelection) {
    budgetCategoryInput.value = cat._id;
    budgetCategoryLabel.textContent = cat.name;
  } else {
    categoryInput.value = cat._id;
    categoryLabel.textContent = cat.name;
  }
  closeModal();
}

// ========== PAGE LOAD ==========
window.addEventListener('load', () => {
  // Set current date
  form.elements.date.value = new Date().toISOString().slice(0, 10);
  
  // Expense form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const payload = {
      userId: user.id,
      title: form.elements.title.value.trim(),
      amount: parseFloat(form.elements.amount.value),
      date: form.elements.date.value || new Date().toISOString(),
      category: categoryInput.value || null,
      costType: costTypeInput.value || null,
      notes: form.elements.notes.value.trim() || null
    };

    try {
      await apiRequest('/expenses', 'POST', payload);
      alert('Expense created!');
      form.reset();
      categoryLabel.textContent = '';
      categoryInput.value = '';
      costTypeInput.value = '';
      categoryInput.value = 'No category selected';
      btnVariable.className = 'secondary-btn';
      btnFixed.className = 'secondary-btn';
      form.elements.date.value = new Date().toISOString().slice(0, 10);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  
  // Income form submit
  incomeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/income', 'POST', {
        source: incomeForm.elements.source.value.trim(),
        amount: parseFloat(incomeForm.elements.amount.value)
      });
      incomeForm.reset();
      alert('Income saved!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  
  // Budget form submit
  budgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      await apiRequest('/budget', 'POST', {
        category: budgetCategoryInput.value,
        amount: parseFloat(budgetForm.elements.amount.value)
      });
      budgetForm.reset();
      budgetCategoryLabel.textContent = 'No category selected';
      budgetCategoryInput.value = '';
      alert('Budget saved!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  
  // Create category button
  createCategoryBtn.addEventListener('click', async () => {
    const name = newCategoryNameInput.value.trim();
    if (!name) return;
    
    try {
      await apiRequest('/categories', 'POST', { name });
      newCategoryNameInput.value = '';
      loadCategories();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  
  // Cost type buttons
  btnVariable.addEventListener('click', () => {
    costTypeInput.value = 'variable';
    btnVariable.className = 'primary-btn';
    btnFixed.className = 'secondary-btn';
  });

  btnFixed.addEventListener('click', () => {
    costTypeInput.value = 'fixed';
    btnFixed.className = 'primary-btn';
    btnVariable.className = 'secondary-btn';
  });
  
  // Category modal buttons
  chooseCategoryBtn.addEventListener('click', openCategoryModal);
  chooseBudgetCategoryBtn.addEventListener('click', openBudgetCategoryModal);
  closeCategoryModal.addEventListener('click', closeModal);
  
  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === categoryModal) closeModal();
  });
  
  // Return button
  document.getElementById('returnBtn').addEventListener('click', () => window.history.back());
});