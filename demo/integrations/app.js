const bindingKey = "rooster-next-robot-bound";
const modal = document.querySelector("#bind-modal");
const status = document.querySelector("#bind-status");
const openBind = document.querySelector("#open-bind");
function isBound() { try { return localStorage.getItem(bindingKey) === "true"; } catch { return false; } }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); window.setTimeout(() => el.classList.remove("show"), 2400); }
function render() { const bound = isBound(); status.textContent = bound ? "已绑定" : "未绑定"; status.classList.toggle("bound", bound); openBind.textContent = bound ? "解绑" : "绑定"; }
openBind.addEventListener("click", () => { if (isBound()) { try { localStorage.removeItem(bindingKey); } catch {} render(); toast("Next Robot 已解绑"); return; } modal.hidden = false; });
document.querySelector("#close-bind").addEventListener("click", () => { modal.hidden = true; });
document.querySelector("#cancel-bind").addEventListener("click", () => { modal.hidden = true; });
document.querySelector("#bind-form").addEventListener("submit", (event) => { event.preventDefault(); try { localStorage.setItem(bindingKey, "true"); } catch {} modal.hidden = true; render(); toast("Next Robot 已绑定"); });
render();
