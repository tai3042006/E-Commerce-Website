/* ============================================
   AURĒ — E-Commerce JavaScript Core
   Cart, UI, Filters, Interactions
   ============================================ */

/* --- PRODUCT DATA --- */
const PRODUCTS = [
  { id:1, name:"Essential Cotton T-Shirt", price:450000, originalPrice:590000, category:"men", type:"tops", badge:"Sale", image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=480", images:["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"], sizes:["S","M","L","XL"], colors:[{name:"White",hex:"#fff"},{name:"Black",hex:"#111"},{name:"Gray",hex:"#9ca3af"}], rating:4.5, reviews:128, description:"Crafted from premium 100% organic cotton with a relaxed fit. Features reinforced stitching and a soft, breathable feel perfect for everyday wear." },
  { id:2, name:"Slim Fit Oxford Shirt", price:890000, originalPrice:null, category:"men", type:"tops", badge:"New", image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=480", images:["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600","https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"], sizes:["S","M","L","XL","XXL"], colors:[{name:"Blue",hex:"#3b82f6"},{name:"White",hex:"#fff"}], rating:4.8, reviews:86, description:"A refined Oxford shirt with a modern slim cut. Made from premium woven cotton with mother-of-pearl buttons and a structured collar." },
  { id:3, name:"Classic Straight Jeans", price:1250000, originalPrice:1590000, category:"men", type:"bottoms", badge:"Sale", image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=480", images:["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600","https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"], sizes:["28","30","32","34","36"], colors:[{name:"Indigo",hex:"#312e81"},{name:"Black",hex:"#111"}], rating:4.3, reviews:204, description:"Timeless straight-leg jeans in premium selvedge denim. Features a classic five-pocket design with subtle fading for a lived-in look." },
  { id:4, name:"Silk Midi Dress", price:2450000, originalPrice:null, category:"women", type:"dresses", badge:"New", image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=480", images:["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600","https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"], sizes:["XS","S","M","L"], colors:[{name:"Red",hex:"#dc2626"},{name:"Black",hex:"#111"}], rating:4.9, reviews:67, description:"An elegant midi dress in flowing silk. Features a flattering A-line silhouette with delicate draping and a concealed back zip." },
  { id:5, name:"Leather Biker Jacket", price:4990000, originalPrice:5990000, category:"men", type:"outerwear", badge:"Sale", image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=480", images:["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600","https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"], sizes:["S","M","L","XL"], colors:[{name:"Black",hex:"#111"},{name:"Brown",hex:"#78350f"}], rating:4.7, reviews:43, description:"Iconic biker jacket in supple full-grain leather. Features asymmetric zip closure, snap-down lapels, and quilted lining." },
  { id:6, name:"Oversized Hoodie", price:750000, originalPrice:null, category:"men", type:"tops", badge:null, image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=480", images:["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600","https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"], sizes:["S","M","L","XL","XXL"], colors:[{name:"Black",hex:"#111"},{name:"Gray",hex:"#6b7280"},{name:"Navy",hex:"#1e3a5f"}], rating:4.6, reviews:312, description:"Ultra-comfortable oversized hoodie in heavyweight fleece. Features a kangaroo pocket, ribbed cuffs, and an adjustable drawstring hood." },
  { id:7, name:"Wool Blend Overcoat", price:3890000, originalPrice:null, category:"women", type:"outerwear", badge:"New", image:"https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=480", images:["https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600","https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80"], sizes:["XS","S","M","L"], colors:[{name:"Camel",hex:"#b8860b"},{name:"Black",hex:"#111"}], rating:4.8, reviews:29, description:"A luxurious overcoat in Italian wool blend. Features a notched lapel, double-breasted front, and a tailored silhouette." },
  { id:8, name:"Aviator Sunglasses", price:1990000, originalPrice:2490000, category:"accessories", type:"accessories", badge:"Sale", image:"https://images.unsplash.com/photo-1434389677669-e08b4cda3a21?w=480", images:["https://images.unsplash.com/photo-1434389677669-e08b4cda3a21?w=600","https://images.unsplash.com/photo-1434389677669-e08b4cda3a21?w=600&q=80"], sizes:["One Size"], colors:[{name:"Gold",hex:"#d4a017"},{name:"Silver",hex:"#c0c0c0"}], rating:4.4, reviews:91, description:"Classic aviator sunglasses with polarized lenses and lightweight titanium frame. 100% UV protection." }
];

/* --- UTILITY: Format VND --- */
function formatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

/* --- SINGLETON: CART MANAGER --- */
const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('aure_cart') || '[]');

  function save() {
    localStorage.setItem('aure_cart', JSON.stringify(items));
    updateBadge();
    renderDrawer();
  }

  function updateBadge() {
    document.querySelectorAll('#cartBadge').forEach(el => {
      const count = items.reduce((s, i) => s + i.qty, 0);
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function getTotal() {
    return items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  return {
    getItems: () => items,
    getCount: () => items.reduce((s, i) => s + i.qty, 0),
    getTotal,
    add(product, size, color, qty = 1) {
      const key = `${product.id}-${size}-${color}`;
      const existing = items.find(i => i.key === key);
      if (existing) { existing.qty += qty; }
      else { items.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, size, color, qty }); }
      save();
      showToast(`${product.name} added to cart`);
    },
    remove(key) {
      items = items.filter(i => i.key !== key);
      save();
    },
    updateQty(key, qty) {
      const item = items.find(i => i.key === key);
      if (item) { item.qty = Math.max(1, qty); save(); }
    },
    clear() { items = []; save(); },
    init() { updateBadge(); }
  };
})();

/* --- TOAST --- */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconSvg = type === 'error'
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  toast.innerHTML = `${iconSvg}<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

/* --- CART DRAWER RENDER --- */
function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const footer = document.getElementById('drawerFooter');
  const countEl = document.getElementById('drawerCount');
  const totalEl = document.getElementById('drawerTotal');
  if (!body) return;

  const items = Cart.getItems();
  countEl && (countEl.textContent = Cart.getCount());
  totalEl && (totalEl.textContent = formatVND(Cart.getTotal()));

  if (items.length === 0) {
    body.innerHTML = `<div class="cart-drawer-empty"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><p>Your cart is empty</p><a href="products.html" class="btn btn-primary btn-sm">Continue Shopping</a></div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = '';
  body.innerHTML = items.map(item => `
    <div class="drawer-item">
      <div class="drawer-item-img"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
      <div class="drawer-item-info">
        <h4>${item.name}</h4>
        <p class="variant">${item.size} / ${item.color}</p>
        <div class="drawer-item-bottom">
          <div class="mini-qty">
            <button onclick="Cart.updateQty('${item.key}',${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="Cart.updateQty('${item.key}',${item.qty + 1})">+</button>
          </div>
          <span class="price">${formatVND(item.price * item.qty)}</span>
        </div>
        <button class="drawer-item-remove" onclick="Cart.remove('${item.key}')">Remove</button>
      </div>
    </div>
  `).join('');
}

/* --- NAV & DRAWER TOGGLES --- */
function initNav() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');
  const cartToggle = document.getElementById('cartToggle');
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
    });
  }

  function openDrawer() { drawer && drawer.classList.add('active'); overlay && overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer && drawer.classList.remove('active'); overlay && overlay.classList.remove('active'); document.body.style.overflow = ''; }

  if (cartToggle) cartToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  window.openCartDrawer = openDrawer;
  window.closeCartDrawer = closeDrawer;
}

/* --- QUICK ADD TO CART (from product cards) --- */
function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  Cart.add(product, product.sizes[0], product.colors[0].name);
  openCartDrawer();
}

/* --- PRODUCT CARD HTML GENERATOR --- */
function createProductCardHTML(p) {
  const badgeHTML = p.badge ? `<span class="product-badge ${p.badge === 'Sale' ? 'product-badge--sale' : 'product-badge--new'}">${p.badge}</span>` : '';
  const originalHTML = p.originalPrice ? `<span class="original">${formatVND(p.originalPrice)}</span>` : '';
  const colorsHTML = p.colors.map(c => `<span class="color-dot" style="background:${c.hex}" title="${c.name}"></span>`).join('');
  return `
    <div class="product-card" onclick="window.location='product-detail.html?id=${p.id}'">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${badgeHTML}
        <div class="product-card-actions"><button class="btn" onclick="event.stopPropagation();quickAddToCart(${p.id})">Quick Add</button></div>
      </div>
      <div class="product-card-info">
        <p class="product-card-cat">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}'s ${p.type}</p>
        <h3 class="product-card-name">${p.name}</h3>
        <div class="product-card-price"><span class="current">${formatVND(p.price)}</span>${originalHTML}</div>
        <div class="product-card-colors">${colorsHTML}</div>
      </div>
    </div>`;
}

/* --- RENDER PRODUCT GRID --- */
function renderProductGrid(containerId, products, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = limit ? products.slice(0, limit) : products;
  container.innerHTML = list.map(createProductCardHTML).join('');
}

/* --- SHOP PAGE: FILTERING & SORTING --- */
function initShopPage() {
  const grid = document.getElementById('shopGrid');
  const countEl = document.getElementById('shopCount');
  const sortEl = document.getElementById('shopSort');
  const searchInput = document.getElementById('shopSearch');
  const categoryCheckboxes = document.querySelectorAll('.filter-cat');
  const filterToggle = document.getElementById('filterToggle');
  const sidebar = document.getElementById('shopSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (!grid) return;

  function applyFilters() {
    let filtered = [...PRODUCTS];
    const cats = [...document.querySelectorAll('.filter-cat:checked')].map(c => c.value);
    if (cats.length) filtered = filtered.filter(p => cats.includes(p.category));
    const types = [...document.querySelectorAll('.filter-type:checked')].map(c => c.value);
    if (types.length) filtered = filtered.filter(p => types.includes(p.type));
    const minP = parseInt(document.getElementById('priceMin')?.value) || 0;
    const maxP = parseInt(document.getElementById('priceMax')?.value) || Infinity;
    filtered = filtered.filter(p => p.price >= minP && p.price <= maxP);
    if (searchInput && searchInput.value.trim()) {
      const q = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q) || p.type.includes(q));
    }
    if (sortEl) {
      const sort = sortEl.value;
      if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
      else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    }
    grid.innerHTML = filtered.length ? filtered.map(createProductCardHTML).join('') : '<p style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--g500)">No products found matching your criteria.</p>';
    if (countEl) countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    // URL category pre-filter
    const urlCat = new URLSearchParams(window.location.search).get('cat');
    if (urlCat) {
      const cb = document.querySelector(`.filter-cat[value="${urlCat}"]`);
      if (cb && !cb.checked) { cb.checked = true; applyFilters(); }
    }
  }

  document.querySelectorAll('.filter-cat, .filter-type').forEach(cb => cb.addEventListener('change', applyFilters));
  document.getElementById('priceApply')?.addEventListener('click', applyFilters);
  if (sortEl) sortEl.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));

  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => { sidebar.classList.toggle('active'); sidebarOverlay && sidebarOverlay.classList.toggle('active'); });
    sidebarOverlay && sidebarOverlay.addEventListener('click', () => { sidebar.classList.remove('active'); sidebarOverlay.classList.remove('active'); });
  }

  // Check URL params on load
  const urlCat = new URLSearchParams(window.location.search).get('cat');
  if (urlCat) {
    const cb = document.querySelector(`.filter-cat[value="${urlCat}"]`);
    if (cb) cb.checked = true;
  }

  applyFilters();
}

/* --- PRODUCT DETAIL PAGE --- */
function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  // Fill page content
  const setT = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  const setH = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };

  setT('.product-title', product.name);
  setT('.product-price-row .current', formatVND(product.price));
  const origEl = document.querySelector('.product-price-row .original');
  if (origEl) { if (product.originalPrice) { origEl.textContent = formatVND(product.originalPrice); origEl.style.display = ''; } else { origEl.style.display = 'none'; } }
  const discEl = document.querySelector('.product-price-row .discount');
  if (discEl) { if (product.originalPrice) { const pct = Math.round((1 - product.price / product.originalPrice) * 100); discEl.textContent = `-${pct}%`; discEl.style.display = ''; } else { discEl.style.display = 'none'; } }
  setT('.product-rating .rating-text', `${product.rating} (${product.reviews} reviews)`);
  setT('.product-desc', product.description);
  setT('.breadcrumb .current', product.name);

  // Main image
  const mainImg = document.getElementById('mainImage');
  if (mainImg) mainImg.src = product.images[0];

  // Thumbnails
  const thumbs = document.getElementById('galleryThumbs');
  if (thumbs) {
    thumbs.innerHTML = product.images.map((img, i) => `<button class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)"><img src="${img}" alt="View ${i + 1}"></button>`).join('');
  }

  // Sizes
  const sizeContainer = document.getElementById('sizeOptions');
  if (sizeContainer) {
    sizeContainer.innerHTML = product.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize(this)">${s}</button>`).join('');
  }

  // Colors
  const colorContainer = document.getElementById('colorOptions');
  if (colorContainer) {
    colorContainer.innerHTML = product.colors.map((c, i) => `<button class="color-btn ${i === 0 ? 'active' : ''}" onclick="selectColor(this)" data-color="${c.name}" title="${c.name}"><span style="background:${c.hex}"></span></button>`).join('');
  }

  // Stars
  const starsEl = document.querySelector('.stars');
  if (starsEl) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      starsHTML += i <= Math.floor(product.rating)
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    starsEl.innerHTML = starsHTML;
  }

  // Add to cart
  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const size = document.querySelector('.size-btn.active')?.textContent || product.sizes[0];
      const color = document.querySelector('.color-btn.active')?.dataset.color || product.colors[0].name;
      const qty = parseInt(document.getElementById('qtyInput')?.value) || 1;
      Cart.add(product, size, color, qty);
      openCartDrawer();
    });
  }

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  renderProductGrid('relatedGrid', related.length >= 2 ? related : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4));
}

window.changeMainImage = function(src, thumb) {
  const mainImg = document.getElementById('mainImage');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumb) thumb.classList.add('active');
};

window.selectSize = function(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.selectColor = function(btn) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

/* --- QUANTITY CONTROLS --- */
function initQtyControls() {
  document.querySelectorAll('.qty-selector').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const minus = wrapper.querySelector('.qty-minus');
    const plus = wrapper.querySelector('.qty-plus');
    if (!input) return;
    minus && minus.addEventListener('click', () => { input.value = Math.max(1, parseInt(input.value) - 1); });
    plus && plus.addEventListener('click', () => { input.value = parseInt(input.value) + 1; });
  });
}

/* --- CART PAGE --- */
function initCartPage() {
  const container = document.getElementById('cartItemsContainer');
  const emptyMsg = document.getElementById('cartEmpty');
  const summaryBlock = document.getElementById('cartSummary');
  if (!container) return;

  function render() {
    const items = Cart.getItems();
    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyMsg) emptyMsg.style.display = '';
      if (summaryBlock) summaryBlock.style.display = 'none';
      return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (summaryBlock) summaryBlock.style.display = '';
    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="variant">Size: ${item.size} / Color: ${item.color}</p>
          <div class="qty-selector">
            <button onclick="Cart.updateQty('${item.key}',${item.qty - 1});initCartPage()">−</button>
            <input type="number" value="${item.qty}" min="1" readonly>
            <button onclick="Cart.updateQty('${item.key}',${item.qty + 1});initCartPage()">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <p class="cart-item-price">${formatVND(item.price * item.qty)}</p>
          <button class="cart-item-remove" onclick="Cart.remove('${item.key}');initCartPage()">Remove</button>
        </div>
      </div>
    `).join('');

    // Summary
    const subtotal = Cart.getTotal();
    const shipping = subtotal > 1000000 ? 0 : 30000;
    const total = subtotal + shipping;
    const subEl = document.getElementById('summarySubtotal');
    const shipEl = document.getElementById('summaryShipping');
    const totalEl = document.getElementById('summaryTotal');
    if (subEl) subEl.textContent = formatVND(subtotal);
    if (shipEl) shipEl.textContent = shipping === 0 ? 'Free' : formatVND(shipping);
    if (totalEl) totalEl.textContent = formatVND(total);
  }

  render();
}

/* --- CHECKOUT PAGE --- */
function initCheckoutPage() {
  const itemsContainer = document.getElementById('checkoutItems');
  const totalEl = document.getElementById('checkoutTotal');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  if (!itemsContainer) return;

  const items = Cart.getItems();
  itemsContainer.innerHTML = items.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-img"><img src="${item.image}" alt="${item.name}"><span class="checkout-item-qty">${item.qty}</span></div>
      <div class="checkout-item-info"><h4>${item.name}</h4><p>${item.size} / ${item.color}</p></div>
      <span class="checkout-item-price">${formatVND(item.price * item.qty)}</span>
    </div>
  `).join('');

  const subtotal = Cart.getTotal();
  const shipping = subtotal > 1000000 ? 0 : 30000;
  if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : formatVND(shipping);
  if (totalEl) totalEl.textContent = formatVND(subtotal + shipping);

  // Payment methods
  document.querySelectorAll('.payment-method').forEach(pm => {
    pm.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(p => p.classList.remove('active'));
      pm.classList.add('active');
      pm.querySelector('input[type="radio"]').checked = true;
    });
  });

  // Form submit
  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Order placed successfully! Thank you for your purchase.');
      Cart.clear();
      setTimeout(() => window.location.href = 'index.html', 2000);
    });
  }
}

/* --- AUTH PAGES --- */
function initAuthPages() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Logged in successfully!');
      setTimeout(() => window.location.href = 'index.html', 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const pass = registerForm.querySelector('[name="password"]')?.value;
      const confirm = registerForm.querySelector('[name="confirmPassword"]')?.value;
      if (pass !== confirm) { showToast('Passwords do not match', 'error'); return; }
      showToast('Account created successfully!');
      setTimeout(() => window.location.href = 'login.html', 1200);
    });
  }
}

/* --- ADMIN TABS --- */
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Sidebar nav
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* --- PRODUCT DETAIL TABS --- */
function initTabs() {
  document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.product-tabs') || document;
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* --- DEBOUNCE --- */
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

/* --- SCROLL ANIMATIONS --- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.product-card, .category-card, .stat-card').forEach(el => observer.observe(el));
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initNav();
  renderDrawer();
  initQtyControls();
  initTabs();
  initScrollAnimations();

  // Page-specific
  if (document.getElementById('featuredGrid')) renderProductGrid('featuredGrid', PRODUCTS.filter(p => p.badge === 'New' || p.rating >= 4.5), 4);
  if (document.getElementById('trendingGrid')) renderProductGrid('trendingGrid', PRODUCTS.filter(p => p.badge === 'Sale'), 4);
  if (document.getElementById('shopGrid')) initShopPage();
  if (document.querySelector('.product-detail')) initProductDetail();
  if (document.getElementById('cartItemsContainer')) initCartPage();
  if (document.getElementById('checkoutForm') || document.getElementById('checkoutItems')) initCheckoutPage();
  if (document.getElementById('loginForm') || document.getElementById('registerForm')) initAuthPages();
  if (document.querySelector('.admin-layout')) initAdminTabs();
});
