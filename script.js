const menuItems = [
    { id: 1, name: "Cheeseburger", price: 7.99, category: "Main Dishes", description: "Beef patty with cheese" },
    { id: 2, name: "Chicken Sandwich", price: 6.99, category: "Main Dishes", description: "Grilled chicken" },
    { id: 3, name: "Caesar Salad", price: 5.99, category: "Salads", description: "Romaine and dressing" },
    { id: 4, name: "French Fries", price: 2.99, category: "Sides", description: "Crispy fries" },
    { id: 5, name: "Soda", price: 1.99, category: "Drinks", description: "Fizzy drink" },
  ];
  
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  const menu = document.getElementById('menu');
  const cartList = document.getElementById('cartList');
  const totalSpan = document.getElementById('total');
  
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
        <h3>${item.name} - $${item.price.toFixed(2)}</h3>
        <p>${item.description}</p>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
      `;
      menu.appendChild(div);
    });
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
  }
  
  function updateCart() {
    cartList.innerHTML = '';
    let total = 0;
  
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}
        <span class="cart-buttons">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </span>
      `;
      cartList.appendChild(li);
      total += item.price * item.quantity;
    });
  
    totalSpan.textContent = total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
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
  
  function handleSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const time = document.getElementById('pickupTime').value;
  
    let summary = `Thank you, ${name}!\n\nOrder Summary:\n`;
    cart.forEach(item => {
      summary += `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    summary += `\nPickup Time: ${time}\nTotal: $${totalSpan.textContent}`;
  
    alert(summary);
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    e.target.reset();
  }
  
  filterMenu();
  updateCart();
  