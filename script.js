const cart = [];
const cartList = document.querySelector('.cart-list');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total');
const clearCartButton = document.getElementById('clearCart');
const checkoutButton = document.getElementById('checkoutBtn');
const cartMessage = document.querySelector('.cart-message');
const customerNameInput = document.getElementById('customerName');
const customerEmailInput = document.getElementById('customerEmail');
const customerPhoneInput = document.getElementById('customerPhone');
const customerAddressInput = document.getElementById('customerAddress');
const form = document.getElementById('serviceForm');
const message = document.getElementById('formMessage');

// --- Product management (stored in localStorage) ---
const DEFAULT_PRODUCTS = [
  { name: 'Elite Ultrabook', price: 1199, category: 'laptops' },
  { name: 'Gaming Laptop', price: 1499, category: 'laptops' },
  { name: 'Business Laptop', price: 949, category: 'laptops' },
  { name: 'Gaming Desktop', price: 1299, category: 'desktops' },
  { name: 'All-in-One', price: 1099, category: 'desktops' },
  { name: 'Mini PC', price: 699, category: 'desktops' },
  { name: 'Wireless Mouse', price: 39, category: 'accessories' },
  { name: 'Mechanical Keyboard', price: 89, category: 'accessories' },
  { name: 'Gaming Headset', price: 69, category: 'accessories' }
];

function loadProducts() {
  try {
    const raw = localStorage.getItem('products');
    if (!raw) return DEFAULT_PRODUCTS.slice();
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PRODUCTS.slice();
  }
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

let products = loadProducts();

function renderProducts() {
  const grids = document.querySelectorAll('.cards-grid[data-category]');
  grids.forEach(grid => {
    const category = grid.dataset.category;
    grid.innerHTML = '';
    const items = products.filter(p => p.category === category);
    items.forEach((p) => {
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.name = p.name;
      article.dataset.price = String(p.price);
      article.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description || ''}</p>
        <span class="price">$${p.price.toLocaleString()}</span>
        <button class="btn btn-secondary add-to-cart">Buy Now</button>
      `;
      grid.appendChild(article);
    });
  });
}

// initial render
renderProducts();

// If products changed in another tab (admin), reload and re-render
window.addEventListener('storage', (e) => {
  if (e.key === 'products') {
    products = loadProducts();
    renderProducts();
  }
});

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartUI() {
  cartList.innerHTML = '';

  if (cart.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'Your cart is empty.';
    emptyItem.style.padding = '1rem 0';
    emptyItem.style.color = '#94a3b8';
    cartList.appendChild(emptyItem);
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">Qty: ${item.qty} · ${formatCurrency(item.price)}</span>
        </div>
        <div>
          <span>${formatCurrency(item.price * item.qty)}</span>
          <button class="item-remove" data-index="${index}">Remove</button>
        </div>
      `;
      cartList.appendChild(li);
    });
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  cartTotal.textContent = formatCurrency(totalPrice);
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function clearCart() {
  cart.length = 0;
  cartMessage.textContent = '';
  updateCartUI();
}

function checkout() {
  if (cart.length === 0) {
    cartMessage.textContent = 'Your cart is empty. Add items before checking out.';
    return;
  }

  const name = customerNameInput.value.trim();
  const email = customerEmailInput.value.trim();
  const phone = customerPhoneInput.value.trim();
  const address = customerAddressInput.value.trim();

  if (!name || !email || !phone || !address) {
    cartMessage.textContent = 'Please complete all customer details before purchasing.';
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartMessage.textContent = `Thank you, ${name}! Your order is placed. Total amount: ${formatCurrency(totalPrice)}`;
  cartMessage.style.color = '#a5f3fc';
  clearCart();
  customerNameInput.value = '';
  customerEmailInput.value = '';
  customerPhoneInput.value = '';
  customerAddressInput.value = '';
}

updateCartUI();

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('.add-to-cart');
  const removeButton = event.target.closest('.item-remove');

  if (addButton) {
    const card = addButton.closest('.card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    addToCart(name, price);
  }

  if (removeButton) {
    const index = Number(removeButton.dataset.index);
    removeFromCart(index);
  }
});

clearCartButton.addEventListener('click', clearCart);
checkoutButton.addEventListener('click', checkout);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const serviceType = document.getElementById('serviceType').value;

  if (!name || !serviceType) {
    message.textContent = 'Please complete the form before submitting.';
    message.style.color = '#b91c1c';
    return;
  }

  message.textContent = `Thanks, ${name}! Your ${serviceType} request has been received. We will contact you shortly.`;
  message.style.color = '#065f46';
  form.reset();
});
