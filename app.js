const FEATURES = [
  { group: "文档介绍", pages: [
    { id: "product", title: "产品说明", html: docPage("Rooster POS · 备菜", `本需求主要用于满足 tigawok 自选快餐场景。餐厅可根据实际销售需求，在售卖前提前备菜并完成出餐；顾客到店后可直接自选菜品并完成销售。<br><br>同时，本需求将打通 Next Robot 机器人炒菜系统，使备菜配方与送厨流程可对接机器人，支持标准化批次备菜和可售库存管理。`) },
    { id: "features", title: "功能清单", html: featureListPage() },
    { id: "video", title: "视频解说", html: videoPage() },
  ] },
  { group: "原型 Demo", pages: [
    { id: "kitchen-integration", title: "1. 第三方系统绑定", url: "./demo/integrations/index.html" },
    { id: "prep-recipes", title: "2. 备菜配方设置", url: "./demo/recipe-management/index.html" },
    { id: "daily-prep", title: "3. 备菜功能", url: "./demo/index.html" },
  ] },
];

const nav = document.querySelector("#feature-nav");
const frame = document.querySelector("#preview-frame");
const stage = document.querySelector("#device-stage");
let current = FEATURES.flatMap((group) => group.pages).find((page) => page.url) || FEATURES[0].pages[0];

function renderNav() { nav.innerHTML = FEATURES.map((group) => `<section class="nav-group"><div class="nav-group-title">${group.group}</div>${group.pages.map((page) => `<button class="nav-item ${page.id === current.id ? "active" : ""}" data-id="${page.id}">${page.title}</button>`).join("")}</section>`).join(""); }
function select(id) { current = FEATURES.flatMap((group) => group.pages).find((page) => page.id === id) || current; const group = FEATURES.find((item) => item.pages.includes(current)); document.querySelector("#crumb-group").textContent = group.group; document.querySelector("#crumb-page").textContent = current.title; if (current.html) { frame.src = "about:blank"; frame.srcdoc = current.html; } else { frame.removeAttribute("srcdoc"); frame.src = current.url; } renderNav(); }
function docPage(title, content) { return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{margin:0;padding:48px;max-width:960px;font:15px/1.8 system-ui,-apple-system,"PingFang SC",sans-serif;color:#243042;background:#fafbfc}h1{font-size:30px;line-height:1.3}p{color:#59677a}table{width:100%;border-collapse:collapse;margin:18px 0;background:#fff}th,td{padding:12px;border:1px solid #dfe5ec;text-align:left}th{background:#edf4ff}b{color:#174f91}</style><h1>${title}</h1><div>${content}</div></html>`; }
function videoPage() { return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{margin:0;padding:30px 40px;font:15px/1.6 system-ui,-apple-system,"PingFang SC",sans-serif;color:#243042;background:#fafbfc}h1{margin:0 0 8px;font-size:30px;line-height:1.3}.notice{margin:0 0 16px;color:#59677a}video{display:block;width:100%;max-height:510px;border-radius:10px;background:#111;box-shadow:0 8px 24px #17203a18}</style><h1>视频解说</h1><p class="notice">视频加载需要一定时间，请耐心等候……</p><video controls preload="metadata"><source src="./assets/nextrobot.mp4" type="video/mp4" />您的浏览器暂不支持视频播放。</video></html>`; }
function featureListPage() { return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{margin:0;padding:22px 24px;font:13px/1.4 system-ui,-apple-system,"PingFang SC",sans-serif;color:#2f456f;background:#fff}h1{margin:0 0 15px;font-size:23px;line-height:1.2;color:#2d426b}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{padding:10px;border:1px solid #bcc2cb;text-align:left;vertical-align:middle}th{background:#f1f1f2;color:#2d426b;font-size:14px;font-weight:800}.id{width:11%}.name{width:22%}.description{width:48%}.importance{width:11%}.jira{width:9%}.section td{padding:9px 10px;background:#fff;color:#2d426b;font-size:14px;font-weight:800}.must{font-weight:800;white-space:nowrap}.jira-cell{color:#8390a4;text-align:center}</style><h1>§4 功能清单（★必填）</h1><table><thead><tr><th class="id">Functional ID</th><th class="name">Functional Name</th><th class="description">Description</th><th class="importance">Importance</th><th class="jira">Jira Issue</th></tr></thead><tbody><tr class="section"><td colspan="5">应用端：POS</td></tr><tr><td>POS-1</td><td>第三方系统绑定</td><td>在 POS 的第三方应用集成中，使用 App ID 与 Secret 绑定 Next Robot，并通过独立按钮同步菜品数据。</td><td class="must">MUST HAVE</td><td class="jira-cell">—</td></tr><tr><td>POS-2</td><td>备菜配方设置</td><td>配置名称、关联商品、批次份数与送厨方式；支持搜索、编辑、勾选批量删除，Next Robot 仅在绑定后启用。</td><td class="must">MUST HAVE</td><td class="jira-cell">—</td></tr><tr><td>POS-3</td><td>备菜功能</td><td>在 POS 首页进入备菜，查看销售数量与可售数量，选择配方和批次后送厨，并按固定批次份数增加关联商品的可售 Count。</td><td class="must">MUST HAVE</td><td class="jira-cell">—</td></tr></tbody></table></html>`; }
nav.addEventListener("click", (event) => { const button = event.target.closest("[data-id]"); if (button) select(button.dataset.id); });
select(current.id);
