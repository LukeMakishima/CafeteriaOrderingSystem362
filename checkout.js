function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutCart = document.getElementById('checkoutCart');
    const totalSpan = document.getElementById('checkoutTotal');
    let total = 0;
  
    checkoutCart.innerHTML = '';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" style="width: 30px; height: 30px; border-radius: 4px; margin-right: 8px;">
        ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}
      `;
      checkoutCart.appendChild(li);
      total += item.price * item.quantity;
    });
  
    totalSpan.textContent = total.toFixed(2);
  
    document.getElementById('name').value = localStorage.getItem('name') || '';
    document.getElementById('email').value = localStorage.getItem('email') || '';
    document.getElementById('pickupTime').value = localStorage.getItem('pickupTime') || '';
  }
  
  function finalizeOrder(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const time = document.getElementById('pickupTime').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
  
    let total = 0;
    let summary = `
      <div class="modal">
        <h2>Thank you, ${name}!</h2>
        <p>Pickup Time: ${time}</p>
        <table>
          <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
    `;
  
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      summary += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${itemTotal.toFixed(2)}</td></tr>`;
    });
  
    summary += `
    <tr><td colspan="2"><strong>Total</strong></td><td><strong>$${total.toFixed(2)}</strong></td></tr>
    </table>
    <div style="margin-top: 1rem;">
    <button onclick="window.location.href='index.html'">Back to Menu</button>
    </div>
    </div>
    `;

  
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = summary;
    document.body.appendChild(modal);
  
    localStorage.removeItem('cart');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('pickupTime');
  }
  
  loadCheckout();  