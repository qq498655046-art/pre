# Rooster POS · 备菜原型

打开 `index.html`，默认进入“1. 第三方系统绑定”预览；左侧依次提供第三方系统绑定、菜单渠道设置与备菜功能，并可查看产品说明、功能清单和视频解说。

预览壳与运行版 Demo 均固定为 1280 × 800 的平板设计比例；当可用空间不足时会等比缩小显示，避免出现滚动条。

需求目的：满足 tigawok 自选快餐场景，支持一个商品同时关联 POS 与“内部备菜”菜单渠道；餐厅提前备菜，顾客再自选菜品销售；同时打通 Next Robot 机器人炒菜系统，支撑按实际份数备菜与可售库存管理。

当前原型的应用端为 POS，包含第三方系统绑定、菜单渠道设置、商品管理与备菜功能四个可运行 Demo。日常备菜只显示关联“内部备菜”渠道的菜单；员工输入实际备菜份数并发送到 Next Robot。POS 不同步菜品、不维护菜品 Mapping；机器人侧完成匹配。发送成功后，系统立即增加对应销售菜单品的 Count，不展示或追踪下游厨房的制作、出餐状态。

新增菜单时可同时选择 POS、Online Order 等菜单渠道和“内部备菜”渠道。商品编辑页中，只有关联内部备菜菜单的商品才显示并可启用“发送到 Next Robot”开关；菜单列表支持按名称搜索、勾选全选、批量删除与单项编辑。Next Robot 在“第三方应用集成 → 厨房系统”使用 App ID 与 Secret 绑定成功后即可使用；菜品同步与菜品 Mapping 均由 Next Robot 侧维护，POS 不显示相关操作。

`demo/assets/rooster-home-reference.png` 与 `demo/assets/pos-order-reference.png` 为用户提供的 Rooster 首页、点餐页原始截图，Demo 直接复用为视觉底稿；其余页面为 Rooster 风格的备菜交互演示。

`assets/nextrobot.mp4` 为「视频解说」页面内嵌播放的视频文件，已复制至原型目录，不依赖外部路径。

## 审核评论与 Cloudflare 部署

原型右上角有「评论」与「查看评论」入口。点击「评论」后先保存评论人名称，再进入标注模式；在原型页面任意位置点击即可添加带位置标记的评论。「查看评论」显示所有页面的评论及数量，点击一条评论会自动跳转到对应页面；评论支持回复与标记已解决。直接打开本地文件时，评论会暂存于当前浏览器；部署至 Cloudflare Pages 后，将由 Pages Functions 与 D1 数据库保存共享评论。

1. 在 Cloudflare 创建 D1 数据库：`rooster-pos-prep-comments`。
2. 执行 `wrangler d1 execute rooster-pos-prep-comments --remote --file=./schema.sql` 初始化评论表。
3. 将创建后的 D1 Database ID 填入 `wrangler.toml` 的 `database_id`。
4. 在 Cloudflare Pages 连接 GitHub 仓库 `qq498655046-art/pre`，生产分支选 `main`，构建命令留空，输出目录填 `.`。
5. Pages 将自动识别 `functions/api/comments.js`，评论接口为 `/api/comments`。
