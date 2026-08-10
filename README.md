# 🎨 拼豆像素画生成器 · Mard Pixel Art Tool

> 把喜欢的图片一键变成 **Mard 拼豆图纸**，自动生成每种色号的用量统计。
> 「佳佳小霸王专属拼豆工具」——上传图片，自动转换为拼豆像素画并生成色号清单，照着拼就行。

[English summary ↓](#english)

---

## ✨ 功能特性

- **🖼️ 图片转拼豆图纸**：上传任意图片，自动量化成拼豆像素网格，每个格子标注对应 Mard 色号。
- **🎚️ 三档清晰度**：高（128×）、中（64×）、低（32×）一键切换，适配不同复杂度的图案。
- **🎨 两种画质预设**（参考 pixel-beads.com 默认效果，无需手动调参）：
  - **细节优先**：最多 30 色，保留更多细节。
  - **平滑自然**：最多 16 色，开启去噪，画面更干净。
- **🧹 智能背景处理**：自动去除背景，背景格留空（不拼豆），只拼主体。
- **📊 色号统计**：实时统计每种 Mard 色号需要多少颗豆，按色卡顺序排列，方便备料。
- **🔍 交互式预览**：支持缩放、平移、水平/垂直翻转、一键重置。
- **💾 导出**：下载像素图纸 PNG，或打开全屏预览对照拼豆。
- **📱 移动端友好**：响应式布局，手机上也能顺畅上传、查看与导出（详见下方「移动端适配」）。

## 🖼️ 使用流程

1. 点击 **上传图片** 选择一张图片（宠物、头像、卡通、logo 都行）。
2. 选择 **清晰度**（高/中/低）。
3. 选择 **画质预设**（细节优先 / 平滑自然）。
4. 右侧自动生成：
   - **像素化图**：带行列坐标轴的拼豆图纸，格子内为 Mard 色号。
   - **色号统计**：每种颜色需要多少颗豆。
5. 可缩放/翻转查看，或 **下载图片** 保存图纸。

## 🛠️ 技术栈

| 类别 | 说明 |
|------|------|
| 构建工具 | [Vite](https://vitejs.dev/) 5 |
| 框架 | [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/) 5 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) 3 + 内联渐变 |
| 图标 | [lucide-react](https://lucide.dev/) |
| 绘图 | 原生 Canvas 2D（像素网格、坐标轴、导出） |
| 数据 | Mard 221 色官方标准色卡（`mard-color.js`） |
| 后端 | **无需后端，纯前端运行**，所有处理在浏览器本地完成，图片不上传服务器 |

## 📦 本地运行

> 需要 Node.js 18 及以上版本。

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

常用脚本：

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 打包到 `dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run lint` | ESLint 代码检查 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run deploy` | 部署到 GitHub Pages（见下） |

## 🚀 部署到 GitHub Pages

项目已配置 `base: '/pindouwangzhan/'`，可直接部署到
`https://<你的用户名>.github.io/pindouwangzhan/`。

```bash
npm run build
npm run deploy
```

`deploy` 使用 [`gh-pages`](https://www.npmjs.com/package/gh-pages)，会把 `dist/` 推送到仓库的 `gh-pages` 分支。首次部署前请确保：

- 仓库已创建并 `git remote` 指向正确地址；
- 在仓库 **Settings → Pages** 中选择 `gh-pages` 分支作为发布源。

## 📱 移动端适配（本项目重点）

项目针对手机/平板做了完整适配，核心做法：

- **响应式栅格**：大屏三栏（原图 / 像素图纸 / 色号统计），小屏自动堆叠为单列。
- **装饰元素按需隐藏**：两侧 emoji 装饰、装饰性文案在中小屏（`xl:` / `md:` 断点以下）自动隐藏，避免干扰操作。
- **文字自适应**：标题、按钮文字随屏幕缩放（`text-2xl sm:text-4xl` 等）。
- **图纸可滚动/缩放**：像素网格容器 `max-width: 100%` + `overflow: auto`，大图在手机上可滚动查看，配合缩放/平移手势操作。
- **操作按钮移动端占满宽度**：上传、预览、下载、翻转等按钮在窄屏下 `flex-1` 自动铺满，便于触屏点击。

## 📂 项目结构

```
pindouwangzhan/
├── index.html              # 入口 HTML，标题 "Mard拼豆 Pixel Art Tool"
├── package.json
├── vite.config.ts          # base: /pindouwangzhan/，GitHub Pages 部署
├── tailwind.config.js
├── postcss.config.js
├── mard-color.js           # Mard 221 色官方标准色卡（原始数据）
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx             # 主应用：状态管理 + 处理管线编排
    ├── index.css           # 全局样式（Tailwind 指令）
    ├── components/
    │   ├── ImageUploader.tsx     # 图片上传
    │   ├── SizeSelector.tsx      # 清晰度选择（128 / 64 / 32）
    │   ├── PixelGrid.tsx         # Canvas 像素图纸：缩放/平移/翻转/下载
    │   ├── ColorStatistics.tsx   # 色号用量统计
    │   └── PreviewModal.tsx      # 全屏预览
    ├── data/
    │   └── mardColors.ts         # Mard 色卡 TS 封装（221 色 + 排序）
    └── utils/
        ├── quantize.ts           # 核心：取色 / 去背景 / 轮廓 / 加权 k-means 量化
        └── colorMatching.ts      # 颜色匹配到 Mard 色卡 + 校验
```

### 核心处理管线（`utils/quantize.ts`）

```
原图 → 按清晰度缩放 → 众数取色 → (可选)背景去除 → (可选)轮廓提取
     → 加权 k-means 量化（Lab 色彩空间）→ (可选)去噪 → 匹配 Mard 色卡
     → 输出像素网格 + 色号统计
```

背景格返回 `null`（透明、不拼豆），统计时自动跳过。

## 🎨 关于 Mard 色卡

- 色卡数据来自 **Mard 221 色官方标准色卡**（`mard-color.js`）。
- `src/data/mardColors.ts` 将其封装为 `MARD_COLORS`，并生成 `MARD_COLOR_ORDER` 用于按 `A1→A10、B1→B10…` 顺序排序统计结果。
- 颜色匹配在 `utils/colorMatching.ts` 中完成（Lab 空间最近邻匹配），并含 `validatePalette()` 校验色卡是否加载完整。

## ⚠️ 注意事项

- 本项目为**纯前端工具**，所有图片处理均在浏览器本地完成，**不会上传任何图片**。
- 仓库当前未包含 `LICENSE` 文件。若计划开源，请补充合适的开源协议（如 MIT）。
- `package.json` 中虽含 `@supabase/supabase-js` 依赖，但代码中**未实际使用**，可保留或移除，不影响功能。

---

## English

### Mard Pixel Art Tool

A pure-frontend tool that converts any image into a **Mard fuse-beads (拼豆) pixel-art pattern**, with automatic per-color bead counting.

**Features**
- Upload an image → auto-generated pixel grid with Mard color codes per cell.
- Three resolution presets (128 / 64 / 32) and two quality presets (Detail / Smooth).
- Automatic background removal, optional denoise, outline extraction.
- Live color statistics (how many beads of each Mard color you need).
- Zoom / pan / flip / reset, PNG export, full-screen preview.
- Fully responsive — works well on mobile.

**Tech**: Vite 5 · React 18 · TypeScript · Tailwind CSS · Canvas 2D. No backend; all processing runs locally in the browser.

**Run locally**
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

**Deploy** (GitHub Pages, base `/pindouwangzhan/`):
```bash
npm run deploy
```

## 📄 License

No `LICENSE` file is included yet. Add one (e.g. MIT) before publishing if you intend to open-source it.
