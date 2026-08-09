# 尚文蜓 · 作品集

静态作品集网站（纯 HTML/CSS/JS，无任何构建依赖），部署到公网后任何人可点击查看。

## 在线预览

本地预览：

```bash
cd C:\Users\Administrator\Desktop\zg\workbuddy
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080/
```

## 部署到 GitHub Pages（公网可访问）

推荐方式：以 `你的用户名.github.io` 作为仓库名部署（一个用户只能有一个）：

1. 在 GitHub 新建仓库，命名 `trinitytingchuan.github.io`（将 `trinitytingchuan` 换成你的用户名）
   - Public 可见
   - 不要勾选 "Add a README"（保持空仓库）

2. 在本地打开终端，执行：

```bash
cd C:\Users\Administrator\Desktop\zg\workbuddy
git init
git add .
git commit -m "init portfolio"
git branch -M main
git remote add origin https://github.com/<你的用户名>/trinitytingchuan.github.io.git
git push -u origin main
```

3. 打开仓库的 Settings → Pages
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，目录选择 `/ (root)`
   - 点击 Save

4. 等待 1-2 分钟，访问 `https://<你的用户名>.github.io/` 即可看到作品集

### 替代方式：普通仓库 + Pages 分支

若使用其他仓库名（如 `portfolio`）：

```bash
git remote add origin https://github.com/<你的用户名>/portfolio.git
git push -u origin main
```

然后在仓库 Settings → Pages 中设置 Source 为 `main` / `/(root)`。

## 目录结构

```
workbuddy/
├── index.html          # 作品集主页面
├── css/style.css       # 全部样式
├── js/main.js          # 交互（导航、画廊、过滤）
├── assets/
│   ├── pdf_hi/         # 产品功能设计 PDF 高清图（点击可全屏放大翻页）
│   ├── pdf_pages/      # 国联证券研究报告逐页图
│   ├── docx_images/    # 摄影、Axure 原型、战略规划图
│   └── portfolio_pngs/ # 竞赛论文、Tableau 看板、进销存等
└── README.md
```

## 说明

- 全部内容为静态文件，部署后无需再维护。
- 联系方式与 GitHub 链接已内嵌：邮箱 trinity_ting@163.com · 手机 13249086026 · GitHub @trinitytingchuan-alt
- 若需更换 GitHub 链接，直接编辑 `index.html` 中 `github-link` 与 `github-link-contact` 对应地址。
