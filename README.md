# Web Nav — 个人导航起始页

> 一个类 Bing 风格的个人浏览器导航起始页，集常用链接管理、搜索引擎、时钟天气、壁纸背景于一体。
> 支持可视化编辑，数据持久化存储在 YAML 文件中，开箱即用。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

---

## 📸 预览

| 起始页 | 编辑模式 |
|-------|---------|
| ![起始页截图](screenshots/home.png) | ![编辑面板](screenshots/editor.png) |

> 截图目录 `screenshots/` 需自行添加，以上为占位引用。

---

## ✨ 功能特性

| 特性 | 说明 |
|------|------|
| 🧭 **导航网格** | 分类展示常用链接，支持本地搜索过滤 |
| 🔍 **多搜索引擎** | 内置 Google、Bing、百度、DuckDuckGo 等，快捷键 `/` 聚焦搜索框 |
| 🖼️ **动态壁纸** | 自动获取 Bing 每日壁纸，支持 Unsplash / 纯色渐变模式切换 |
| 🕐 **实时时钟** | 大字体时间显示，同步日期 |
| 🌤️ **天气信息** | 基于浏览器定位的实时天气，支持手动设置坐标（默认回退北京） |
| 🌙 **深色模式** | 默认深色主题，支持一键切换 |
| ✏️ **可视化编辑** | 侧边抽屉面板，页面上直接增删改导航分类和链接 |

---

## 🛠️ 技术栈

| 层 | 技术 |
|---|---|
| **前端框架** | React 18 + TypeScript |
| **构建工具** | Vite 5（HMR 热更新） |
| **样式方案** | Tailwind CSS 3（`class` 暗色模式） |
| **状态管理** | Zustand |
| **图标库** | Lucide React |
| **后端服务** | Express.js（API + 静态托管） |
| **数据存储** | YAML 文件（`data/nav.yaml` — 可手动编辑或通过网页修改） |
| ~~**打包部署** | Docker 多阶段构建（`node:20-alpine`） |

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式（Vite HMR + Express API 同时运行）
npm run dev

# 构建前端产物
npm run build

# 生产模式（Express 同时提供 API 和静态文件服务）
npm start
```

- 开发模式访问：**http://localhost:5173**
- 生产模式默认端口：**3001**（可通过 `PORT` 环境变量修改）

### Docker 部署

```bash
# 构建镜像
docker build -t web-nav .

# 运行容器（数据持久化到宿主目录）
docker run -d \
  --name web-nav \
  -p 3001:3001 \
  -v $(pwd)/data:/app/data \
  web-nav
```

> 项目已配置 GitHub Actions 自动构建推送（`.github/workflows/docker-build-push.yml`），
> 推送到 `main` 分支自动打包并推送至 Docker Hub。

---

## 📁 项目结构

```
web-nav/
├── data/
│   └── nav.yaml              # 导航数据（YAML 源文件，可直接编辑）
├── server/
│   └── index.js               # Express API 服务
│                               #   GET  /api/nav          — 读取导航数据
│                               #   PUT  /api/nav          — 保存导航数据
│                               #   GET  /api/background   — 代理 Bing 壁纸
├── src/
│   ├── main.tsx               # 入口文件
│   ├── App.tsx                # 根组件：背景 → 时钟 → 搜索 → 导航网格
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── stores/
│   │   └── useNavStore.ts     # Zustand 全局状态（导航数据 + UI 状态）
│   ├── hooks/
│   │   ├── useBackground.ts   # 获取 Bing 壁纸
│   │   ├── useClock.ts        # 秒级时钟更新
│   │   ├── useWeather.ts      # 调用 Open-Meteo 天气 API
│   │   └── useSearchEngines.ts
│   ├── components/
│   │   ├── Background.tsx     # 全屏壁纸背景 + 暗色遮罩
│   │   ├── Clock.tsx          # 大字体时钟 + 日期
│   │   ├── SearchBar.tsx      # 搜索栏 + 引擎切换
│   │   ├── Weather.tsx        # 天气组件
│   │   ├── NavGrid.tsx        # 导航分类网格 + 过滤
│   │   ├── CategorySection.tsx
│   │   ├── LinkCard.tsx       # 单个链接卡片
│   │   ├── Settings.tsx       # 设置面板（壁纸源、深色模式）
│   │   └── Editor/
│   │       ├── EditorPanel.tsx    # 侧边编辑面板
│   │       ├── CategoryEditor.tsx # 分类编辑器
│   │       └── LinkEditor.tsx     # 链接编辑器
│   └── utils/
│       ├── search.ts          # 搜索引擎 URL 定义
│       └── icons.tsx          # 图标名称 → Lucide 组件映射
├── .github/
│   └── workflows/
│       └── docker-build-push.yml  # CI/CD 流水线
├── index.html                 # HTML 模板
├── Dockerfile                 # Docker 多阶段构建
├── .dockerignore
├── vite.config.ts             # Vite 配置（含 API 代理到 :3001）
├── tailwind.config.js         # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
└── package.json
```

---

## 📊 数据管理

导航数据存储在 `data/nav.yaml` 中，可通过两种方式管理：

1. **直接编辑 YAML** — 用任意文本编辑器修改 `data/nav.yaml`
2. **可视化编辑** — 点击页面右上角编辑按钮，在侧边抽屉面板中操作

### YAML 结构示例

```yaml
categories:
  - name: "常用"
    icon: "star"
    links:
      - name: "GitHub"
        url: "https://github.com"
        icon: "github"
        description: "代码托管与协作平台"
        pinned: true
```

### 编辑流程

```
编辑器草稿副本 → 点击保存 → PUT /api/nav → 写入 YAML 文件
```

> 💡 `pinned: true` 的链接在分类中置顶显示。

### 支持的自定义图标

```
star, github, mail, message-circle, book-open, layers, package, book,
triangle, check-circle, message-square, bot, cpu, figma, image, droplets,
wrench, sparkles, palette, globe, code, terminal, server, database,
shield, zap, link, search, home, user, settings, clock, cloud, folder,
heart, music, video, camera, map, list, filter
```

---

## 🌐 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/nav` | 获取导航数据 |
| `PUT` | `/api/nav` | 保存导航数据（Body: `{ data: NavData }`） |
| `GET` | `/api/background` | 代理 Bing 每日壁纸（参数: `?idx=0&n=8`） |

---

## 🧪 开发说明

| 项目 | 说明 |
|------|------|
| **前端端口** | Vite 默认 `5173` |
| **后端端口** | Express API 默认 `3001` |
| **API 代理** | Vite 自动代理 `/api` 请求到后端 |
| **深色模式** | 默认开启，通过 `html.dark` class 控制，Tailwind `darkMode: 'class'` 策略 |
| **天气 API** | [Open-Meteo](https://open-meteo.com/) — 免费，无需 API Key |
| **壁纸源** | Bing 国内 API（`cn.bing.com`），支持切换 Unsplash / 纯色渐变 |
| **浏览器兼容** | Chrome / Firefox / Edge / Safari（现代浏览器最新 2 个主版本） |

---

## 🤝 贡献

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/my-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feat/my-feature`
5. 提交 Pull Request

---

## 📄 许可

MIT — 自由使用、修改和分发。
