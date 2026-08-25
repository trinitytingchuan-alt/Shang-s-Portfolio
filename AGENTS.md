# AGENTS.md — workbuddy 作品集项目约定

> 本文件是本项目唯一的 AI 协作规范来源。所有改动（含 HTML/CSS/JS、文案、图片、本文件本身）都必须遵守以下流程与约束。改动前先读本文件。

---

## 0. 真相源与关键文件

| 文件 | 角色 | 说明 |
|---|---|---|
| `index.html` | **线上作品集（唯一真相源）** | 用户对外展示的作品集，所有"新增项目/修改展示"都改这里 |
| `css/style.css` | 样式 | 与 index.html 配套 |
| `js/main.js` | 交互 | 侧栏高亮、modal 翻页，靠 `data-modal`/`data-group` 自动工作 |
| `assets/` | 图片/PDF | `assets/ks/` 放快手项目图，`assets/pdf_hi/`、`assets/docx_images/`、`assets/portfolio_pngs/`、`assets/photo/` 为既有分组 |
| `_collection.html` | 印刷版 PDF 源（独立产物） | 由 index.html 派生，用于导出 PDF；**与 index.html 不同步是允许的**，改动需单独 git 基线 |

**强约束**：用户说的"作品集"默认指 `index.html`。不要把 `index.html` 的改动误写到 `_collection.html`，反之亦然。若不确定，先问。

---

## 1. 作品集结构（index.html）

页面由左侧 `aside.sidebar` 导航 + 右侧 `main` 内容组成。main 的顶层区块（section）编号：

1. Hero（封面）
2. About（关于）
3. Experience（经历时间线）
4—7. Works（作品集大区，内部含 4 个 `.stage`）
   - `4` Anker 产品设计（`#stage-anker`）
   - `5` 股票产品设计（`#stage-stock`）
   - `6` 独立项目（`#stage-project`）
   - `7` 快手广告投放（`#stage-kuaishou`）
8. Photography（摄影）
9. Interests（爱好）
10. Honors（荣誉）
11. Contact（联系）

**新增一个作品项目**的标准做法（扩展模式，不自创样式）：

1. 在 `index.html` 的 **Works 大区 `<section class="works" id="works">`** 内，找到对应 `.stage`，或新建一个 `.stage`（如快手）。
2. 每个项目用既有模块：
   ```html
   <article class="work work--image-led reveal" id="w-xxx">
     <div class="work__header">
       <div class="work__tag">分组 · 子类</div>
       <h4 class="work__title">项目标题</h4>
       <div class="work__sub">一句话说明 · 关键数据</div>
     </div>
     <figure class="work__hero" data-modal="assets/分组/图.png" data-alt="说明" data-group="xxx">
       <img src="assets/分组/图.png" alt="说明" loading="lazy" />
       <span class="work__zoom">…点击查看…</span>
     </figure>
   </article>
   ```
3. 同步更新：
   - 左侧 `sidebar__nav`（新增/调整 `sidebar__nav-item` 与 `sidebar__nav-num`，**后续编号顺延**）
   - Works 大区 header 的 `section__num`（如 `4—6` → `4—7`）
   - Works `section__lede` 文案按顺序枚举各 stage
4. **编号一致性铁律**：sidebar 顶层编号、section 编号、stage 编号三者必须连续且不重复。改一处必查全部。

---

## 2. 图片规范

- 新增图片放入对应的 `assets/<分组>/`，文件名用项目语义（中文或英文均可，但需与 `data-modal`/`src` 完全一致）。
- PDF 类素材用 PyMuPDF 渲染首页为 PNG（dpi 150 足够）：
  ```powershell
  & "C:\Users\Administrator\AppData\Local\Programs\Python\Python312\python.exe" -c "
  import fitz
  doc=fitz.open('源.pdf'); doc[0].get_pixmap(dpi=150).save('assets/分组/图.png')
  "
  ```
- 图片只需放「首页/代表图」即可（作品集不罗列多页缩略图，除非原模块就有 `page-strip`）。

---

## 3. 确定流程（每次改动必走）

1. **建基线**：改动前 `git add -A && git commit -q -m "基线：<本次改动>前快照"`，记录基线 commit hash 给用户，便于回滚。
2. **按模板扩展**：只复用既有 `.stage`/`.work`/`.sidebar__nav-*` 结构与类名，**禁止引入新样式、新颜色、新字体、emoji、花哨阴影/渐变**。
3. **校验编号**：改完用脚本核对 sidebar 编号、section 编号、stage 编号连续无重复。
4. **本地预览**：`python -m http.server` 或浏览器打开 `index.html` 目测。
5. **强制提交**：完成即 `git add -A && git commit -q -m "<本次改动说明>"`，不询问、不等待确认。
6. **回报**：告知用户基线 hash、本次 commit hash、改了哪些文件。

> 视觉/前端改动若涉及"设计判断"（布局、留白、层级），先调用 `use_skill("web-design-engineer")` 加载设计系统再执行；纯模板扩展（如本次加两个同构 `.work`）可跳过，但必须复用既有视觉词汇。

---

## 4. 必须保留的硬约束（来自历史约定，不得违反）

- **链接锁定**：所有「查看完整作品 →」「打开网页作品集 →」按钮永久指向 `https://trinitytingchuan-alt.github.io/Shang-s-Portfolio/`，严禁改动。
- **侧栏浅色**：左侧导航栏必须为浅色，禁用黑色背景。
- **留白与层级**：整体留白充足、层级清晰，避免文字堆叠。
- **证据可溯源**（若涉及分析报告类内容）：断言需带可追溯出处（E##/V## 或数据集来源）。

---

## 5. 干扰文件清理清单

项目根目录的临时/遗留文件，**不应纳入版本库、不应被 AI 当作规范来源**：

- `_check.png`、`_4567.html`、`_resume_text.txt` — 临时/遗留，可删
- `_del.py` / `_check.py` 等一次性脚本 — 用完即删，不提交
- 各类 `_chrome_*/` 临时目录 — 已被 .gitignore 忽略，忽略即可

> 凡以 `_` 开头且非 `_collection.html` 的文件，默认视为临时文件；提交时勿 `git add` 它们（除非用户明确要保留）。

---

## 6. Git 约定（来自历史记忆）

- 主分支 `main`，本地领先远程，推送需用户许可。
- 每次改动**强制提交**，不询问。
- 回滚方式：`git log` 找基线 commit → `git checkout <commit> -- <file>` 恢复源文件。
- `.gitignore` 已忽略 `*.pdf` 与 `_chrome_*/`；PDF 可由 `_collection.html` 重建，不入库。
