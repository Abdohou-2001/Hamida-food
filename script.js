/* ==========================================================================
   HAMIDA FOOD - script.js | Vanilla JS Production Ready
   Compatible with index.html / style.css / data.js
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ---------------- 0. Safe Data Access ---------------- */
  const _products = typeof products !== "undefined" && Array.isArray(products) ? products : [];
  const _categories = typeof categories !== "undefined" ? categories : [];
  const _offers = typeof offers !== "undefined" ? offers : [];
  const _restaurantInfo = typeof restaurantInfo !== "undefined" ? restaurantInfo : { name: "Hamida Food", tagline: "Le goût authentique", whatsapp: "212600000000", phone: "+212600000000", address: "Votre adresse", currency: "DH" };
  const _delivery = typeof deliverySettings !== "undefined" ? deliverySettings : { fee: 10, freeDeliveryFrom: 150, minOrder: 30 };
  const _social = typeof socialLinks !== "undefined" ? socialLinks : {};
  const _heroSlides = typeof heroSlides !== "undefined" ? heroSlides : [];

  /* ---------------- 1. State ---------------- */
  let cart = [];
  let currentProduct = null;
  let currentProductQty = 1;
  let activeCategory = "all";
  let searchQuery = "";
  let currentSlide = 0;
  let heroTimer = null;
  let lastFocusedElement = null;

  const STORAGE_KEY = "hamidaFoodCart";
  const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F8F5EF'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23D9A441' font-weight='700'%3EHAMIDA FOOD%3C/text%3E%3C/svg%3E";

  /* ---------------- 2. DOM Cache ---------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    siteHeader: $("siteHeader"),
    hamburger: $("hamburgerMenu"),
    mobilePanel: $("mobileNavPanel"),
    heroSlider: $("heroSlider"),
    heroPrev: $("heroPrev"),
    heroNext: $("heroNext"),
    heroDots: $("heroDots"),
    productSearch: $("productSearch"),
    searchClear: $("searchClear"),
    categoryFilters: $("categoryFilters"),
    productsGrid: $("productsGrid"),
    emptyState: $("emptyState"),
    resetFilters: $("resetFilters"),
    cartButton: $("cartButton"),
    cartCount: $("cartCount"),
    cartDrawer: $("cartDrawer"),
    cartOverlay: $("cartOverlay"),
    cartClose: $("cartClose"),
    cartItems: $("cartItems"),
    emptyCart: $("emptyCart"),
    emptyCartBtn: $("emptyCartBtn"),
    cartFooter: $("cartFooter"),
    cartSubtotal: $("cartSubtotal"),
    deliveryFee: $("deliveryFee"),
    cartTotal: $("cartTotal"),
    checkoutWhatsApp: $("checkoutWhatsApp"),
    productModal: $("productModal"),
    productModalClose: $("productModalClose"),
    productModalImage: $("productModalImage"),
    productModalBadge: $("productModalBadge"),
    productModalName: $("productModalName"),
    productModalDesc: $("productModalDesc"),
    productModalPrice: $("productModalPrice"),
    productModalOldPrice: $("productModalOldPrice"),
    qtyMinus: $("qtyMinus"),
    qtyPlus: $("qtyPlus"),
    productModalQty: $("productModalQty"),
    productModalAddToCart: $("productModalAddToCart"),
    checkoutModal: $("checkoutModal"),
    checkoutModalClose: $("checkoutModalClose"),
    checkoutForm: $("checkoutForm"),
    customerName: $("customerName"),
    customerPhone: $("customerPhone"),
    customerAddress: $("customerAddress"),
    customerNotes: $("customerNotes"),
    whatsappFloat: $("whatsappFloat"),
    mobileBottomNav: $("mobileBottomNav"),
    bottomCartBtn: $("bottomCartBtn"),
    bottomCartCount: $("bottomCartCount"),
    searchToggle: $("searchToggle"),
    searchWrapper: document.querySelector(".search-wrapper"),
    logo: $("logo")
  };

  /* ---------------- 3. Helpers ---------------- */
  const formatPrice = (n) => {
    const num = Number(n) || 0;
    return `${num} ${(_restaurantInfo.currency || "DH")}`;
  };
  const cleanWhatsAppNumber = (num) => (num || "").toString().replace(/[^0-9]/g, "");
  const getProductById = (id) => _products.find(p => p.id === Number(id));
  const isValidProduct = (p) => p && typeof p.id !== "undefined" && p.name && p.category && typeof p.price === "number" && p.image;

  const saveCart = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  };
  const loadCart = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // reconcile: keep only existing products
      return parsed.filter(item => {
        if (!item || typeof item.productId === "undefined") return false;
        const prod = getProductById(item.productId);
        return !!prod && prod.available !== false;
      }).map(item => ({ productId: Number(item.productId), quantity: Math.max(1, Number(item.quantity) || 1) }));
    } catch (e) { return []; }
  };

  const lockScroll = () => document.body.classList.add("no-scroll");
  const unlockScroll = () => {
    if (!els.cartDrawer?.classList.contains("is-open") && !els.productModal?.classList.contains("is-open") && !els.checkoutModal?.classList.contains("is-open") && !els.mobilePanel?.classList.contains("is-open")) {
      document.body.classList.remove("no-scroll");
    }
  };

  const showToast = (message, type = "success") => {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.cssText = "position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `pointer-events:auto;min-width:220px;max-width:92vw;padding:12px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,.18);background:${type === "error" ? "#111" : "#fff"};color:${type === "error" ? "#fff" : "#111"};border:1px solid ${type === "error" ? "#222" : "#ece6d8"};transform:translateY(8px);opacity:0;transition:all .28s ease`;
    if (type === "success") toast.style.borderLeft = "4px solid #D9A441";
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = "translateY(0)"; toast.style.opacity = "1"; });
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(8px)"; setTimeout(() => toast.remove(), 280); }, 2600);
  };

  const getBadgeClass = (badge) => {
    if (!badge) return "";
    const b = badge.toLowerCase();
    if (b.includes("nouveau")) return "badge-nouveau";
    if (b.includes("populaire")) return "badge-populaire";
    if (b.includes("offre")) return "badge-offre";
    return "";
  };

  /* ---------------- 4. Hero Slider ---------------- */
  function initHeroSlider() {
    if (!els.heroSlider || _heroSlides.length === 0) return;
    // Build slides if needed
    if (_heroSlides.length > 1) {
      // If existing markup has only 1 slide, rebuild
      els.heroSlider.innerHTML = "";
      _heroSlides.forEach((slide, idx) => {
        const div = document.createElement("div");
        div.className = `hero-slide ${idx === 0 ? "is-active" : ""}`;
        div.dataset.slide = String(idx);
        div.innerHTML = `
          <div class="hero-bg">
            <img src="${slide.image}" alt="${slide.title || _restaurantInfo.name}" width="1920" height="1080" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
            <div class="hero-overlay" aria-hidden="true"></div>
          </div>
          <div class="container hero-content">
            <span class="badge hero-badge">${slide.badge || _restaurantInfo.tagline}</span>
            <h1 class="hero-title">${slide.title || "HAMIDA FOOD"}</h1>
            <p class="hero-subtitle">${slide.subtitle || ""}</p>
            <div class="hero-actions">
              <a href="#menu" class="btn btn-primary btn-large">${slide.ctaPrimary || "Voir le menu"}</a>
              <a href="#menu" class="btn btn-outline btn-large">${slide.ctaSecondary || "Commander maintenant"}</a>
            </div>
          </div>`;
        els.heroSlider.appendChild(div);
      });
      // rebuild dots
      if (els.heroDots) {
        els.heroDots.innerHTML = "";
        _heroSlides.forEach((_, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `hero-dot ${idx === 0 ? "is-active" : ""}`;
          btn.dataset.dot = String(idx);
          btn.setAttribute("role", "tab");
          btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
          btn.setAttribute("aria-label", `Slide ${idx + 1}`);
          els.heroDots.appendChild(btn);
        });
      }
    }

    const slides = () => els.heroSlider.querySelectorAll(".hero-slide");
    const dots = () => els.heroDots ? els.heroDots.querySelectorAll(".hero-dot") : [];

    const goToSlide = (index) => {
      const total = slides().length;
      if (total === 0) return;
      currentSlide = (index + total) % total;
      slides().forEach((s, i) => s.classList.toggle("is-active", i === currentSlide));
      dots().forEach((d, i) => {
        d.classList.toggle("is-active", i === currentSlide);
        d.setAttribute("aria-selected", i === currentSlide ? "true" : "false");
      });
    };
    const next = () => goToSlide(currentSlide + 1);
    const prev = () => goToSlide(currentSlide - 1);

    const startAuto = () => {
      stopAuto();
      heroTimer = setInterval(next, 5000);
    };
    const stopAuto = () => { if (heroTimer) clearInterval(heroTimer); heroTimer = null; };

    els.heroNext?.addEventListener("click", () => { next(); startAuto(); });
    els.heroPrev?.addEventListener("click", () => { prev(); startAuto(); });

    els.heroDots?.addEventListener("click", (e) => {
      const dot = e.target.closest(".hero-dot");
      if (!dot) return;
      const idx = Number(dot.dataset.dot);
      if (!isNaN(idx)) { goToSlide(idx); startAuto(); }
    });

    // pause on hover/focus
    els.heroSlider.addEventListener("mouseenter", stopAuto);
    els.heroSlider.addEventListener("mouseleave", startAuto);
    els.heroSlider.addEventListener("focusin", stopAuto);
    els.heroSlider.addEventListener("focusout", startAuto);

    startAuto();
    // expose for touch swipe simple
    let startX = 0;
    els.heroSlider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    els.heroSlider.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) { diff < 0 ? next() : prev(); }
      startAuto();
    }, { passive: true });
  }

  /* ---------------- 5. Product Rendering ---------------- */
  function getFilteredProducts() {
    const q = searchQuery.trim().toLowerCase();
    return _products.filter(p => {
      if (!isValidProduct(p)) return false;
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (p.available === false) return true; // show but disabled
      if (!q) return true;
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  }

  function renderProducts() {
    if (!els.productsGrid) return;
    const filtered = getFilteredProducts();
    els.productsGrid.innerHTML = "";

    if (filtered.length === 0) {
      if (els.emptyState) els.emptyState.hidden = false;
      return;
    }
    if (els.emptyState) els.emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    filtered.forEach(product => {
      if (!isValidProduct(product)) return;
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = String(product.id);
      card.dataset.category = product.category;

      const badgeHtml = product.badge ? `<span class="product-badge ${getBadgeClass(product.badge)}">${product.badge}</span>` : "";
      const oldPriceHtml = product.oldPrice ? `<span class="old">${formatPrice(product.oldPrice)}</span>` : "";
      const unavailable = product.available === false;

      card.innerHTML = `
        <div class="product-image-wrapper">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
          ${badgeHtml}
          <button type="button" class="product-quick-view" aria-label="Voir ${product.name}">
            <i class="fa-regular fa-eye" aria-hidden="true"></i>
          </button>
          ${unavailable ? `<span class="product-badge" style="left:auto;right:10px;top:auto;bottom:10px;background:#111;color:#fff">Indisponible</span>` : ""}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(product.price)} ${oldPriceHtml}</span>
            <button type="button" class="btn add-to-cart" data-add="${product.id}" ${unavailable ? "disabled aria-disabled='true'" : ""}>${unavailable ? "Indisponible" : "Ajouter"}</button>
          </div>
          <button type="button" class="btn btn-ghost product-details-btn" data-detail="${product.id}">Voir détails</button>
        </div>
      `;
      frag.appendChild(card);
    });
    els.productsGrid.appendChild(frag);
  }

  /* ---------------- 6. Search & Categories ---------------- */
  function initSearch() {
    if (els.productSearch) {
      els.productSearch.addEventListener("input", (e) => {
        searchQuery = e.target.value || "";
        if (els.searchClear) els.searchClear.hidden = searchQuery.length === 0;
        renderProducts();
        // scroll to menu if typing first time on hero
        if (searchQuery.length === 1) {
          // keep focus
        }
      });
      // optional toggle
      els.searchToggle?.addEventListener("click", () => {
        if (els.searchWrapper) {
          const menuSection = document.getElementById("menu");
          if (menuSection) menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => els.productSearch?.focus(), 300);
        }
      });
    }
    els.searchClear?.addEventListener("click", () => {
      searchQuery = "";
      if (els.productSearch) els.productSearch.value = "";
      if (els.searchClear) els.searchClear.hidden = true;
      renderProducts();
    });
    els.resetFilters?.addEventListener("click", () => {
      searchQuery = "";
      activeCategory = "all";
      if (els.productSearch) els.productSearch.value = "";
      if (els.searchClear) els.searchClear.hidden = true;
      updateCategoryUI();
      renderProducts();
    });
  }

  function updateCategoryUI() {
    if (!els.categoryFilters) return;
    els.categoryFilters.querySelectorAll(".category-btn").forEach(btn => {
      const isActive = btn.dataset.category === activeCategory;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function initCategories() {
    if (!els.categoryFilters) return;
    els.categoryFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;
      const cat = btn.dataset.category;
      if (!cat) return;
      activeCategory = cat;
      updateCategoryUI();
      renderProducts();
    });
    updateCategoryUI();
  }

  /* ---------------- 7. Cart ---------------- */
  function addToCart(productId, qty = 1) {
    const id = Number(productId);
    const prod = getProductById(id);
    if (!prod || prod.available === false) {
      showToast("Produit indisponible", "error");
      return;
    }
    const existing = cart.find(i => i.productId === id);
    if (existing) existing.quantity += qty;
    else cart.push({ productId: id, quantity: qty });
    saveCart();
    renderCart();
    updateCartCount();
    showToast(`${prod.name} ajouté au panier`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== Number(productId));
    saveCart();
    renderCart();
    updateCartCount();
    showToast("Produit retiré", "error");
  }

  function changeCartQty(productId, delta) {
    const item = cart.find(i => i.productId === Number(productId));
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    renderCart();
    updateCartCount();
  }

  function updateCartCount() {
    const totalQty = cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    [els.cartCount, els.bottomCartCount].forEach(el => {
      if (!el) return;
      el.textContent = String(totalQty);
      el.hidden = totalQty === 0;
      el.style.display = totalQty === 0 ? "none" : "grid";
    });
  }

  function calculateCart() {
    let subtotal = 0;
    cart.forEach(item => {
      const prod = getProductById(item.productId);
      if (!prod) return;
      subtotal += prod.price * item.quantity;
    });
    const fee = _delivery.fee || 0;
    const freeFrom = _delivery.freeDeliveryFrom || 0;
    let delivery = subtotal === 0 ? 0 : (freeFrom > 0 && subtotal >= freeFrom ? 0 : fee);
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  }

  function renderCart() {
    if (!els.cartItems) return;
    els.cartItems.innerHTML = "";
    if (cart.length === 0) {
      if (els.emptyCart) els.emptyCart.hidden = false;
      if (els.cartFooter) els.cartFooter.classList.add("is-hidden");
      if (els.cartSubtotal) els.cartSubtotal.textContent = formatPrice(0);
      if (els.deliveryFee) els.deliveryFee.textContent = formatPrice(0);
      if (els.cartTotal) els.cartTotal.textContent = formatPrice(0);
      return;
    }
    if (els.emptyCart) els.emptyCart.hidden = true;
    if (els.cartFooter) els.cartFooter.classList.remove("is-hidden");

    const frag = document.createDocumentFragment();
    cart.forEach(item => {
      const prod = getProductById(item.productId);
      if (!prod) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.id = String(prod.id);
      row.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
        <div>
          <div class="cart-item-name">${prod.name}</div>
          <div class="cart-item-price">${formatPrice(prod.price)}</div>
          <div class="cart-item-qty">
            <button type="button" class="qty-btn" data-dec="${prod.id}" aria-label="Diminuer">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="qty-btn" data-inc="${prod.id}" aria-label="Augmenter">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" data-remove="${prod.id}" aria-label="Retirer ${prod.name}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      `;
      frag.appendChild(row);
    });
    els.cartItems.appendChild(frag);

    const { subtotal, delivery, total } = calculateCart();
    if (els.cartSubtotal) els.cartSubtotal.textContent = formatPrice(subtotal);
    if (els.deliveryFee) els.deliveryFee.textContent = delivery === 0 ? (subtotal === 0 ? formatPrice(0) : "GRATUITE") : formatPrice(delivery);
    if (els.cartTotal) els.cartTotal.textContent = formatPrice(total);
  }

  function openCart() {
    if (!els.cartDrawer) return;
    lastFocusedElement = document.activeElement;
    els.cartDrawer.classList.add("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "false");
    els.cartButton?.setAttribute("aria-expanded", "true");
    els.bottomCartBtn?.setAttribute("aria-expanded", "true");
    lockScroll();
    // focus close
    setTimeout(() => els.cartClose?.focus(), 80);
  }
  function closeCart() {
    if (!els.cartDrawer) return;
    els.cartDrawer.classList.remove("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "true");
    els.cartButton?.setAttribute("aria-expanded", "false");
    els.bottomCartBtn?.setAttribute("aria-expanded", "false");
    unlockScroll();
    if (lastFocusedElement) { try { lastFocusedElement.focus(); } catch(e){} }
  }

  function initCart() {
    cart = loadCart();
    renderCart();
    updateCartCount();

    els.cartButton?.addEventListener("click", openCart);
    els.bottomCartBtn?.addEventListener("click", openCart);
    els.cartClose?.addEventListener("click", closeCart);
    els.cartOverlay?.addEventListener("click", closeCart);
    els.emptyCartBtn?.addEventListener("click", (e) => { e.preventDefault(); closeCart(); document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }); });

    els.cartItems?.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      if (inc) { changeCartQty(inc.dataset.inc, 1); return; }
      const dec = e.target.closest("[data-dec]");
      if (dec) { changeCartQty(dec.dataset.dec, -1); return; }
      const rem = e.target.closest("[data-remove]");
      if (rem) { removeFromCart(rem.dataset.remove); return; }
    });

    // delegation for product grid
    els.productsGrid?.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) { addToCart(addBtn.dataset.add, 1); return; }
      const quick = e.target.closest(".product-quick-view");
      if (quick) {
        const card = quick.closest(".product-card");
        if (card) openProductModal(Number(card.dataset.id));
        return;
      }
      const detail = e.target.closest("[data-detail]");
      if (detail) { openProductModal(Number(detail.dataset.detail)); return; }
      const card = e.target.closest(".product-card");
      if (card && !e.target.closest("button")) {
        openProductModal(Number(card.dataset.id));
      }
    });
  }

  /* ---------------- 8. Product Modal ---------------- */
  function openProductModal(productId) {
    const prod = getProductById(productId);
    if (!prod) return;
    currentProduct = prod;
    currentProductQty = 1;

    if (els.productModalImage) {
      els.productModalImage.src = prod.image;
      els.productModalImage.alt = prod.name;
      els.productModalImage.onerror = function(){ this.onerror=null; this.src=PLACEHOLDER_IMG; };
    }
    if (els.productModalBadge) {
      if (prod.badge) { els.productModalBadge.textContent = prod.badge; els.productModalBadge.className = `product-badge ${getBadgeClass(prod.badge)}`; els.productModalBadge.hidden = false; }
      else { els.productModalBadge.hidden = true; }
    }
    if (els.productModalName) els.productModalName.textContent = prod.name;
    if (els.productModalDesc) els.productModalDesc.textContent = prod.description || "";
    if (els.productModalPrice) els.productModalPrice.textContent = formatPrice(prod.price);
    if (els.productModalOldPrice) {
      if (prod.oldPrice) { els.productModalOldPrice.textContent = formatPrice(prod.oldPrice); els.productModalOldPrice.hidden = false; }
      else { els.productModalOldPrice.hidden = true; }
    }
    if (els.productModalQty) els.productModalQty.textContent = "1";
    if (els.productModalAddToCart) {
      els.productModalAddToCart.disabled = prod.available === false;
      els.productModalAddToCart.textContent = prod.available === false ? "Indisponible" : "Ajouter au panier";
    }

    if (!els.productModal) return;
    lastFocusedElement = document.activeElement;
    els.productModal.classList.add("is-open");
    els.productModal.setAttribute("aria-hidden", "false");
    lockScroll();
    setTimeout(() => els.productModalClose?.focus(), 80);
  }
  function closeProductModal() {
    if (!els.productModal) return;
    els.productModal.classList.remove("is-open");
    els.productModal.setAttribute("aria-hidden", "true");
    unlockScroll();
    currentProduct = null;
    if (lastFocusedElement) { try{ lastFocusedElement.focus(); } catch(e){} }
  }
  function initProductModal() {
    els.productModalClose?.addEventListener("click", closeProductModal);
    els.productModal?.querySelectorAll("[data-close='productModal']").forEach(el => el.addEventListener("click", closeProductModal));
    els.qtyMinus?.addEventListener("click", () => {
      if (currentProductQty > 1) { currentProductQty--; if (els.productModalQty) els.productModalQty.textContent = String(currentProductQty); }
    });
    els.qtyPlus?.addEventListener("click", () => {
      currentProductQty++; if (els.productModalQty) els.productModalQty.textContent = String(currentProductQty);
    });
    els.productModalAddToCart?.addEventListener("click", () => {
      if (!currentProduct) return;
      addToCart(currentProduct.id, currentProductQty);
      closeProductModal();
      // open cart feedback
      setTimeout(openCart, 200);
    });
  }

  /* ---------------- 9. Checkout / WhatsApp ---------------- */
  function openCheckout() {
    if (cart.length === 0) { showToast("Votre panier est vide", "error"); return; }
    const { subtotal } = calculateCart();
    const minOrder = _delivery.minOrder || 0;
    if (minOrder > 0 && subtotal < minOrder) {
      showToast(`Commande minimum: ${formatPrice(minOrder)}`, "error");
      return;
    }
    if (!els.checkoutModal) return;
    lastFocusedElement = document.activeElement;
    els.checkoutModal.classList.add("is-open");
    els.checkoutModal.setAttribute("aria-hidden", "false");
    lockScroll();
    setTimeout(() => els.customerName?.focus(), 80);
  }
  function closeCheckout() {
    if (!els.checkoutModal) return;
    els.checkoutModal.classList.remove("is-open");
    els.checkoutModal.setAttribute("aria-hidden", "true");
    unlockScroll();
    if (lastFocusedElement) { try{ lastFocusedElement.focus(); } catch(e){} }
  }

  function validateCheckout() {
    let valid = true;
    let firstInvalid = null;
    const fields = [
      { el: els.customerName, check: (v) => v.trim().length >= 2 },
      { el: els.customerPhone, check: (v) => {
          const cleaned = v.replace(/\s|-|\(|\)/g, "");
          return /^(\+212|0)[0-9]{9,12}$/.test(cleaned) || /^[0-9]{8,15}$/.test(cleaned);
        }},
      { el: els.customerAddress, check: (v) => v.trim().length >= 6 }
    ];
    fields.forEach(({ el, check }) => {
      if (!el) return;
      el.classList.remove("is-invalid");
      if (!check(el.value || "")) {
        el.classList.add("is-invalid");
        valid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function buildWhatsAppMessage() {
    const { subtotal, delivery, total } = calculateCart();
    const name = els.customerName?.value.trim() || "";
    const phone = els.customerPhone?.value.trim() || "";
    const address = els.customerAddress?.value.trim() || "";
    const notes = els.customerNotes?.value.trim() || "";

    let lines = [];
    lines.push(`🍔 *${(_restaurantInfo.name || "HAMIDA FOOD").toUpperCase()} - Nouvelle commande*`);
    lines.push("");
    lines.push(`👤 Client: ${name}`);
    lines.push(`📞 Téléphone: ${phone}`);
    lines.push(`📍 Adresse: ${address}`);
    lines.push("");
    lines.push(`🛒 *Commande:*`);
    lines.push("");
    let i = 1;
    cart.forEach(item => {
      const prod = getProductById(item.productId);
      if (!prod) return;
      const lineTotal = prod.price * item.quantity;
      lines.push(`${i}. ${prod.name}`);
      lines.push(`   ${item.quantity} × ${formatPrice(prod.price)} = ${formatPrice(lineTotal)}`);
      lines.push("");
      i++;
    });
    lines.push("────────────────");
    lines.push("");
    lines.push(`Sous-total: ${formatPrice(subtotal)}`);
    lines.push(`Livraison: ${delivery === 0 ? "GRATUITE" : formatPrice(delivery)}`);
    lines.push(`TOTAL: ${formatPrice(total)}`);
    if (notes) {
      lines.push("");
      lines.push(`📝 Notes:`);
      lines.push(notes);
    }
    lines.push("");
    lines.push("Merci pour votre commande ❤️");
    return lines.join("\n");
  }

  function initCheckout() {
    els.checkoutWhatsApp?.addEventListener("click", openCheckout);
    els.checkoutModalClose?.addEventListener("click", closeCheckout);
    els.checkoutModal?.querySelectorAll("[data-close='checkoutModal']").forEach(el => el.addEventListener("click", closeCheckout));

    els.checkoutForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCheckout()) {
        showToast("Veuillez corriger les champs", "error");
        return;
      }
      const message = buildWhatsAppMessage();
      const rawNum = _restaurantInfo.whatsapp || "212600000000";
      const num = cleanWhatsAppNumber(rawNum) || "212600000000";
      const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

      // open WhatsApp
      window.open(url, "_blank", "noopener,noreferrer");

      // reset after
      setTimeout(() => {
        closeCheckout();
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        els.checkoutForm?.reset();
        showToast("Commande envoyée sur WhatsApp !");
      }, 600);
    });

    // live remove invalid
    [els.customerName, els.customerPhone, els.customerAddress].forEach(el => {
      el?.addEventListener("input", () => el.classList.remove("is-invalid"));
    });
  }

  /* ---------------- 10. Header, Mobile Menu, Scroll ---------------- */
  function initHeader() {
    const onScroll = () => {
      if (!els.siteHeader) return;
      if (window.scrollY > 30) els.siteHeader.classList.add("is-scrolled");
      else els.siteHeader.classList.remove("is-scrolled");
    };
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => { onScroll(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    if (!els.hamburger || !els.mobilePanel) return;
    const open = () => {
      els.mobilePanel.classList.add("is-open");
      els.hamburger.classList.add("is-open");
      els.mobilePanel.setAttribute("aria-hidden", "false");
      els.hamburger.setAttribute("aria-expanded", "true");
      lockScroll();
    };
    const close = () => {
      els.mobilePanel.classList.remove("is-open");
      els.hamburger.classList.remove("is-open");
      els.mobilePanel.setAttribute("aria-hidden", "true");
      els.hamburger.setAttribute("aria-expanded", "false");
      unlockScroll();
    };
    els.hamburger.addEventListener("click", () => {
      els.mobilePanel.classList.contains("is-open") ? close() : open();
    });
    els.mobilePanel.querySelectorAll(".mobile-nav-link, .btn").forEach(a => {
      a.addEventListener("click", () => close());
    });
    // close on outside click? panel is full width, but handle Escape via global
    window._closeMobileMenu = close;
  }

  function initScrollNavigation() {
    const sections = ["accueil","menu","about","offres","galerie","avis","contact"].map(id => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link, .bottom-nav-item");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll(".nav-link, .mobile-nav-link, .bottom-nav-item").forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) link.classList.add("is-active", "active");
            else if (href && href.startsWith("#")) link.classList.remove("is-active", "active");
          });
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }

  /* ---------------- 11. Offers, Social, WhatsApp Float ---------------- */
  function initOffers() {
    document.querySelectorAll("[data-offer]").forEach(btn => {
      btn.addEventListener("click", () => {
        const offerId = btn.dataset.offer;
        const offer = _offers.find(o => o.id === offerId);
        if (!offer) return;
        // If offer price >0 and related product exists, try to add familial or burger-menu logic
        if (offerId === "familial" || offerId === "burger-menu" || offerId === "pizza-offre") {
          // find related product by id mapping if possible
          const map = { "burger-menu": 2, "familial": 14, "pizza-offre": 7 };
          const prodId = map[offerId];
          const prod = getProductById(prodId);
          if (prod) {
            openProductModal(prod.id);
            return;
          }
        }
        if (offerId === "livraison-offerte") {
          document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
          showToast("Livraison gratuite dès " + formatPrice(_delivery.freeDeliveryFrom || 150));
          return;
        }
        // fallback toast
        showToast(offer.title + " - " + offer.description);
      });
    });
  }

  function initSocialLinks() {
    // update hrefs
    const selectors = {
      facebook: 'a[aria-label="Facebook"]',
      instagram: 'a[aria-label="Instagram"]',
      tiktok: 'a[aria-label="TikTok"]',
      whatsapp: 'a[aria-label="WhatsApp"], a[aria-label="Contacter sur WhatsApp"], #whatsappFloat'
    };
    if (_social.facebook) {
      document.querySelectorAll(selectors.facebook).forEach(a => { if (a.id !== "whatsappFloat") a.href = _social.facebook; });
    }
    if (_social.instagram) {
      document.querySelectorAll(selectors.instagram).forEach(a => a.href = _social.instagram);
    }
    if (_social.tiktok) {
      document.querySelectorAll(selectors.tiktok).forEach(a => a.href = _social.tiktok);
    }
    const waNum = cleanWhatsAppNumber(_restaurantInfo.whatsapp || _social.whatsapp || "212600000000");
    if (waNum) {
      const waUrl = `https://wa.me/${waNum}`;
      if (els.whatsappFloat) els.whatsappFloat.href = waUrl;
      document.querySelectorAll('a.btn-whatsapp, a[href*="wa.me"]').forEach(a => {
        if (a.id === "whatsappFloat") return;
        // keep checkout button as button, not link
        if (a.tagName === "A" && a.getAttribute("href")?.includes("wa.me")) a.href = waUrl;
      });
      // contact buttons
      const contactWaBtns = document.querySelectorAll(".btn-whatsapp");
      contactWaBtns.forEach(btn => {
        if (btn.tagName === "A" && btn.id !== "checkoutWhatsApp" && btn.id !== "sendWhatsAppOrder") btn.href = waUrl;
      });
    }
  }

  /* ---------------- 12. Keyboard & Global Close ---------------- */
  function initGlobalEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (els.checkoutModal?.classList.contains("is-open")) closeCheckout();
        else if (els.productModal?.classList.contains("is-open")) closeProductModal();
        else if (els.cartDrawer?.classList.contains("is-open")) closeCart();
        else if (els.mobilePanel?.classList.contains("is-open") && window._closeMobileMenu) window._closeMobileMenu();
      }
    });
  }

  /* ---------------- 13. Init All ---------------- */
  function init() {
    initHeader();
    initMobileMenu();
    initHeroSlider();
    initSearch();
    initCategories();
    initCart();
    initProductModal();
    initCheckout();
    initScrollNavigation();
    initOffers();
    initSocialLinks();
    initGlobalEvents();
    renderProducts();
    updateCartCount();
  }

  init();
});
