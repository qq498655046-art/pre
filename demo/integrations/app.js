const bindingKey = "rooster-next-robot-bound";
const syncKey = "rooster-next-robot-catalog-synced";
const modal = document.querySelector("#bind-modal");
const status = document.querySelector("#bind-status");
const openBind = document.querySelector("#open-bind");
const syncCatalog = document.querySelector("#sync-catalog");
function isBound() { try { return localStorage.getItem(bindingKey) === "true"; } catch { return false; } }
function isSynced() { try { return localStorage.getItem(syncKey) === "true"; } catch { return false; } }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); window.setTimeout(() => el.classList.remove("show"), 2400); }
function render() { const bound = isBound(); const synced = isSynced(); status.textContent = bound ? "已绑定" : "未绑定"; status.classList.toggle("bound", bound); openBind.textContent = bound ? "解绑" : "绑定"; syncCatalog.hidden = !bound; syncCatalog.textContent = synced ? "重新同步菜品" : "同步菜品"; }
openBind.addEventListener("click", () => { if (isBound()) { try { localStorage.removeItem(bindingKey); localStorage.removeItem(syncKey); } catch {} render(); toast("Next Robot 已解绑"); return; } modal.hidden = false; });
document.querySelector("#close-bind").addEventListener("click", () => { modal.hidden = true; });
document.querySelector("#cancel-bind").addEventListener("click", () => { modal.hidden = true; });
document.querySelector("#bind-form").addEventListener("submit", (event) => { event.preventDefault(); try { localStorage.setItem(bindingKey, "true"); localStorage.removeItem(syncKey); } catch {} modal.hidden = true; render(); toast("Next Robot 已绑定，请继续同步菜品"); });
syncCatalog.addEventListener("click", () => { try { localStorage.setItem(syncKey, "true"); } catch {} render(); toast("已同步 18 个菜品与 2 台设备"); });
render();
