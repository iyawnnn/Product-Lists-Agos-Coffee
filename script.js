const productGrid = document.getElementById("productGrid");
const cartBody = document.getElementById("cartBody");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkoutBtn");
const searchInput = document.getElementById("search");

let cart = []; // { name, price, img, qty }

function formatPeso(n) {
  return `₱${Number(n).toFixed(0)}`;
}

function updateCartUI() {
  // clear
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-illustration">
        <img src="images/CART-PANEL.svg" alt="Empty Cart" class="empty-cart-img" />
        <h4>Hungry?</h4>
        <p>You haven't added anything to your cart!</p>
      </div>`;
    cartTotalEl.innerText = formatPeso(0);
    cartCountEl.innerText = 0;
    checkoutBtn.classList.remove("enabled");
    checkoutBtn.disabled = true;
    return;
  }

  // show items
  cart.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
    <img src="${item.img}" alt="${item.name}" />
    <div class="cart-item-details">
      <h4 class="cart-item-name">${item.name}</h4>
      <div class="cart-item-price">${formatPeso(item.price)}</div>
      <div class="qty-controls">
        <button class="qty-btn decrease" data-name="${item.name}">
          ${
            item.qty === 1
              ? `<img src="images/TRASH-ICON.svg" viewBox="0 0 24 24" width="14" height="14" fill="white">
       <path d="M3 6h18v2H3V6zm3 4h12v12H6V10zm3 2v8h6v-8H9z"/>
     </svg>`
              : `<span class="minus-sign">-</span>`
          }
        </button>
        <div class="qty-count">${item.qty}</div>
        <button class="qty-btn increase" data-name="${item.name}">
          <span class="plus-sign">+</span>
        </button>
      </div>
    </div>
  `;
    cartBody.appendChild(itemEl);
  });

  // totals
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotalEl.innerText = formatPeso(total);

  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.innerText = totalCount;

  // enable checkout
  checkoutBtn.disabled = false;
  checkoutBtn.classList.add("enabled");

  // attach qty events
  cartBody.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.name, +1));
  });
  cartBody.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.name, -1));
  });
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

// attach add buttons
document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
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
      {
        duration: 180,
        easing: "ease-out",
      }
    );
  });
});

// search
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase().trim();
  document.querySelectorAll(".product-card").forEach((card) => {
    const title = card.querySelector(".product-title").innerText.toLowerCase();
    const desc = card.querySelector(".product-desc").innerText.toLowerCase();
    const match = title.includes(value) || desc.includes(value);
    card.style.display = match ? "" : "none";
  });
});

// toggle cart focus
document.getElementById("cart-toggle").addEventListener("click", () => {
  document
    .getElementById("cartPanel")
    .scrollIntoView({ behavior: "smooth", block: "center" });
});

updateCartUI();
