# ulinwang.github.io

王友林（UlinWang）的个人作品集网站 — AI 产品经理 × 全栈开发者。

## 技术栈

- **Next.js 15**（App Router，SSR/SSG 混合，部署于 Vercel）+ TypeScript
- **Tailwind CSS** 深色主题
- **framer-motion**（入场/悬停动画）、**gsap**（滚动叙事，含隐藏标签页/超时兜底）、**lenis**（平滑滚动）
- 自定义光标（桌面端；移动端与 `prefers-reduced-motion` 自动禁用）
- 内容管理：**Decap CMS** + Markdown 文件（`content/`），线上走 GitHub OAuth（serverless functions）

## 目录结构

```
app/                 页面（app/page.tsx 单页 + app/projects/[slug] 详情页）
app/api/auth/        Decap GitHub OAuth 入口（serverless）
app/api/callback/    Decap GitHub OAuth 回调（serverless）
components/          Navbar, CustomCursor, SmoothScroll, Hero, Intro, About, Portfolio, ProjectCard, Footer ...
content/
  site/              简介 intro.md、关于 about.md（Decap `site` 文件集合）
  projects/          项目 Markdown（Decap `projects` 文件夹集合）
lib/content.ts       用 gray-matter 读取 content/ 并渲染 Markdown
lib/scroll.ts        lenis 实例共享 + 锚点平滑滚动
public/admin/        Decap CMS（index.html + config.yml）
public/uploads/      CMS 媒体目录（含云纹分析图 public/uploads/yunwen/）
```

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
```

## 部署（Vercel）

1. 把仓库 push 到 GitHub。
2. 在 [Vercel](https://vercel.com) 导入该 GitHub 仓库（Framework Preset 会自动识别 Next.js，Build Command `next build`，无需额外配置）。
3. 每次 push 到 `main` 自动触发部署。
4. 站点域名：`https://youlinwang.vercel.app`（`public/admin/config.yml` 的 `base_url` 已指向它）。

## 内容编辑（Decap CMS）

管理界面位于 `/admin/`。

### 线上编辑（Vercel + GitHub OAuth）

Vercel 部署包含 `app/api/auth` 与 `app/api/callback` 两个 serverless functions，作为 Decap 的 GitHub OAuth provider。一次性配置：

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**：
   - **Homepage URL**：`https://youlinwang.vercel.app`
   - **Authorization callback URL**：`https://youlinwang.vercel.app/api/callback`
2. 创建后得到 **Client ID**，并生成 **Client Secret**。
3. Vercel 项目 → **Settings → Environment Variables**，添加：
   - `GITHUB_CLIENT_ID` = OAuth App 的 Client ID
   - `GITHUB_CLIENT_SECRET` = OAuth App 的 Client Secret
4. Redeploy。之后访问 `https://youlinwang.vercel.app/admin/`，点「Login with GitHub」即可在线编辑，保存会直接提交到 GitHub 仓库并触发重新部署。

### 本地编辑（免 OAuth）

```bash
npx decap-server   # 另开一个终端运行
# 同时把 public/admin/config.yml 中的 local_backend: true 取消注释
npm run dev
```

然后访问 http://localhost:3000/admin/，改动直接写入本地 `content/` 文件。

## 构建

```bash
npm run build      # 生产构建（SSR/SSG）
npm start          # 本地预览生产构建
```
