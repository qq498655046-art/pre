const menuItems = [
  { id: "pork-rice", name: "猪脚饭", count: 8, soldToday: 32, unit: "份", station: "保温台" },
  { id: "kungpao-rice", name: "宫保鸡丁饭", count: 12, soldToday: 21, unit: "份", station: "保温台" },
  { id: "egg-rice", name: "番茄炒蛋饭", count: 6, soldToday: 17, unit: "份", station: "保温台" },
  { id: "mushroom-chicken", name: "香菇鸡饭", count: 10, soldToday: 15, unit: "份", station: "保温台" },
  { id: "fish-pork", name: "鱼香肉丝饭", count: 9, soldToday: 23, unit: "份", station: "保温台" },
  { id: "mapo-tofu", name: "麻婆豆腐饭", count: 14, soldToday: 12, unit: "份", station: "保温台" },
  { id: "curry-chicken", name: "咖喱鸡饭", count: 11, soldToday: 13, unit: "份", station: "保温台" },
  { id: "broccoli-beef", name: "西兰花牛肉饭", count: 7, soldToday: 19, unit: "份", station: "保温台" },
];
const prepRecipes = [
  { id: "braised-pork", name: "猪脚饭预制", batchUnit: "批", portionsPerBatch: 20, delivery: "KDS · 热厨工位", menuItemId: "pork-rice", glyph: "♨" },
  { id: "kungpao-chicken", name: "宫保鸡丁预制", batchUnit: "批", portionsPerBatch: 15, delivery: "厨房打印机 · 热厨出单机", menuItemId: "kungpao-rice", glyph: "◒" },
  { id: "tomato-egg", name: "番茄炒蛋预制", batchUnit: "批", portionsPerBatch: 18, delivery: "Next Robot · 炒菜机器人 #1", robotRecipe: "NR-126", menuItemId: "egg-rice", glyph: "◌" },
];
const selections = { "braised-pork": { selected: false, batches: 1 }, "kungpao-chicken": { selected: false, batches: 1 }, "tomato-egg": { selected: false, batches: 1 } };

function showScreen(id) { document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active")); document.querySelector(`#${id}`).classList.add("active"); }
function getMenuItem(id) { return menuItems.find((item) => item.id === id); }
function getSelection(id) { return selections[id]; }

function renderConsumption() {
  document.querySelector("#consumption-list").innerHTML = menuItems.map((item) => `<article class="consumption-card"><div class="dish-title"><h3>${item.name}</h3></div><div class="consumption-metrics"><div><span>今日已售</span><b>${item.soldToday} 份</b></div><div><span>当前可售</span><b>${item.count} 份</b></div></div></article>`).join("");
}

function renderPicker() {
  const selectedRecipes = prepRecipes.filter((recipe) => getSelection(recipe.id).selected);
  document.querySelector("#recipe-picker").innerHTML = prepRecipes.map((recipe) => {
    const selection = getSelection(recipe.id); const item = getMenuItem(recipe.menuItemId); const output = selection.batches * recipe.portionsPerBatch;
    return `<article class="picker-row ${selection.selected ? "selected" : ""}"><button class="recipe-check" data-select="${recipe.id}" role="checkbox" aria-checked="${selection.selected}" aria-label="选择 ${recipe.name}"><span>${selection.selected ? "✓" : ""}</span></button><div class="recipe-icon">${recipe.glyph}</div><div class="recipe-main"><div class="recipe-title"><h3>${recipe.name}</h3><span>${recipe.delivery}</span></div><p>${recipe.robotRecipe ? `Robot 菜谱 ${recipe.robotRecipe} · ` : ""}1 ${recipe.batchUnit} = <b>${recipe.portionsPerBatch} 份</b>可售</p><div class="recipe-meta"><span>当前 ${item.count} 份</span><span>送厨后 <b>+${output} 份</b></span></div></div><div class="batch-control"><span>备菜批次</span><div><button data-batch="-1" data-id="${recipe.id}" aria-label="减少 ${recipe.name} 批次">−</button><b>${selection.batches}</b><em>${recipe.batchUnit}</em><button data-batch="1" data-id="${recipe.id}" aria-label="增加 ${recipe.name} 批次">＋</button></div></div></article>`;
  }).join("");
  const total = selectedRecipes.reduce((sum, recipe) => sum + getSelection(recipe.id).batches * recipe.portionsPerBatch, 0);
  document.querySelector("#picker-summary").innerHTML = `<div><b>已选择 ${selectedRecipes.length} 个预制配方</b><span>送厨后增加 ${total} 份可售数量</span></div><button id="send-robot" class="save" ${selectedRecipes.length ? "" : "disabled"}>一键送厨</button>`;
}

function sendTasks() {
  const selectedRecipes = prepRecipes.filter((recipe) => getSelection(recipe.id).selected); if (!selectedRecipes.length) return;
  selectedRecipes.forEach((recipe) => { const selection = getSelection(recipe.id); getMenuItem(recipe.menuItemId).count += selection.batches * recipe.portionsPerBatch; selection.selected = false; });
  document.querySelector("#add-prep-modal").hidden = true; renderPicker(); renderConsumption();
}

document.querySelector("#open-prep").addEventListener("click", () => { renderConsumption(); showScreen("prep"); });
document.querySelector("#open-order").addEventListener("click", () => showScreen("order"));
document.querySelector("#close-order").addEventListener("click", () => showScreen("home"));
document.querySelector("#back-home").addEventListener("click", () => showScreen("home"));
document.querySelector("#refresh-consumption").addEventListener("click", renderConsumption);
document.querySelector("#open-add-prep").addEventListener("click", () => { renderPicker(); document.querySelector("#add-prep-modal").hidden = false; });
document.querySelector("#close-add-prep").addEventListener("click", () => { document.querySelector("#add-prep-modal").hidden = true; });
document.querySelector("#recipe-picker").addEventListener("click", (event) => { const selectButton = event.target.closest("[data-select]"); const batchButton = event.target.closest("[data-batch]"); if (selectButton) { const selection = getSelection(selectButton.dataset.select); selection.selected = !selection.selected; renderPicker(); return; } if (batchButton) { const selection = getSelection(batchButton.dataset.id); selection.selected = true; selection.batches = Math.max(1, selection.batches + Number(batchButton.dataset.batch)); renderPicker(); } });
document.querySelector("#picker-summary").addEventListener("click", (event) => { if (event.target.closest("#send-robot")) sendTasks(); });
renderConsumption(); renderPicker();
