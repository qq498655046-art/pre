const menuItems = [
  { id: "pork-rice", name: "猪脚饭", count: 8, category: "主食" },
  { id: "kungpao-rice", name: "宫保鸡丁饭", count: 12, category: "热菜" },
  { id: "egg-rice", name: "番茄炒蛋饭", count: 6, category: "素菜" },
  { id: "mushroom-chicken", name: "香菇鸡饭", count: 10, category: "主食" },
  { id: "fish-pork", name: "鱼香肉丝饭", count: 9, category: "热菜" },
  { id: "mapo-tofu", name: "麻婆豆腐饭", count: 14, category: "素菜" },
  { id: "curry-chicken", name: "咖喱鸡饭", count: 11, category: "热菜" },
  { id: "broccoli-beef", name: "西兰花牛肉饭", count: 7, category: "热菜" },
];

const categories = ["全部", "主食", "热菜", "素菜"];
const prepOrder = new Map();
let activeCategory = "全部";
let activePrepItemId = null;
let toastTimer;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  document.querySelector(`#${id}`).classList.add("active");
}

function filteredMenuItems() {
  return activeCategory === "全部" ? menuItems : menuItems.filter((item) => item.category === activeCategory);
}

function renderPrepMenu() {
  document.querySelector("#prep-category-grid").innerHTML = categories.map((category) => `<button class="prep-category ${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`).join("");
  document.querySelector("#prep-menu-grid").innerHTML = filteredMenuItems().map((item) => {
    const quantity = prepOrder.get(item.id) || 0;
    return `<button class="prep-dish ${quantity ? "selected" : ""}" data-dish="${item.id}"><strong>${item.name}</strong></button>`;
  }).join("");
}

function renderPrepCart() {
  const entries = Array.from(prepOrder.entries());
  const list = document.querySelector("#prep-cart-list");
  list.innerHTML = entries.length ? entries.map(([id, quantity]) => {
    const item = menuItems.find((candidate) => candidate.id === id);
    return `<article class="prep-cart-item ${activePrepItemId === id ? "active" : ""}" data-select-line="${id}"><b class="cart-quantity">${quantity}</b><div class="cart-item-main"><strong>${item.name}</strong></div></article>`;
  }).join("") : `<div class="prep-cart-empty"><b>请选择需要备菜的菜品</b><span>在右侧内部备菜菜单中点击菜品</span></div>`;
  document.querySelector("#selected-count").textContent = `${entries.length} 项`;
  document.querySelector("#send-kitchen").disabled = !entries.length;
  renderActionRail();
}

function renderActionRail() {
  const rail = document.querySelector("#prep-action-rail");
  const action = (key, icon, label, tone = "") => `<button class="rail-action ${tone}" data-rail-action="${key}"><b>${icon}</b><span>${label}</span></button>`;
  rail.innerHTML = activePrepItemId ? [
    action("increase", "+", "加", "rail-add"),
    action("quantity", "▣", "数量"),
    action("decrease", "−", "减", "rail-reduce"),
    action("note", "✎", "备注"),
    action("print", "▤", "打单"),
    action("delete", "×", "删除", "rail-delete"),
  ].join("") : [action("note", "✎", "备注"), action("print", "▤", "打单")].join("");
}

function renderPrep() {
  renderPrepMenu();
  renderPrepCart();
}

function showToast(message) {
  const toast = document.querySelector("#prep-toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addDish(id) {
  prepOrder.set(id, (prepOrder.get(id) || 0) + 1);
  activePrepItemId = id;
  renderPrep();
}

function adjustDish(id, amount) {
  const next = (prepOrder.get(id) || 0) + amount;
  if (next > 0) prepOrder.set(id, next); else prepOrder.delete(id);
  activePrepItemId = prepOrder.has(id) ? id : Array.from(prepOrder.keys()).at(-1) || null;
  renderPrep();
}

function sendToKitchen() {
  if (!prepOrder.size) return;
  prepOrder.forEach((quantity, id) => {
    const item = menuItems.find((candidate) => candidate.id === id);
    item.count += quantity;
  });
  prepOrder.clear();
  activePrepItemId = null;
  renderPrep();
  showToast("已发送到 Next Robot");
}

document.querySelector("#open-prep").addEventListener("click", () => { renderPrep(); showScreen("prep"); });
document.querySelector("#open-order").addEventListener("click", () => showScreen("order"));
document.querySelector("#close-order").addEventListener("click", () => showScreen("home"));
document.querySelector("#back-home").addEventListener("click", () => showScreen("home"));
document.querySelector("#prep-category-grid").addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (!button) return; activeCategory = button.dataset.category; renderPrepMenu(); });
document.querySelector("#prep-menu-grid").addEventListener("click", (event) => { const button = event.target.closest("[data-dish]"); if (button) addDish(button.dataset.dish); });
document.querySelector("#prep-cart-list").addEventListener("click", (event) => { const row = event.target.closest("[data-select-line]"); if (row) { activePrepItemId = row.dataset.selectLine; renderPrepCart(); } });
document.querySelector("#prep-action-rail").addEventListener("click", (event) => { const button = event.target.closest("[data-rail-action]"); if (!button) return; const action = button.dataset.railAction; if (action === "increase" && activePrepItemId) adjustDish(activePrepItemId, 1); if (action === "decrease" && activePrepItemId) adjustDish(activePrepItemId, -1); if (action === "delete" && activePrepItemId) { prepOrder.delete(activePrepItemId); activePrepItemId = Array.from(prepOrder.keys()).at(-1) || null; renderPrep(); } });
document.querySelector("#send-kitchen").addEventListener("click", sendToKitchen);
renderPrep();
