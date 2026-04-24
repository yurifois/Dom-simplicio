// ===================================
// Dom Simplício - Shopping Cart System
// ===================================

// Cart State
let cart = [];
let cartOpen = false;

// Pizza Data (prices by category)
const pizzaPrices = {
  tradicionais: 38,
  doces: 33,
  especiais: 43,
  vip: 46
};

// Border Options
const borderOptions = [
  { id: 'sem', name: 'Sem Borda', price: 0 },
  { id: 'catupiry', name: 'Borda Catupiry', price: 0 },
  { id: 'cheddar', name: 'Borda Cheddar', price: 0 },
  { id: 'choc-leite', name: 'Borda Chocolate ao Leite', price: 2 },
  { id: 'choc-branco', name: 'Borda Chocolate Branco', price: 2 },
  { id: 'goiabada', name: 'Borda Goiabada', price: 2 },
  { id: 'doce-leite', name: 'Borda Doce de Leite', price: 2 }
];

// Initialize cart from localStorage
function initCart() {
  const savedCart = localStorage.getItem('domSimplicioCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('domSimplicioCart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart count badge
function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  countElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Open product order modal
function openModal(id, name, ingredients, type, price1, price2) {
  const modal = document.getElementById('pizzaModal');
  const modalContent = document.getElementById('pizzaModalContent');

  modal.setAttribute('data-current-type', type);

  let optionsHtml = '';
  let basePrice = 0;

  if (type === 'burger' || type === 'hamburguer') {
    const artPrice = 0; // Troca gratuita para carne artesanal
    basePrice = parseFloat(price1) || 0;
    optionsHtml = `
      <div class="modal-section">
        <label>Tipo de Carne:</label>
        <div class="border-options">
          <label class="border-option">
            <input type="radio" name="meatOption" value="industrial" data-extra="0" data-label="Carne Tradicional" checked onchange="updateModalTotal()">
            <span class="border-label">Tradicional</span>
          </label>
          <label class="border-option">
            <input type="radio" name="meatOption" value="artesanal" data-extra="${artPrice}" data-label="Carne Artesanal" onchange="updateModalTotal()">
            <span class="border-label">Artesanal</span>
          </label>
        </div>
      </div>
      <div class="modal-section">
        <label>Escolha a opção:</label>
        <div class="border-options">
          <label class="border-option">
            <input type="radio" name="productOption" value="hamburguer" data-price="${price1}" data-option="Apenas Hambúrguer" checked onchange="updateModalTotal()">
            <span class="border-label">Apenas Hambúrguer <em>R$ ${price1}</em></span>
          </label>
          <label class="border-option">
            <input type="radio" name="productOption" value="combo" data-price="${price2}" data-option="Combo (Batata + Refri)" onchange="updateModalTotal()">
            <span class="border-label">Combo (Batata + Refri) <em>R$ ${price2}</em></span>
          </label>
        </div>
      </div>
    `;
  } else if (type === 'pizza') {
    basePrice = pizzaPrices[price1] || 38;
    optionsHtml = `
      <div class="modal-section">
        <label>Borda:</label>
        <div class="border-options">
          ${borderOptions.map(opt => `
            <label class="border-option">
              <input type="radio" name="productOption" value="${opt.id}" data-price="${basePrice + opt.price}" data-option="${opt.name}" ${opt.id === 'sem' ? 'checked' : ''} onchange="updateModalTotal()">
              <span class="border-label">${opt.name} ${opt.price > 0 ? `<em>+R$${opt.price}</em>` : ''}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  } else if (type === 'snack') {
    basePrice = parseFloat(price1) || 0;
    optionsHtml = `
      <div class="modal-section">
        <label>Escolha o tamanho:</label>
        <div class="border-options">
          <label class="border-option">
            <input type="radio" name="productOption" value="250g" data-price="${price1}" data-option="Porção 250g" checked onchange="updateModalTotal()">
            <span class="border-label">Porção 250g <em>R$ ${price1}</em></span>
          </label>
          <label class="border-option">
            <input type="radio" name="productOption" value="500g" data-price="${price2}" data-option="Porção 500g" onchange="updateModalTotal()">
            <span class="border-label">Porção 500g <em>R$ ${price2}</em></span>
          </label>
        </div>
      </div>
    `;
  } else if (type === 'beverage') {
    basePrice = parseFloat(price1) || 0;
    optionsHtml = `
      <div class="modal-section">
        <p>Bebida gelada pronta para consumo.</p>
        <div style="display:none;">
          <input type="radio" name="productOption" value="unidade" data-price="${price1}" data-option="Unidade" checked>
        </div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <div class="modal-header">
      <h3>${name}</h3>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      ${ingredients ? `<p class="modal-ingredients">${ingredients}</p>` : ''}
      <div class="modal-section">
        <label>Quantidade:</label>
        <div class="quantity-selector">
          <button class="qty-btn" onclick="changeQty(-1)">-</button>
          <input type="number" id="productQty" value="1" min="1" max="10" readonly>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>
      ${optionsHtml}
      <div class="modal-total">
        <span>Total:</span>
        <strong id="modalTotalPrice">R$ ${basePrice.toFixed(2).replace('.', ',')}</strong>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-add-cart" onclick="addProductToCart('${name}', '${type}')">
        Adicionar ao Carrinho
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateModalTotal();
}

function closeModal() {
  const modal = document.getElementById('pizzaModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeQty(delta) {
  const input = document.getElementById('productQty');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
  updateModalTotal();
}

function updateModalTotal() {
  const modal = document.getElementById('pizzaModal');
  const qtyInput = document.getElementById('productQty');
  if (!qtyInput || !modal) return;

  const qty = parseInt(qtyInput.value) || 1;
  const selectedOption = modal.querySelector('input[name="productOption"]:checked');

  let price = 0;
  if (selectedOption) {
    const dataPrice = selectedOption.getAttribute('data-price');
    price = parseFloat(dataPrice) || 0;
  }

  // Adiciona custo da carne artesanal se for hambúrguer
  const meatOption = modal.querySelector('input[name="meatOption"]:checked');
  if (meatOption) {
    price += parseFloat(meatOption.getAttribute('data-extra')) || 0;
  }

  const total = price * qty;
  const totalEl = document.getElementById('modalTotalPrice');
  if (totalEl) {
    totalEl.textContent = "R$ " + total.toFixed(2).replace('.', ',');
  }
}

function addProductToCart(name, type) {
  const modal = document.getElementById('pizzaModal');
  const qtyInput = document.getElementById('productQty');
  if (!qtyInput || !modal) return;

  const qty = parseInt(qtyInput.value);
  const selectedOption = modal.querySelector('input[name="productOption"]:checked');

  if (!selectedOption) {
    alert("Por favor, selecione uma opção.");
    return;
  }

  let price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
  let optionName = selectedOption.getAttribute('data-option');

  // Adiciona opção de carne se existir
  const meatOption = modal.querySelector('input[name="meatOption"]:checked');
  if (meatOption) {
    const extra = parseFloat(meatOption.getAttribute('data-extra')) || 0;
    const meatLabel = meatOption.getAttribute('data-label');
    price += extra;
    optionName = `${meatLabel} | ${optionName}`;
  }

  const cartItem = {
    id: Date.now(),
    type: type,
    name: name,
    quantity: qty,
    option: optionName,
    price: price,
    total: price * qty
  };

  cart.push(cartItem);
  saveCart();
  closeModal();
  showNotification(name + " adicionado ao carrinho!");
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  cartOpen = !cartOpen;

  if (cartOpen) {
    renderCart();
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function closeCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  cartOpen = false;
  cartSidebar.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
    cartSubtotal.textContent = 'R$ 0,00';
    cartTotal.textContent = 'R$ 0,00';
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.total;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.option}</p>
          <p>Qtd: ${item.quantity}</p>
        </div>
        <div class="cart-item-price">
          <strong>R$ ${item.total.toFixed(2).replace('.', ',')}</strong>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remover</button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartSubtotal.textContent = "R$ " + subtotal.toFixed(2).replace('.', ',');
  cartTotal.textContent = "R$ " + subtotal.toFixed(2).replace('.', ',');
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Seu carrinho está vazio!');
    return;
  }

  let message = '🍔 *PEDIDO DOM SIMPLÍCIO*\n\n';
  let total = 0;

  cart.forEach(item => {
    message += `• ${item.quantity}x ${item.name} (${item.option}) - R$ ${item.total.toFixed(2).replace('.', ',')}\n`;
    total += item.total;
  });

  message += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
  message += '_Aguardo confirmação do pedido!_';

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5561992673404?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  clearCart();
  closeCart();
}

function showCategory(event, categoryId) {
  if (event && event.preventDefault) event.preventDefault();

  // Remove active from all tabs
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Add active to clicked tab if event exists
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  } else if (event && event.target) {
    const tabBtn = event.target.closest('.menu-tab');
    if (tabBtn) tabBtn.classList.add('active');
  }

  // Hide all categories
  document.querySelectorAll('.menu-category').forEach(category => {
    category.classList.remove('active');
  });

  // Show selected category
  const targetCategory = document.getElementById(categoryId);
  if (targetCategory) {
    targetCategory.classList.add('active');
  }

  // Reset all flipped cards
  document.querySelectorAll('.pizza-card.flipped').forEach(card => {
    card.classList.remove('flipped');
  });
}

function setupProductCards() {
  document.querySelectorAll('.pizza-card, .product-card').forEach(card => {
    const cardBack = card.querySelector('.pizza-card-back, .product-card-back');
    if (!cardBack) return;

    // Remove existing button to avoid duplicates
    const existingBtn = cardBack.querySelector('.btn-add-to-cart');
    if (existingBtn) existingBtn.remove();

    const h4 = cardBack.querySelector('h4');
    if (!h4) return;

    const name = h4.textContent;
    const ingredients = cardBack.querySelector('.ingredients')?.textContent || '';
    const type = card.getAttribute('data-type') || 'pizza';
    const price1 = card.getAttribute('data-price1');
    const price2 = card.getAttribute('data-price2') || '';

    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-to-cart';
    addBtn.textContent = 'Adicionar';
    addBtn.onclick = (e) => {
      e.stopPropagation();
      openModal(null, name, ingredients, type, price1, price2);
    };

    cardBack.appendChild(addBtn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  setupProductCards();

  // Fechar cards e modal ao clicar fora
  window.addEventListener('click', (e) => {
    // Se não clicou em um card ou em um botão de adicionar, desvira todos os cards
    if (!e.target.closest('.pizza-card') && !e.target.closest('.btn-add-to-cart')) {
      document.querySelectorAll('.pizza-card.flipped').forEach(card => {
        card.classList.remove('flipped');
      });
    }

    // Fechar modal ao clicar no fundo escuro (overlay)
    const modal = document.getElementById('pizzaModal');
    if (e.target === modal) {
      closeModal();
    }
  });
});
