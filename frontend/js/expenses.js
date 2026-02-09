import { listCategories, createCategory as apiCreateCategory, deleteCategory as apiDeleteCategory } from './api/categoryApi.js';
import { listExpenses as apiListExpenses, createExpense as apiCreateExpense, deleteExpense as apiDeleteExpense } from './api/expenseApi.js';

const form = document.getElementById('expenseForm');
// const listEl = document.getElementById('expenses');
const chooseCategoryBtn = document.getElementById('chooseCategoryBtn');
const categoryModal = document.getElementById('categoryModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const categoryList = document.getElementById('categoryList');
const categoryInput = document.getElementById('categoryInput');
const categoryLabel = document.getElementById('categoryLabel');
const newCategoryNameInput = document.getElementById('newCategoryName');
const createCategoryBtn = document.getElementById('createCategoryBtn');
const btnVariable = document.getElementById('btn-variable');
const btnFixed = document.getElementById('btn-fixed');
const costTypeInput = document.getElementById('costTypeInput');

// async function loadExpenses() {
//   listEl.innerHTML = 'Loading...';
//   try {
//     const data = await apiListExpenses();
//     renderList(data || []);
//   } catch (err) {
//     listEl.innerHTML = err.message || 'Error loading expenses';
//     console.error(err);
//   }
// }

// function renderList(items) {
//   if (!items.length) {
//     listEl.innerHTML = '<p>No expenses yet.</p>';
//     return;
//   }
//   const ul = document.createElement('ul');
//   items.forEach(it => {
//     const li = document.createElement('li');
//     li.textContent = `${it.title} — ${it.amount} € — ${new Date(it.date).toLocaleDateString()} `;

//     const del = document.createElement('button');
//     del.textContent = 'Delete';
//     del.onclick = () => deleteExpense(it._id);
//     li.appendChild(del);

//     ul.appendChild(li);
//   });
//   listEl.innerHTML = '';
//   listEl.appendChild(ul);
// }

async function createExpense(payload) {
  try {
    await apiCreateExpense(payload);
    //await loadExpenses();
  } catch (err) {
    alert('Create failed: ' + err.message);
  }
}

// async function deleteExpense(id) {
//   if (!confirm('Delete this expense?')) return;
//   try {
//     await apiDeleteExpense(id);
//     await loadExpenses();
//   } catch (err) {
//     alert(err.message);
//   }
// }

// Category modal
function openCategoryModal() {
  // show overlay
  categoryModal.style.display = 'block';
  categoryModal.setAttribute('aria-hidden','false');
  const content = categoryModal.querySelector('.modal-content');
  // center modal in viewport
  content.classList.remove('floating');
  content.style.position = 'fixed';
  content.style.top = '50%';
  content.style.left = '50%';
  content.style.transform = 'translate(-50%, -50%)';
  // clear any previously set absolute offsets
  content.style.right = '';
  content.style.bottom = '';
  loadCategories();
}
function closeModal() {
  categoryModal.style.display = 'none';
  categoryModal.setAttribute('aria-hidden','true');
}

async function loadCategories() {
  categoryList.innerHTML = 'Loading...';
  try {
    const data = await listCategories();
    renderCategories(data || []);
  } catch (err) {
    categoryList.innerHTML = 'Error loading categories';
    console.error(err);
  }
}

function createCategoryListItem(cat){
  const li = document.createElement('li');
  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = (cat.name||cat.title||'(no name)');
  // clicking the row selects the category
  li.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.del-cat')) return;
    selectCategory(cat);
  });
  li.appendChild(label);

  const del = document.createElement('button');
  del.textContent = 'Delete';
  del.className = 'small del-cat';
  del.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!confirm('Delete category?')) return;
    try {
      await apiDeleteCategory(cat._id);
      loadCategories();
    } catch (err) {
      alert('Delete failed: ' + (err.message || err));
    }
  });
  li.appendChild(del);

  return li;
}

function renderCategories(items) {
  categoryList.innerHTML = '';
  if (!items.length) {
    categoryList.innerHTML = '<p>No categories yet.</p>';
    return;
  }
  const ul = document.createElement('ul');
  items.forEach(cat => ul.appendChild(createCategoryListItem(cat)));
  categoryList.appendChild(ul);
}

function selectCategory(cat) {
  categoryInput.value = cat._id;
  categoryLabel.textContent = cat.name || cat.title || 'Unnamed';
  closeModal();
}

if (createCategoryBtn){
  createCategoryBtn.addEventListener('click', async () => {
    const name = (newCategoryNameInput && newCategoryNameInput.value||'').trim();
    if (!name) return;
    createCategoryBtn.disabled = true;
    try{
      const user = JSON.parse(sessionStorage.getItem('user')||'null');
      const userId = user?.id || user?._id || null;
      const extra = {};
      if (userId) extra.userId = userId;

      const created = await apiCreateCategory(name, extra);
      // ensure list exists
      const ul = categoryList.querySelector('ul') || document.createElement('ul');
      // prepend created item
      const li = createCategoryListItem(created);
      ul.insertBefore(li, ul.firstChild);
      if (!categoryList.contains(ul)) categoryList.appendChild(ul);
      newCategoryNameInput.value = '';
      newCategoryNameInput.focus();
    } catch(err){
      console.error(err);
      alert('Create failed: ' + (err.message||err));
    } finally{ createCategoryBtn.disabled = false; }
  });
}

// form submit
form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = {
    title: fd.get('title'),
    amount: parseFloat(fd.get('amount')),
    date: fd.get('date') || undefined,
    category: fd.get('category') || undefined,
    costType: fd.get('costType') || undefined,
    notes: fd.get('notes') || undefined,
    // include userId from sessionStorage/localStorage so backend can use it as fallback
    userId: (function(){
      try{
        const u = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null');
        return u?.id || u?._id || null;
      } catch(error){ 
        console.log(error)
        return null; }
    })()
  };
  createExpense(payload);
  // reset form
  form.reset();
  categoryLabel.textContent = '';
  const dateEl = form.elements.date;
  if (dateEl) dateEl.value = new Date().toISOString().slice(0,10);
  categoryInput.value = '';
  // reset cost type UI
  if (costTypeInput) costTypeInput.value = '';
  if (btnVariable) { btnVariable.className = 'secondary-btn'; }
  if (btnFixed) { btnFixed.className = 'secondary-btn'; }
});

// UI bindings
if (chooseCategoryBtn) chooseCategoryBtn.addEventListener('click', openCategoryModal);
if (closeCategoryModal) closeCategoryModal.addEventListener('click', closeModal);
window.addEventListener('click', (e)=>{ if (e.target===categoryModal) closeModal(); });

// Cost type toggle behavior
function selectCostType(value){
  if (!costTypeInput) return;
  costTypeInput.value = value;
  if (value === 'variable'){
    if (btnVariable) btnVariable.className = 'primary-btn';
    if (btnFixed) btnFixed.className = 'secondary-btn';
  } else if (value === 'fixed'){
    if (btnFixed) btnFixed.className = 'primary-btn';
    if (btnVariable) btnVariable.className = 'secondary-btn';
  }
}

if (btnVariable) btnVariable.addEventListener('click', ()=> selectCostType('variable'));
if (btnFixed) btnFixed.addEventListener('click', ()=> selectCostType('fixed'));

// defaults on load
window.addEventListener('load', () => {
  // set date to today if empty
  const dateEl = form.elements.date;
  if (dateEl && !dateEl.value) dateEl.value = new Date().toISOString().slice(0,10);
  // ensure amount step is 1
  const amountEl = form.elements.amount;
  if (amountEl) amountEl.step = '1';
  // loadExpenses();
  // attach return button handler
  const returnBtn = document.getElementById('returnBtn');
  if (returnBtn) returnBtn.addEventListener('click', () => { window.history.back(); });
});
