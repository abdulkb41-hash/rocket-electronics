// Admin script to manage products in localStorage
function loadProducts() {
  try {
    const raw = localStorage.getItem('products');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) { return []; }
}

function saveProducts(list) {
  localStorage.setItem('products', JSON.stringify(list));
}

const form = document.getElementById('productForm');
const nameInput = document.getElementById('productName');
const priceInput = document.getElementById('productPrice');
const categoryInput = document.getElementById('productCategory');
const descInput = document.getElementById('productDescription');
const listEl = document.getElementById('productList');
const indexInput = document.getElementById('productIndex');
const newBtn = document.getElementById('newProduct');

let products = loadProducts();

function renderAdminList() {
  listEl.innerHTML = '';
  if (products.length === 0) {
    listEl.textContent = 'No products saved yet.';
    return;
  }

  products.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'card';
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.marginBottom = '0.6rem';
    row.innerHTML = `
      <div>
        <strong>${p.name}</strong>
        <div style="color:#94a3b8">${p.category} — $${Number(p.price).toFixed(2)}</div>
        <div style="color:#64748b">${p.description || ''}</div>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-secondary" data-action="edit" data-index="${i}">Edit</button>
        <button class="btn btn-secondary" data-action="delete" data-index="${i}">Delete</button>
      </div>
    `;
    listEl.appendChild(row);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const category = categoryInput.value;
  const description = descInput.value.trim();

  if (!name || isNaN(price)) return alert('Provide name and valid price');

  const idx = indexInput.value !== '' ? Number(indexInput.value) : -1;
  const item = { name, price, category, description };

  if (idx >= 0) {
    products[idx] = item;
  } else {
    products.push(item);
  }

  saveProducts(products);
  renderAdminList();
  form.reset();
  indexInput.value = '';
});

newBtn.addEventListener('click', () => { form.reset(); indexInput.value = ''; });

listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const idx = Number(btn.dataset.index);
  if (action === 'edit') {
    const p = products[idx];
    indexInput.value = idx;
    nameInput.value = p.name;
    priceInput.value = p.price;
    categoryInput.value = p.category;
    descInput.value = p.description || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (action === 'delete') {
    if (!confirm('Delete product?')) return;
    products.splice(idx, 1);
    saveProducts(products);
    renderAdminList();
  }
});

renderAdminList();
