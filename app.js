const products = [
  {id:1,name:"Kopi Gula Aren",price:12000,cat:"coffee",icon:"🧋"},
  {id:2,name:"Butterscotch",price:12000,cat:"coffee",icon:"☕"},
  {id:3,name:"Hazelnut",price:12000,cat:"coffee",icon:"☕"},
  {id:4,name:"Spanish Latte",price:12000,cat:"coffee",icon:"🥛"},
  {id:5,name:"Café Latte",price:10000,cat:"coffee",icon:"☕"},
  {id:6,name:"Matcha",price:15000,cat:"noncoffee",icon:"🍵"},
  {id:7,name:"Green Tea",price:12000,cat:"noncoffee",icon:"🍵"},
  {id:8,name:"Thai Tea",price:12000,cat:"noncoffee",icon:"🧋"},
  {id:9,name:"Americano",price:10000,cat:"coffee",icon:"☕"}
];

let cart = JSON.parse(localStorage.getItem("ombrew_cart") || "{}");

const rupiah = n => "Rp" + n.toLocaleString("id-ID");

function productCard(p){
  return `<article class="card">
    <div class="product-image">${p.icon}</div>
    <div class="product-name">${p.name}</div>
    <div class="product-meta">14 oz • Freshly made</div>
    <div class="price-row">
      <div class="price">${rupiah(p.price)}</div>
      <button class="add" onclick="addToCart(${p.id})">+</button>
    </div>
  </article>`;
}

function renderFeatured(){
  document.getElementById("featured").innerHTML = products.slice(0,4).map(productCard).join("");
}

function renderMenu(cat="all"){
  const list = cat==="all" ? products : products.filter(p=>p.cat===cat);
  document.getElementById("menuList").innerHTML = list.map(productCard).join("");
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); renderCart(); updateCount();
}

function changeQty(id,delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(); renderCart(); updateCount();
}

function saveCart(){localStorage.setItem("ombrew_cart",JSON.stringify(cart));}

function updateCount(){
  document.getElementById("cartCount").textContent =
    Object.values(cart).reduce((a,b)=>a+b,0);
}

function renderCart(){
  const entries = Object.entries(cart);
  const el = document.getElementById("cart");
  if(!entries.length){
    el.innerHTML = `<div class="empty">🛒<br><br>Keranjang masih kosong.<br>Yuk pilih minuman favoritmu!</div>`;
    return;
  }
  let total = 0;
  const items = entries.map(([id,qty])=>{
    const p = products.find(x=>x.id==id);
    total += p.price * qty;
    return `<div class="cart-card">
      <div class="cart-icon">${p.icon}</div>
      <div class="cart-info">
        <div class="cart-name">${p.name}</div>
        <div class="cart-price">${rupiah(p.price)} • 14 oz</div>
      </div>
      <div class="qty">
        <button onclick="changeQty(${p.id},-1)">−</button>
        <b>${qty}</b>
        <button onclick="changeQty(${p.id},1)">+</button>
      </div>
    </div>`;
  }).join("");

  el.innerHTML = items + `<div class="summary">
    <div class="total"><span>Total</span><span>${rupiah(total)}</span></div>
    <button class="wa-btn" onclick="checkoutWhatsApp()">Pesan via WhatsApp</button>
  </div>`;
}

function checkoutWhatsApp(){
  const entries = Object.entries(cart);
  if(!entries.length) return;
  let total=0;
  let text="Halo OMBREW COFFEE 👋%0A%0ASaya mau pesan:%0A";
  entries.forEach(([id,qty])=>{
    const p=products.find(x=>x.id==id);
    total += p.price*qty;
    text += `• ${p.name} (${qty}x) - ${rupiah(p.price*qty)}%0A`;
  });
  text += `%0ATotal: ${rupiah(total)}%0A%0ANama:%0APickup / Delivery:%0ACatatan:`;
  // Ganti nomor di bawah dengan nomor WhatsApp OMBREW COFFEE.
  const phone = "6280000000000";
  window.open(`https://wa.me/${phone}?text=${text}`,"_blank");
}

function showPage(page){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach(x=>{
    x.classList.toggle("active",x.dataset.page===page);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}

function filterMenu(cat,btn){
  document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(cat);
}

renderFeatured();
renderMenu();
renderCart();
updateCount();
document.querySelector('[data-page="home"]').classList.add("active");
