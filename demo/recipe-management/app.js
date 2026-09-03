const storageKey = "rooster-next-robot-bound";
const rows = document.querySelector("#recipe-rows");
const listPage = document.querySelector("#recipe-list-page");
const editor = document.querySelector("#recipe-editor");
const pageTitle = document.querySelector("#page-title");
const returnPos = document.querySelector("#return-pos");
const headerSave = document.querySelector("#header-save");
const productModal = document.querySelector("#product-modal");
const products = ["猪脚饭", "宫保鸡丁饭", "番茄炒蛋饭", "香菇鸡饭", "鱼香肉丝饭", "咖喱鸡饭"];
const productPrices = { "猪脚饭": "$12.95", "宫保鸡丁饭": "$13.50", "番茄炒蛋饭": "$11.95", "香菇鸡饭": "$12.95", "鱼香肉丝饭": "$12.95", "咖喱鸡饭": "$13.50" };
const recipes = [
  { id: "braised-pork", name: "猪脚饭预制", item: "猪脚饭", portions: 20, channels: ["KDS"] },
  { id: "kungpao-chicken", name: "宫保鸡丁预制", item: "宫保鸡丁饭", portions: 15, channels: ["厨房打印机"] },
];
let selectedProduct = null;
let highlightedProduct = null;
let deliveryRoutes = { kds: "", printer: "", robot: false };
let selectedRecipeIds = new Set();
let editingRecipeId = null;
function isRobotBound() { const params = new URLSearchParams(location.search); if (params.get("bound") === "1") return true; try { return localStorage.getItem(storageKey) === "true"; } catch { return false; } }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); window.setTimeout(() => el.classList.remove("show"), 2400); }
function channelTag(channel) { return `<span class="tag ${channel === "Next Robot" ? "robot" : ""}">${channel}</span>`; }
function renderRows() {
  const searchTerm = document.querySelector("#recipe-search").value.trim();
  const visibleRecipes = recipes.filter((recipe) => recipe.name.includes(searchTerm));
  const allVisibleSelected = visibleRecipes.length > 0 && visibleRecipes.every((recipe) => selectedRecipeIds.has(recipe.id));
  const selectAll = document.querySelector("#select-all-recipes");
  selectAll.classList.toggle("checked", allVisibleSelected);
  selectAll.setAttribute("aria-checked", String(allVisibleSelected));
  const deleteButton = document.querySelector("#delete-recipes");
  deleteButton.disabled = selectedRecipeIds.size === 0;
  rows.innerHTML = visibleRecipes.length ? visibleRecipes.map((recipe) => `<article class="recipe-row ${selectedRecipeIds.has(recipe.id) ? "selected" : ""}"><button class="list-check ${selectedRecipeIds.has(recipe.id) ? "checked" : ""}" type="button" data-select-recipe="${recipe.id}" role="checkbox" aria-checked="${selectedRecipeIds.has(recipe.id)}" aria-label="选择 ${recipe.name}"></button><b>${recipe.name}</b><span>${recipe.item}</span><span>1 批 = ${recipe.portions} 份</span><div class="channel-tags">${recipe.channels.map(channelTag).join("")}</div><span class="status-switch" aria-label="已启用"></span><button class="edit-link" type="button" data-edit-recipe="${recipe.id}" aria-label="编辑 ${recipe.name}">✎</button></article>`).join("") : `<div class="recipe-empty">未找到匹配的备菜配方</div>`;
}
function updateHeader(editing) { pageTitle.textContent = editing ? (editingRecipeId ? "编辑备菜配方" : "新增备菜配方") : "备菜"; returnPos.hidden = editing; document.querySelector("#back-list").hidden = !editing; headerSave.hidden = !editing; }
function renderDeliveryRoutes() { document.querySelectorAll("[data-route-group]").forEach((card) => { const selected = deliveryRoutes[card.dataset.routeGroup] === card.dataset.routeValue; card.classList.toggle("selected", selected); card.setAttribute("aria-pressed", String(selected)); }); document.querySelector("#robot-enabled").checked = deliveryRoutes.robot; }
function renderAssociatedProduct() { const row = document.querySelector("#associated-product-row"); row.innerHTML = selectedProduct ? `<div class="associated-product-item"><span class="row-check">□</span><span class="row-handle">＝</span><b>${selectedProduct}</b><span>${productPrices[selectedProduct] || "--"}</span><button id="edit-associated-product" type="button" aria-label="修改关联商品">✎</button></div>` : `<div class="associated-products-empty">请点击「新增」选择一个关联商品</div>`; }
function showEditor(recipeId = null) { const bound = isRobotBound(); const recipe = recipes.find((item) => item.id === recipeId); editingRecipeId = recipe?.id || null; document.querySelector("#robot-option").classList.toggle("hidden", !bound); document.querySelector("#robot-hint").hidden = bound; deliveryRoutes = { kds: recipe?.channels.includes("KDS") ? "热厨工位" : "", printer: recipe?.channels.includes("厨房打印机") ? "热厨出单机" : "", robot: Boolean(recipe?.channels.includes("Next Robot")) }; renderDeliveryRoutes(); document.querySelector("#form-message").textContent = ""; document.querySelector("#recipe-name").value = recipe?.name || ""; document.querySelector("#batch-size").value = recipe?.portions || 20; selectedProduct = recipe?.item || null; highlightedProduct = null; renderAssociatedProduct(); listPage.hidden = true; editor.hidden = false; updateHeader(true); }
function showList() { productModal.hidden = true; editor.hidden = true; listPage.hidden = false; updateHeader(false); }
function filteredProducts() { const term = document.querySelector("#product-search").value.trim().toLowerCase(); return products.filter((product) => product.includes(term)); }
function renderProductPicker() { const available = filteredProducts().filter((product) => product !== selectedProduct); document.querySelector("#available-products").innerHTML = available.length ? available.map((product) => `<button class="product-row ${highlightedProduct === product ? "active" : ""}" data-product="${product}" aria-label="选择商品 ${product}"><span>${highlightedProduct === product ? "✓" : ""}</span><b>${product}</b><em>销售商品</em></button>`).join("") : `<p class="empty-products">无匹配商品</p>`; document.querySelector("#chosen-product").innerHTML = selectedProduct ? `<button class="product-row active" data-chosen="${selectedProduct}" aria-label="已选商品 ${selectedProduct}"><span>✓</span><b>${selectedProduct}</b><em>销售商品</em></button>` : `<p class="empty-products">请选择一个商品</p>`; document.querySelector("#move-to-selected").disabled = !highlightedProduct; document.querySelector("#move-to-available").disabled = !selectedProduct; }
function openProductPicker() { highlightedProduct = selectedProduct; document.querySelector("#product-search").value = ""; renderProductPicker(); productModal.hidden = false; }
function closeProductPicker() { productModal.hidden = true; }
document.querySelector("#open-editor").addEventListener("click", showEditor);
document.querySelector("#recipe-search").addEventListener("input", renderRows);
document.querySelector("#recipe-rows").addEventListener("click", (event) => { const edit = event.target.closest("[data-edit-recipe]"); if (edit) { showEditor(edit.dataset.editRecipe); return; } const check = event.target.closest("[data-select-recipe]"); if (!check) return; const id = check.dataset.selectRecipe; selectedRecipeIds.has(id) ? selectedRecipeIds.delete(id) : selectedRecipeIds.add(id); renderRows(); });
document.querySelector("#select-all-recipes").addEventListener("click", () => { const term = document.querySelector("#recipe-search").value.trim(); const visibleIds = recipes.filter((recipe) => recipe.name.includes(term)).map((recipe) => recipe.id); const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRecipeIds.has(id)); visibleIds.forEach((id) => allSelected ? selectedRecipeIds.delete(id) : selectedRecipeIds.add(id)); renderRows(); });
document.querySelector("#delete-recipes").addEventListener("click", () => { for (let index = recipes.length - 1; index >= 0; index -= 1) { if (selectedRecipeIds.has(recipes[index].id)) recipes.splice(index, 1); } selectedRecipeIds = new Set(); renderRows(); });
document.querySelector("#back-list").addEventListener("click", showList);
document.querySelector("#open-product-picker").addEventListener("click", openProductPicker);
document.querySelector("#close-product-picker").addEventListener("click", closeProductPicker);
document.querySelector("#cancel-product-picker").addEventListener("click", closeProductPicker);
document.querySelector("#product-search").addEventListener("input", renderProductPicker);
document.querySelector("#available-products").addEventListener("click", (event) => { const row = event.target.closest("[data-product]"); if (!row) return; highlightedProduct = row.dataset.product; renderProductPicker(); });
document.querySelector("#move-to-selected").addEventListener("click", () => { if (!highlightedProduct) return; selectedProduct = highlightedProduct; highlightedProduct = null; renderProductPicker(); });
document.querySelector("#move-to-available").addEventListener("click", () => { selectedProduct = null; highlightedProduct = null; renderProductPicker(); });
document.querySelector("#chosen-product").addEventListener("click", () => { selectedProduct = null; highlightedProduct = null; renderProductPicker(); });
document.querySelector("#confirm-product-picker").addEventListener("click", () => { if (!selectedProduct) return; renderAssociatedProduct(); closeProductPicker(); });
document.querySelector("#associated-product-row").addEventListener("click", (event) => { if (event.target.closest("#edit-associated-product")) openProductPicker(); });
document.querySelector("#delivery-fields").addEventListener("click", (event) => { const card = event.target.closest("[data-route-group]"); if (!card) return; const group = card.dataset.routeGroup; deliveryRoutes[group] = deliveryRoutes[group] === card.dataset.routeValue ? "" : card.dataset.routeValue; renderDeliveryRoutes(); });
document.querySelector("#robot-enabled").addEventListener("change", (event) => { deliveryRoutes.robot = event.target.checked; });
document.querySelector("#recipe-form").addEventListener("submit", (event) => { event.preventDefault(); const channels = [deliveryRoutes.kds && "KDS", deliveryRoutes.printer && "厨房打印机", deliveryRoutes.robot && "Next Robot"].filter(Boolean); if (!selectedProduct) { document.querySelector("#form-message").textContent = "请选择关联商品。"; return; } if (!channels.length) { document.querySelector("#form-message").textContent = "请至少选择一种送厨方式。"; return; } const payload = { id: editingRecipeId || `recipe-${Date.now()}`, name: document.querySelector("#recipe-name").value, item: selectedProduct, portions: document.querySelector("#batch-size").value, channels }; const index = recipes.findIndex((recipe) => recipe.id === editingRecipeId); if (index >= 0) recipes.splice(index, 1, payload); else recipes.unshift(payload); editingRecipeId = null; renderRows(); showList(); toast("备菜配方已保存并启用"); });
renderRows();
