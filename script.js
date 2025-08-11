document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const cartBody = document.getElementById("cartBody");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountDesktop = document.getElementById("cart-count");
  const cartCountMobile = document.getElementById("cart-count-mobile");
  const searchInput = document.getElementById("search"); 
  const mobileSearchInput = document.getElementById("mobile-search"); 
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const cancelCheckout = document.getElementById("cancelCheckout");
  const confirmCheckout = document.getElementById("confirmCheckout");
  const noResults = document.getElementById("noResults");
  const cartToggleDesktop = document.getElementById("cart-toggle");
  const cartToggleMobile = document.getElementById("cart-toggle-mobile");
  const sectionTitle = document.getElementById("sectionTitle");

  let cart = []; // { name, price, img, qty }

  function formatPeso(n) {
    return `₱${Number(n).toFixed(0)}`;
  }

  function updateCartUI() {
    if (!cartBody || !cartTotalEl) return;
    cartBody.innerHTML = "";

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="empty-illustration">
          <img src="images/CART-PANEL.svg" alt="Empty Cart" class="empty-cart-img" />
          <h4>Hungry?</h4>
          <p>You haven't added anything to your cart!</p>
        </div>`;
      cartTotalEl.innerText = formatPeso(0);
      updateCartCount(0);
      checkoutBtn?.classList.remove("enabled");
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    cart.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-price">${formatPeso(item.price)}</div>
          <div class="qty-controls">
            <button class="qty-btn decrease" data-name="${
              item.name
            }" style="background: var(--primary);">
              ${
                item.qty === 1
                  ? `<img src="images/TRASH-ICON.svg" width="14" height="14" alt="Remove">`
                  : `<span class="minus-sign">-</span>`
              }
            </button>
            <div class="qty-count">${item.qty}</div>
            <button class="qty-btn increase" data-name="${
              item.name
            }" style="background: var(--primary);">
              <span class="plus-sign">+</span>
            </button>
          </div>
        </div>
      `;
      cartBody.appendChild(itemEl);
    });

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotalEl.innerText = formatPeso(total);

    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    updateCartCount(totalCount);

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.add("enabled");
    }

    // wire up qty buttons
    cartBody
      .querySelectorAll(".increase")
      .forEach((btn) =>
        btn.addEventListener("click", () => changeQty(btn.dataset.name, +1))
      );
    cartBody
      .querySelectorAll(".decrease")
      .forEach((btn) =>
        btn.addEventListener("click", () => changeQty(btn.dataset.name, -1))
      );
  }

  function changeQty(name, delta) {
    const idx = cart.findIndex((i) => i.name === name);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    updateCartUI();
  }

  function addToCart(name, price, img) {
    const found = cart.find((i) => i.name === name);
    if (found) {
      found.qty++;
    } else {
      cart.push({ name, price: Number(price), img, qty: 1 });
    }
    updateCartUI();
  }

  function updateCartCount(count) {
    if (count > 0) {
      if (cartCountDesktop) {
        cartCountDesktop.textContent = count;
        cartCountDesktop.style.display = "inline";
      }
      if (cartCountMobile) {
        cartCountMobile.textContent = count;
        cartCountMobile.style.display = "inline";
      }
    } else {
      if (cartCountDesktop) {
        cartCountDesktop.textContent = "";
        cartCountDesktop.style.display = "none";
      }
      if (cartCountMobile) {
        cartCountMobile.textContent = "";
        cartCountMobile.style.display = "none";
      }
    }
  }

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      const name = card.dataset.name;
      const price = card.dataset.price;
      const img = card.dataset.img;
      addToCart(name, price, img);

      btn.animate(
        [
          { transform: "scale(1.0)" },
          { transform: "scale(0.92)" },
          { transform: "scale(1)" },
        ],
        { duration: 180, easing: "ease-out" }
      );
    });
  });

  function runSearch(rawValue) {
    if (!productGrid || !sectionTitle) return;
    const value = String(rawValue || "")
      .toLowerCase()
      .trim();
    const cards = productGrid.querySelectorAll(".product-card");
    let matchCount = 0;

    cards.forEach((card) => {
      const titleEl = card.querySelector(".product-title");
      const descEl = card.querySelector(".product-desc");
      const title = titleEl ? titleEl.innerText.toLowerCase() : "";
      const desc = descEl ? descEl.innerText.toLowerCase() : "";
      const match = title.includes(value) || desc.includes(value);
      card.style.display = match ? "" : "none";
      if (match) matchCount++;
    });

    sectionTitle.textContent = value ? "Search Results:" : "Products";

    if (noResults && productGrid) {
      if (value && matchCount === 0) {
        noResults.style.display = "flex";
        productGrid.style.display = "none";
      } else {
        noResults.style.display = "none";
        productGrid.style.display = "grid";
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => runSearch(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch(searchInput.value);
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", (e) =>
      runSearch(e.target.value)
    );
    mobileSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch(mobileSearchInput.value);
        mobileSearchInput.blur();
      }
    });
  }

  const mobileSearchWrapper = document.querySelector(".mobile-search-wrapper");
  const mobileSearchBtn = document.getElementById("mobile-search-btn");

  mobileSearchBtn.addEventListener("click", () => {
    mobileSearchWrapper.classList.add("active");
    mobileSearchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!mobileSearchWrapper.contains(e.target)) {
      mobileSearchWrapper.classList.remove("active");
      mobileSearchInput.value = "";
    }
  });

  // scroll to cart helper
  function scrollToCart() {
    const panel = document.getElementById("cartPanel");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  cartToggleDesktop?.addEventListener("click", scrollToCart);
  cartToggleMobile?.addEventListener("click", scrollToCart);

  // header shadow toggle
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 0);
  });

  // checkout modal
  if (checkoutBtn && checkoutModal && cancelCheckout && confirmCheckout) {
    checkoutBtn.addEventListener(
      "click",
      () => (checkoutModal.style.display = "flex")
    );
    cancelCheckout.addEventListener(
      "click",
      () => (checkoutModal.style.display = "none")
    );
    confirmCheckout.addEventListener(
      "click",
      () => (window.location.href = "checkout.html")
    );
  }

  updateCartUI();
});