/* ============================================================
   CLOFIT — script.js
   Vanilla JavaScript — all site interactivity
   ============================================================ */

"use strict";

/* ── PRODUCT DATA ── */
const PRODUCTS = [
  { id: 1,  name: "Classic Oxford Shirt",       category: "shirt",   price: 89,   originalPrice: null, rating: 4.9, reviews: 342, emoji: "👔", badge: "new",     color: "#2a4a6b" },
  { id: 2,  name: "Minimal Graphic Tee",         category: "tee",     price: 45,   originalPrice: null, rating: 4.7, reviews: 218, emoji: "👕", badge: "new",     color: "#3a3a38" },
  { id: 3,  name: "Harrington Jacket",           category: "jacket",  price: 149,  originalPrice: 199,  rating: 4.8, reviews: 187, emoji: "🧥", badge: "sale",    color: "#3a3a38" },
  { id: 4,  name: "Linen Formal Shirt",          category: "formal",  price: 110,  originalPrice: null, rating: 4.6, reviews: 95,  emoji: "👔", badge: null,      color: "#f5f0e8" },
  { id: 5,  name: "Oversized Vintage Tee",       category: "tee",     price: 55,   originalPrice: null, rating: 4.9, reviews: 412, emoji: "👕", badge: "limited", color: "#8b7355" },
  { id: 6,  name: "Striped Maritime Shirt",      category: "shirt",   price: 79,   originalPrice: null, rating: 4.5, reviews: 156, emoji: "👔", badge: null,      color: "#1a3a5c" },
  { id: 7,  name: "Essential Crew Neck",         category: "tee",     price: 38,   originalPrice: null, rating: 4.8, reviews: 534, emoji: "👕", badge: "new",     color: "#2c2c2a" },
  { id: 8,  name: "Denim Overshirt",             category: "jacket",  price: 125,  originalPrice: 165,  rating: 4.6, reviews: 78,  emoji: "🧥", badge: "sale",    color: "#3a5a7a" },
  { id: 9,  name: "Italian Linen Blazer",        category: "formal",  price: 220,  originalPrice: null, rating: 4.9, reviews: 62,  emoji: "🥼", badge: "limited", color: "#c8b896" },
  { id: 10, name: "Camp Collar Summer Shirt",    category: "shirt",   price: 72,   originalPrice: null, rating: 4.7, reviews: 203, emoji: "👔", badge: null,      color: "#d4956a" },
  { id: 11, name: "Drop-Shoulder Pocket Tee",    category: "tee",     price: 48,   originalPrice: null, rating: 4.6, reviews: 167, emoji: "👕", badge: null,      color: "#556b2f" },
  { id: 12, name: "Technical Field Jacket",      category: "jacket",  price: 195,  originalPrice: null, rating: 4.8, reviews: 44,  emoji: "🧥", badge: "new",     color: "#4a5568" },
];

/* ── CART STATE ── */
let cart = JSON.parse(localStorage.getItem("clofit_cart") || "[]");
let displayedCount = 8;
let currentSort = "default";

/* ── DOM HELPERS ── */
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ============================================================
   1. NAVBAR SCROLL EFFECT
   ============================================================ */
const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });


/* ============================================================
   2. HAMBURGER / MOBILE MENU
   ============================================================ */
const hamburger   = $("#hamburger");
const mobileMenu  = $("#mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("hidden");
});

function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.add("hidden");
}


/* ============================================================
   3. DARK / LIGHT MODE TOGGLE
   ============================================================ */
const themeToggle = $("#themeToggle");
const sunIcon     = $("#sunIcon");
const moonIcon    = $("#moonIcon");
const root        = document.documentElement;

const savedTheme = localStorage.getItem("clofit_theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "light" ? "dark" : "light");
});

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("clofit_theme", theme);
  if (theme === "dark") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}


/* ============================================================
   4. HERO STATS COUNTER
   ============================================================ */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

$$(".stat-number").forEach(el => counterObserver.observe(el));


/* ============================================================
   5. REVEAL ON SCROLL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  $$(".reveal").forEach(el => revealObserver.observe(el));
}
initReveal();


/* ============================================================
   6. SEARCH OVERLAY
   ============================================================ */
const searchOverlay = $("#searchOverlay");
const searchInput   = $("#searchInput");
const searchResults = $("#searchResults");

$("#searchBtn").addEventListener("click", openSearch);
$("#closeSearch").addEventListener("click", closeSearch);

searchOverlay.addEventListener("click", (e) => {
  if (e.target === searchOverlay) closeSearch();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !searchOverlay.classList.contains("hidden")) closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); openSearch(); }
});

function openSearch() {
  searchOverlay.classList.remove("hidden");
  setTimeout(() => searchInput.focus(), 50);
}
function closeSearch() {
  searchOverlay.classList.add("hidden");
  searchInput.value = "";
  searchResults.innerHTML = "";
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 1) { searchResults.innerHTML = ""; return; }
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderSearchResults(results, q);
  }, 200);
});

function renderSearchResults(results, q) {
  if (results.length === 0) {
    searchResults.innerHTML = `<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;">No results for "<em>${q}</em>"</p>`;
    return;
  }
  searchResults.innerHTML = results.slice(0, 6).map(p => `
    <div class="search-result-item" onclick="addToCart(${p.id}); closeSearch();">
      <span style="font-size:1.6rem">${p.emoji}</span>
      <div>
        <p style="font-weight:600;font-size:0.9rem">${highlightMatch(p.name, q)}</p>
        <p style="font-size:0.75rem;opacity:0.6;margin-top:3px;text-transform:uppercase;letter-spacing:0.08em">${p.category}</p>
      </div>
      <span class="res-price">$${p.price}</span>
    </div>
  `).join("");
}

function highlightMatch(text, q) {
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, `<mark style="background:rgba(200,169,110,0.4);color:inherit;border-radius:2px;">$1</mark>`);
}


/* ============================================================
   7. COLLECTION FILTER
   ============================================================ */
const filterPills = $$("#categoryFilter .filter-pill");

filterPills.forEach(btn => {
  btn.addEventListener("click", () => {
    filterPills.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    $$("#collectionGrid .collection-card").forEach(card => {
      const cardCat = card.dataset.cat;
      if (cat === "all" || cardCat === cat) {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        card.style.display = "";
      } else {
        card.style.opacity = "0.3";
        card.style.transform = "scale(0.97)";
      }
    });
  });
});


/* ============================================================
   8. PRODUCTS GRID RENDER
   ============================================================ */
function getSortedProducts() {
  let sorted = [...PRODUCTS];
  if (currentSort === "price-asc")  sorted.sort((a, b) => a.price - b.price);
  if (currentSort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (currentSort === "rating")     sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}

function renderProducts() {
  const grid = $("#productsGrid");
  const products = getSortedProducts().slice(0, displayedCount);

  grid.innerHTML = products.map(p => {
    const badgeHTML = p.badge
      ? `<div class="product-badge badge-${p.badge}">${p.badge === "new" ? "New" : p.badge === "sale" ? "Sale" : "Limited"}</div>`
      : "";
    const priceHTML = p.originalPrice
      ? `<span class="original">$${p.originalPrice}</span>$${p.price}`
      : `$${p.price}`;
    return `
      <div class="product-card reveal" data-id="${p.id}">
        <div class="product-img" style="background:${p.color}20;">
          <span style="filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2))">${p.emoji}</span>
          ${badgeHTML}
          <div class="product-overlay">
            <button onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
        <div class="product-info">
          <p class="product-category">${p.category}</p>
          <h3>${p.name}</h3>
          <div class="product-meta">
            <span class="product-price">${priceHTML}</span>
            <span class="product-rating">★ ${p.rating} (${p.reviews})</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Observe new reveal cards
  $$(".product-card.reveal").forEach(el => revealObserver.observe(el));

  // Show/hide Load More
  const loadMoreBtn = $("#loadMore");
  if (displayedCount >= PRODUCTS.length) {
    loadMoreBtn.textContent = "You've seen it all ✦";
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = "0.5";
  } else {
    loadMoreBtn.textContent = "Load More Styles";
    loadMoreBtn.disabled = false;
    loadMoreBtn.style.opacity = "1";
  }
}

$("#loadMore").addEventListener("click", () => {
  displayedCount += 4;
  renderProducts();
});

$("#sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

renderProducts();


/* ============================================================
   9. CART FUNCTIONALITY
   ============================================================ */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`🛍️ ${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem("clofit_cart", JSON.stringify(cart));
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = $("#cartCount");
  countEl.textContent = count;
  if (count > 0) countEl.classList.remove("hidden");
  else countEl.classList.add("hidden");
  $("#cartItemCount").textContent = count;
}

function renderCartItems() {
  const container = $("#cartItems");
  const footer    = $("#cartFooter");
  const empty     = $("#cartEmpty");

  if (cart.length === 0) {
    container.innerHTML = "";
    footer.style.display = "none";
    empty.style.display  = "";
    return;
  }

  empty.style.display  = "none";
  footer.style.display = "";

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="cart-item-qty">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">✕</button>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  $("#cartTotal").textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
  const drawer  = $("#cartDrawer");
  const overlay = $("#cartOverlay");
  const isOpen  = drawer.classList.contains("open");
  if (isOpen) {
    drawer.classList.remove("open");
    overlay.classList.add("hidden");
  } else {
    renderCartItems();
    drawer.classList.add("open");
    overlay.classList.remove("hidden");
  }
}

function checkout() {
  if (cart.length === 0) return;
  showToast("🎉 Order placed! Thanks for shopping with CLOFIT!");
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
  toggleCart();
}

$("#cartBtn").addEventListener("click", toggleCart);
updateCartUI();


/* ============================================================
   10. FORMS
   ============================================================ */
function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  btn.textContent = "Sending…";
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    form.reset();
    btn.textContent = "Send Message";
    btn.disabled = false;
    $("#formSuccess").classList.remove("hidden");
    setTimeout(() => $("#formSuccess").classList.add("hidden"), 5000);
    showToast("✅ Message sent! We'll reply within 24 hours.");
  }, 1200);
}

function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const btn   = e.target.querySelector("button");
  const email = input.value;
  btn.textContent = "Joining…";
  btn.disabled = true;

  setTimeout(() => {
    input.value = "";
    btn.textContent = "Subscribe";
    btn.disabled = false;
    showToast(`🎉 Welcome! Check ${email} for your 15% discount code.`);
  }, 1000);
}


/* ============================================================
   11. TOAST
   ============================================================ */
let toastTimer;
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}


/* ============================================================
   12. SMOOTH ANCHOR SCROLL (close mobile menu)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      closeMobileMenu();
    }
  });
});


/* ============================================================
   13. ACTIVE NAV LINK (IntersectionObserver)
   ============================================================ */
const sections = $$("section[id], #hero");
const navLinks = $$(".nav-links .nav-link");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => sectionObserver.observe(s));


/* ============================================================
   14. COLLECTION CARD CLICK — QUICK VIEW TOAST
   ============================================================ */
$$("#collectionGrid .collection-card").forEach(card => {
  card.addEventListener("click", () => {
    const name = card.querySelector("h3")?.textContent;
    if (name) showToast(`👁️ Viewing: ${name} — scroll to Shop to add to cart!`);
  });
});


/* ============================================================
   15. KEYBOARD ACCESSIBILITY
   ============================================================ */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const drawer = $("#cartDrawer");
    if (drawer.classList.contains("open")) toggleCart();
  }
});


/* ============================================================
   INIT
   ============================================================ */
console.log(
  "%cCLOFIT 👔\n%cPowered by clean code & great taste.",
  "color:#C8A96E;font-size:1.8rem;font-weight:bold;font-family:serif;",
  "color:#9A9890;font-size:0.85rem;"
);
