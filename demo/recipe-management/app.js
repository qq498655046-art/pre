const storageKey = "rooster-next-robot-bound";
const rows = document.querySelector("#recipe-rows");
const listPage = document.querySelector("#recipe-list-page");
const editor = document.querySelector("#recipe-editor");
const pageTitle = document.querySelector("#page-title");
const returnPos = document.querySelector("#return-pos");
const headerSave = document.querySelector("#header-save");
const menus = [
  { id: "pork-rice", name: "猪脚饭", enName: "Braised Pork Rice", posEnName: "Braised Pork Rice", posZhName: "猪脚饭", enabled: true, channels: ["POS", "内部备菜"], sendRobot: true },
  { id: "kungpao-rice", name: "宫保鸡丁饭", enName: "Kung Pao Chicken Rice", posEnName: "Kung Pao Chicken Rice", posZhName: "宫保鸡丁饭", enabled: true, channels: ["POS", "内部备菜"], sendRobot: true },
  { id: "egg-rice", name: "番茄炒蛋饭", enName: "Tomato Egg Rice", posEnName: "Tomato Egg Rice", posZhName: "番茄炒蛋饭", enabled: true, channels: ["POS", "内部备菜"], sendRobot: true },
  { id: "mushroom-chicken", name: "香菇鸡饭", enName: "Mushroom Chicken Rice", posEnName: "Mushroom Chicken Rice", posZhName: "香菇鸡饭", enabled: true, channels: ["POS"], sendRobot: false },
];
let selectedMenuIds = new Set();
let editingMenuId = null;
let menuChannels = new Set(["POS"]);
const products = [
  { id: "pork-rice", name: "猪脚饭", menu: "猪脚饭", internalPrep: true, sendRobot: true, price: "12.95" },
  { id: "kungpao-rice", name: "宫保鸡丁饭", menu: "宫保鸡丁饭", internalPrep: true, sendRobot: true, price: "11.95" },
  { id: "mushroom-chicken", name: "香菇鸡饭", menu: "香菇鸡饭", internalPrep: false, sendRobot: false, price: "10.95" },
];
let editingProductId = null;
function isRobotBound() { const params = new URLSearchParams(location.search); if (params.get("bound") === "1") return true; try { return localStorage.getItem(storageKey) === "true"; } catch { return false; } }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); window.setTimeout(() => el.classList.remove("show"), 2400); }
function channelTag(channel) { return `<span class="tag ${channel === "内部备菜" ? "robot" : ""}">${channel}</span>`; }
function renderRows() {
  const term = document.querySelector("#recipe-search").value.trim(); const visible = menus.filter((menu) => menu.name.includes(term));
  const allSelected = visible.length > 0 && visible.every((menu) => selectedMenuIds.has(menu.id)); const selectAll = document.querySelector("#select-all-recipes");
  selectAll.classList.toggle("checked", allSelected); selectAll.setAttribute("aria-checked", String(allSelected)); document.querySelector("#delete-recipes").disabled = selectedMenuIds.size === 0;
  rows.innerHTML = visible.length ? visible.map((menu) => `<article class="recipe-row ${selectedMenuIds.has(menu.id) ? "selected" : ""}"><button class="list-check ${selectedMenuIds.has(menu.id) ? "checked" : ""}" type="button" data-select-menu="${menu.id}" role="checkbox" aria-checked="${selectedMenuIds.has(menu.id)}" aria-label="选择 ${menu.name}"></button><b>${menu.name}</b><div class="channel-tags">${menu.channels.map(channelTag).join("")}</div><span class="status-switch" aria-label="已启用"></span><button class="edit-link" type="button" data-edit-menu="${menu.id}" aria-label="编辑 ${menu.name}">✎</button></article>`).join("") : `<div class="recipe-empty">未找到匹配的菜单</div>`;
}
function renderProductRows() { const term = document.querySelector("#product-search").value.trim(); const visible = products.filter((product) => product.name.includes(term)); document.querySelector("#product-rows").innerHTML = visible.length ? visible.map((product) => `<article class="product-row"><b>${product.name}</b><span>${product.menu}</span><span>${product.internalPrep ? (product.sendRobot ? "已启用" : "未启用") : "--"}</span><span class="status-switch"></span><button class="edit-link" type="button" data-edit-product="${product.id}" aria-label="编辑 ${product.name}">✎</button></article>`).join("") : `<div class="recipe-empty">未找到匹配的商品</div>`; }
function updateHeader(view) { const editing = view === "menu-editor" || view === "product-editor"; pageTitle.textContent = view === "menu-editor" ? (editingMenuId ? "编辑菜单" : "新增菜单") : view === "product-editor" ? (editingProductId ? "编辑商品" : "新增商品") : view === "products" ? "商品" : "菜单"; returnPos.hidden = editing; document.querySelector("#back-list").hidden = !editing; headerSave.hidden = !editing; headerSave.setAttribute("form", view === "product-editor" ? "product-form" : "recipe-form"); }
function renderMenuChannels() { document.querySelectorAll("[data-menu-channel]").forEach((card) => { const selected = menuChannels.has(card.dataset.menuChannel); card.classList.toggle("selected", selected); card.setAttribute("aria-pressed", String(selected)); }); }
function showEditor(menuId = null) {
  const menu = menus.find((item) => item.id === menuId); editingMenuId = menu?.id || null; menuChannels = new Set(menu?.channels || ["POS"]);
  document.querySelector("#menu-name-en").value = menu?.enName || ""; document.querySelector("#recipe-name").value = menu?.name || ""; document.querySelector("#pos-name-en").value = menu?.posEnName || ""; document.querySelector("#pos-name-zh").value = menu?.posZhName || ""; document.querySelector("#menu-enabled").checked = menu?.enabled ?? true; document.querySelector("#form-message").textContent = ""; renderMenuChannels(); listPage.hidden = true; document.querySelector("#product-list-page").hidden = true; document.querySelector("#product-editor").hidden = true; editor.hidden = false; updateHeader("menu-editor");
}
function showList() { editor.hidden = true; document.querySelector("#product-editor").hidden = true; document.querySelector("#product-list-page").hidden = true; listPage.hidden = false; updateHeader("menus"); }
function showProducts() { editor.hidden = true; document.querySelector("#product-editor").hidden = true; listPage.hidden = true; document.querySelector("#product-list-page").hidden = false; renderProductRows(); updateHeader("products"); }
function showProductEditor(productId = null) { const product = products.find((item) => item.id === productId); editingProductId = product?.id || null; document.querySelector("#product-name-en").value = product?.name || ""; document.querySelector("#product-name-zh").value = product?.name || ""; document.querySelector("#kitchen-name-en").value = product?.name || ""; document.querySelector("#kitchen-name-zh").value = product?.name || ""; document.querySelector("#product-pos-en").value = product?.name || ""; document.querySelector("#product-pos-zh").value = product?.name || ""; document.querySelector("#product-price").value = product?.price || ""; document.querySelector("#product-enabled").checked = true; const robotOption = document.querySelector("#product-robot-option"); const showRobot = Boolean(product?.internalPrep) && isRobotBound(); robotOption.hidden = !showRobot; document.querySelector("#product-robot-enabled").checked = Boolean(product?.sendRobot); document.querySelector("#product-message").textContent = product?.internalPrep ? "" : "该商品关联的菜单未启用“内部备菜”，不可发送到 Next Robot。"; listPage.hidden = true; document.querySelector("#product-list-page").hidden = true; editor.hidden = true; document.querySelector("#product-editor").hidden = false; updateHeader("product-editor"); }
document.querySelector("#open-editor").addEventListener("click", () => showEditor());
document.querySelector("#back-list").addEventListener("click", () => document.querySelector("#product-editor").hidden ? showList() : showProducts());
document.querySelector("#open-products").addEventListener("click", showProducts);
document.querySelector("#open-product-editor").addEventListener("click", () => showProductEditor());
document.querySelector("#product-search").addEventListener("input", renderProductRows);
document.querySelector("#product-rows").addEventListener("click", (event) => { const edit = event.target.closest("[data-edit-product]"); if (edit) showProductEditor(edit.dataset.editProduct); });
document.querySelector("#recipe-search").addEventListener("input", renderRows);
document.querySelector("#recipe-rows").addEventListener("click", (event) => { const edit = event.target.closest("[data-edit-menu]"); if (edit) { showEditor(edit.dataset.editMenu); return; } const check = event.target.closest("[data-select-menu]"); if (!check) return; const id = check.dataset.selectMenu; selectedMenuIds.has(id) ? selectedMenuIds.delete(id) : selectedMenuIds.add(id); renderRows(); });
document.querySelector("#select-all-recipes").addEventListener("click", () => { const term = document.querySelector("#recipe-search").value.trim(); const ids = menus.filter((menu) => menu.name.includes(term)).map((menu) => menu.id); const allSelected = ids.length > 0 && ids.every((id) => selectedMenuIds.has(id)); ids.forEach((id) => allSelected ? selectedMenuIds.delete(id) : selectedMenuIds.add(id)); renderRows(); });
document.querySelector("#delete-recipes").addEventListener("click", () => { for (let i = menus.length - 1; i >= 0; i -= 1) if (selectedMenuIds.has(menus[i].id)) menus.splice(i, 1); selectedMenuIds = new Set(); renderRows(); toast("已删除所选菜单"); });
document.querySelectorAll("[data-menu-channel]").forEach((card) => card.addEventListener("click", () => { const channel = card.dataset.menuChannel; menuChannels.has(channel) ? menuChannels.delete(channel) : menuChannels.add(channel); renderMenuChannels(); }));
document.querySelector("#recipe-form").addEventListener("submit", (event) => { event.preventDefault(); const payload = { id: editingMenuId || `menu-${Date.now()}`, name: document.querySelector("#recipe-name").value.trim(), enName: document.querySelector("#menu-name-en").value.trim(), posEnName: document.querySelector("#pos-name-en").value.trim(), posZhName: document.querySelector("#pos-name-zh").value.trim(), enabled: document.querySelector("#menu-enabled").checked, channels: [...menuChannels], sendRobot: false }; const index = menus.findIndex((menu) => menu.id === editingMenuId); if (index >= 0) menus.splice(index, 1, payload); else menus.unshift(payload); editingMenuId = null; renderRows(); showList(); toast("菜单已保存"); });
document.querySelector("#product-form").addEventListener("submit", (event) => { event.preventDefault(); const product = products.find((item) => item.id === editingProductId); if (product) { product.name = document.querySelector("#product-name-zh").value.trim(); product.price = document.querySelector("#product-price").value.trim(); product.sendRobot = product.internalPrep && isRobotBound() && document.querySelector("#product-robot-enabled").checked; } renderProductRows(); editingProductId = null; showProducts(); toast("商品已保存"); });
renderRows();
