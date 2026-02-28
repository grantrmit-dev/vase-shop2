const vases = [
  {
    id: 1, name: 'Aero Minimal', style: 'minimal', material: 'PLA', basePrice: 32,
    colors: ['White','Black','Sand'], badge: 'Bestseller',
    image: 'https://image.pollinations.ai/prompt/minimalist%203D%20printed%20white%20PLA%20vase%2C%20clean%20smooth%20lines%2C%20elegant%20modern%20design%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=101'
  },
  {
    id: 2, name: 'Helix Bloom', style: 'spiral', material: 'PETG', basePrice: 48,
    colors: ['Teal','Amber','Graphite'], badge: 'Popular',
    image: 'https://image.pollinations.ai/prompt/spiral%20helix%203D%20printed%20teal%20PETG%20vase%2C%20twisted%20tower%20form%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=202'
  },
  {
    id: 3, name: 'Prism Nest', style: 'geometric', material: 'PLA', basePrice: 39,
    colors: ['Ivory','Olive','Slate'], badge: 'New',
    image: 'https://image.pollinations.ai/prompt/geometric%20faceted%20angular%203D%20printed%20ivory%20PLA%20vase%2C%20crystalline%20prism%20shape%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=303'
  },
  {
    id: 4, name: 'Coral Flow', style: 'organic', material: 'Resin', basePrice: 74,
    colors: ['Pearl','Rose','Smoke'], badge: 'Premium',
    image: 'https://image.pollinations.ai/prompt/organic%20coral%20reef%20inspired%203D%20printed%20resin%20vase%2C%20flowing%20biomorphic%20curves%2C%20pearl%20white%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=404'
  },
  {
    id: 5, name: 'Facet Tower', style: 'geometric', material: 'PETG', basePrice: 56,
    colors: ['Cobalt','Lime','Silver'], badge: 'New',
    image: 'https://image.pollinations.ai/prompt/tall%20angular%20faceted%203D%20printed%20cobalt%20blue%20PETG%20tower%20vase%2C%20geometric%20diamond%20pattern%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=505'
  },
  {
    id: 6, name: 'Zen Curve', style: 'minimal', material: 'PLA', basePrice: 29,
    colors: ['Cream','Navy','Terracotta'], badge: 'Bestseller',
    image: 'https://image.pollinations.ai/prompt/minimal%20zen%20smooth%20curved%203D%20printed%20cream%20PLA%20vase%2C%20japanese%20wabi-sabi%20aesthetic%2C%20dark%20studio%20photography%2C%20luxury%20product%20shot?width=600&height=520&nologo=true&seed=606'
  }
];

const sizeMultiplier = { small: 0.9, medium: 1, large: 1.25 };

const gridEl = document.getElementById('productGrid');
const cartItemsEl = document.getElementById('cartItems');
const totalEl = document.getElementById('total');
const cartCountEl = document.getElementById('cartCount');
const statusEl = document.getElementById('status');
const template = document.getElementById('cardTemplate');
const styleFilter = document.getElementById('styleFilter');
const materialFilter = document.getElementById('materialFilter');
const priceFilter = document.getElementById('priceFilter');
const priceValueEl = document.getElementById('priceValue');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

let cart = [];

function money(n) { return (Math.round(n * 100) / 100).toFixed(2); }

function filteredVases() {
  return vases.filter(v => {
    const styleOK = styleFilter.value === 'all' || v.style === styleFilter.value;
    const matOK = materialFilter.value === 'all' || v.material === materialFilter.value;
    const priceOK = v.basePrice <= Number(priceFilter.value);
    return styleOK && matOK && priceOK;
  });
}

function renderGrid() {
  gridEl.innerHTML = '';
  const list = filteredVases();
  if (!list.length) {
    gridEl.innerHTML = '<p style="color:#888;padding:3rem;grid-column:1/-1;text-align:center">No vases match your filters.</p>';
    return;
  }
  list.forEach(vase => {
    const node = template.content.cloneNode(true);
    node.querySelector('.card-img').src = vase.image;
    node.querySelector('.card-img').alt = vase.name;
    node.querySelector('.card-badge').textContent = vase.badge;
    node.querySelector('.card-title').textContent = vase.name;
    node.querySelector('.card-meta').textContent = `${vase.style} · ${vase.material}`;
    node.querySelector('.card-price').textContent = `From $${vase.basePrice}`;

    const colorSelect = node.querySelector('.color');
    vase.colors.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      colorSelect.appendChild(opt);
    });

    node.querySelector('.add-btn').addEventListener('click', function () {
      const size = this.closest('.product-card').querySelector('.size').value;
      const color = colorSelect.value;
      const price = money(vase.basePrice * sizeMultiplier[size]);
      cart.push({ vaseId: vase.id, name: vase.name, size, color, price });
      renderCart();
      openCart();
    });

    gridEl.appendChild(node);
  });
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  let total = 0;

  if (!cart.length) {
    cartItemsEl.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
    totalEl.textContent = '0.00';
    cartCountEl.textContent = '0';
    return;
  }

  cart.forEach((item, i) => {
    total += parseFloat(item.price);
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-detail">${item.size} · ${item.color}</div>
      </div>
      <span class="cart-item-price">$${item.price}</span>
      <button class="cart-item-remove" data-i="${i}">✕</button>
    `;
    li.querySelector('.cart-item-remove').addEventListener('click', () => {
      cart.splice(i, 1);
      renderCart();
    });
    cartItemsEl.appendChild(li);
  });

  totalEl.textContent = money(total);
  cartCountEl.textContent = cart.length;
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

[styleFilter, materialFilter, priceFilter].forEach(el => {
  el.addEventListener('input', () => {
    priceValueEl.textContent = priceFilter.value;
    renderGrid();
  });
});

document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!cart.length) { statusEl.textContent = 'Your cart is empty.'; return; }
  const order = {
    id: `ORD-${Date.now()}`,
    customer: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    },
    items: cart,
    total: totalEl.textContent
  };
  localStorage.setItem(order.id, JSON.stringify(order));
  cart = [];
  renderCart();
  e.target.reset();
  statusEl.textContent = `✓ Order ${order.id} confirmed!`;
});

priceValueEl.textContent = priceFilter.value;
renderGrid();
renderCart();
