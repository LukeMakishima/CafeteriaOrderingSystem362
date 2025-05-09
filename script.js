
const menuItems = [
  { id: 1, name: "Chocolate", price: 7.99, category: "Main Flavors", description: "Chocolate Froyo", image: "images/chocolate.jpg"},
  { id: 2, name: "Strawberry", price: 7.99, category: "Main Flavors", description: "Strawberry Froyo", image: "images/strawberry.jpeg" },
  { id: 3, name: "Vanilla", price: 6.99, category: "Main Flavors", description: "Vanilla Froyo", image: "images/vanilla.png" },
  { id: 4, name: "Mango Sorbet", price: 9.99, category: "Vegan Options", description: "Dairy Free Mango Sorbet", image: "images/mango.webp" },
  { id: 5, name: "Chocolate Chips", price: 1.99, category: "Toppings", description: "Extra Toppings", image: "images/chocolatechips.png" },
  { id: 6, name: "Nuts", price: 1.99, category: "Toppings", description: "Extra Toppings", image: "images/nuts.png" },
  { id: 7, name: "Dairy Free Cookies and Cream", price: 9.99, category: "Vegan Options", description: "Dairy Free Cookies & Cream", image: "images/cookiesandcream.jpg" },
];

const categories = ['All', ...new Set(menuItems.map(item => item.category))];
const categoryFilter = document.getElementById('categoryFilter');
const menu = document.getElementById('menu');
const cartList = document.getElementById('cartList');
const totalSpan = document.getElementById('total');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const submitButton = document.querySelector('button[type="submit"]');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});

function filterMenu() {
  const selected = categoryFilter.value;
  const itemsToShow = selected === 'All' ? menuItems : menuItems.filter(i => i.category === selected);
  menu.innerHTML = '';

  itemsToShow.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <div>
        <h3>${item.name} - $${item.price.toFixed(2)}</h3>
        <p>${item.description}</p>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
      <img src="${item.image}" alt="${item.name}" class="menu-img">
    `;
    menu.appendChild(div);
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => toast.remove(), 3000);
}

function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const inCart = cart.find(i => i.id === id);
  if (inCart) {
    inCart.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCart();
  showToast(`${item.name} added to cart!`);
}

function updateCart() {
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; border-radius: 4px; margin-right: 8px;">
      ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}
      <span class="cart-buttons">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">🗑️</button>
      </span>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalSpan.textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
  emptyCartMsg.style.display = cart.length === 0 ? 'block' : 'none';
  submitButton.disabled = cart.length === 0;
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function handleSubmit(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const name = document.getElementById('name').value.trim();
  const time = document.getElementById('pickupTime').value;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  let summary = `
    <div class="modal">
      <h2>Thank you, ${name}!</h2>
      <p>Pickup Time: ${time}</p>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
  `;

  cart.forEach(item => {
    summary += `<tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`;
  });

  summary += `
      <tr><td colspan="2"><strong>Total</strong></td><td><strong>$${totalSpan.textContent}</strong></td></tr>
      </table>
      <br>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  modal.innerHTML = summary;
  document.body.appendChild(modal);

  cart = [];
  localStorage.removeItem('cart');
  updateCart();
  e.target.reset();
}

filterMenu();
updateCart();

document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const timeField = document.getElementById('pickupTime');

  // Clear old errors
  document.querySelectorAll('.error-msg').forEach(el => el.remove());
  [nameField, emailField, timeField].forEach(f => f.classList.remove('input-error'));

  validateField(nameField, 'name');
  validateField(emailField, 'email');
  validateField(timeField, 'time');

  const hasError = document.querySelectorAll('.input-error').length > 0;

  if (hasError) return;

  localStorage.setItem('name', nameField.value.trim());
  localStorage.setItem('email', emailField.value.trim());
  localStorage.setItem('pickupTime', timeField.value);

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  window.location.href = 'checkout.html';
});


function validateField(field, type) {
  const value = field.value.trim();
  const next = field.nextElementSibling;

  if (next && next.classList.contains('error-msg')) next.remove();
  field.classList.remove('input-error');

  let error = null;

  if (type === 'name' && !value) error = "Name is required.";
  if (type === 'email') {
    if (!value) error = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email.";
  }
  if (type === 'time' && !value) error = "Pickup time is required.";

  if (error) {
    const msg = document.createElement('div');
    msg.className = 'error-msg';
    msg.textContent = error;
    field.classList.add('input-error');
    field.parentNode.insertBefore(msg, field.nextSibling);
  }
}

// === Live validation events for main order form ===
document.getElementById('name').addEventListener('input', e => validateField(e.target, 'name'));
document.getElementById('email').addEventListener('input', e => validateField(e.target, 'email'));
document.getElementById('pickupTime').addEventListener('input', e => validateField(e.target, 'time'));
