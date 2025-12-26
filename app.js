const app = document.getElementById("app");

let data;
let order = {
  items: [],
  payment: "Наличные",
  comment: ""
};

fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    showCategories();
  });

function showCategories() {
  app.innerHTML = "";
  data.categories.forEach(cat => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerText = cat.title;
    d.onclick = () => showItems(cat);
    app.appendChild(d);
  });
}

function showItems(category) {
  app.innerHTML = `<h2>${category.title}</h2>`;

  category.items.forEach(item => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <b>${item.name}</b><br><br>
      <button onclick="add('${item.name}')">➕</button>
      <span class="qty" id="q-${item.id}">0</span>
      <button onclick="remove('${item.name}', '${item.id}')">➖</button>
    `;
    app.appendChild(d);
  });

  const btn = document.createElement("button");
  btn.innerText = "✅ Оформить заказ";
  btn.onclick = checkout;
  app.appendChild(btn);
}

function add(name) {
  let i = order.items.find(x => x.name === name);
  if (!i) {
    i = { name, qty: 0 };
    order.items.push(i);
  }
  i.qty++;
  update();
}

function remove(name, id) {
  let i = order.items.find(x => x.name === name);
  if (!i) return;
  i.qty--;
  if (i.qty <= 0)
    order.items = order.items.filter(x => x.name !== name);
  update();
}

function update() {
  document.querySelectorAll(".qty").forEach(q => q.innerText = "0");
  order.items.forEach(i => {
    const el = document.querySelector(`[id^="q"]`);
    if (el) el.innerText = i.qty;
  });
}

function checkout() {
  if (!order.items.length) {
    alert("Выберите товар");
    return;
  }

  app.innerHTML = `
    <h2>🧾 Подтверждение</h2>
    ${order.items.map(i =>
      `<div class="card">${i.name} — ${i.qty}</div>`
    ).join("")}

    <div class="card">
      💳 Оплата
      <select id="pay">
        <option>Наличные</option>
        <option>Перевод</option>
      </select>
    </div>

    <div class="card">
      📝 Комментарий
      <input id="comment" placeholder="Без звонка">
    </div>

    <button onclick="confirm()">📩 Подтвердить заказ</button>
  `;
}

function confirm() {
  order.payment = document.getElementById("pay").value;
  order.comment = document.getElementById("comment").value;

  Telegram.WebApp.sendData(JSON.stringify(order));
}
