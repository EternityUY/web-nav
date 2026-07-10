# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ 构建规则（必读）

**每次修改前端代码后必须运行 `npm run build`，并将 `dist/` 目录一起提交。**

Docker 镜像直接使用 `dist/` 成品，不执行构建。修改 `src/` 下的代码但不更新 `dist/` = Docker 跑的仍是旧版本。

```bash
# 标准工作流：改代码 → 构建 → 提交（含 dist/）
npm run build
git add dist/
git commit -m "..."
git push
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev mode (Vite HMR + Express API concurrently)
npm run build        # Build frontend to dist/
npm start            # Production mode (Express serves API + static dist/)
```

## Architecture

### Web navigation start page (Bing-style)

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (class dark mode)
- **Backend**: Express.js API server (port 3001, proxied via Vite in dev)
- **Data**: YAML file (`data/nav.yaml`) is the source of truth, read/written via REST API
- **State**: Zustand single store — `fetchNav()` called in `App` on mount
- **CI/CD**: GitHub Actions — pushes to `main` build Docker image and pushes to Docker Hub
- **Docker**: Multi-stage build (`node:20-alpine`), production stage is ~100MB

### Project structure

```
data/nav.yaml                          # Navigation data — edit directly or via web UI
server/index.js                        # Express: GET/PUT /api/nav, GET /api/background proxy
src/
  App.tsx                              # Root layout: background → clock → search → nav grid
  main.tsx                             # Entry point
  stores/useNavStore.ts                # Zustand store (nav data, UI state, actions)
  types/index.ts                       # TypeScript types: NavData, Category, LinkItem, etc.
  hooks/
    useBackground.ts                   # Fetches Bing daily wallpaper via /api/background
    useWeather.ts                      # Fetches free Open-Meteo weather API
    useClock.ts                        # 1-second clock timer
    useSearchEngines.ts                # Search engine config
  components/
    Background.tsx                     # Full-screen Bing wallpaper with overlay
    SearchBar.tsx                      # Centered search with engine switcher
    Clock.tsx                          # Large time + date display
    Weather.tsx                        # Temperature + weather emoji
    NavGrid.tsx                        # Category sections with local filter
    CategorySection.tsx                # Single category row
    LinkCard.tsx                       # Individual link card (icon + name + desc)
    Settings.tsx                       # Theme/background source controls
    Editor/
      EditorPanel.tsx                  # Side drawer — link & category management
      CategoryEditor.tsx               # Add/edit/delete categories (name, icon)
      LinkEditor.tsx                   # Add/edit/delete links (icon, name, url, pin)
  utils/
    search.ts                          # Search engine URL definitions
    icons.tsx                          # Icon name → lucide-react component mapping
```

### Data flow

```
data/nav.yaml  ←→  Express API (/api/nav)  ←→  Zustand Store  →  React Components
                       ↑                              ↓
              Background proxy (/api/background)   Editor Panel
```

### YAML structure

```yaml
categories:
  - name: "分类名"
    icon: "icon-name"
    links:
      - name: "链接名"
        url: "https://..."
        icon: "icon-name"
        description: "描述"
        pinned: true
```

## Coding conventions

### TypeScript / React

- **TypeScript**: Strict mode enabled in `tsconfig.json`. Avoid `any` — use proper types from `types/index.ts`.
- **Imports**: Use named exports. React components are PascalCase, utility functions are camelCase.
- **Hooks**: Custom hooks in `src/hooks/` follow `useXxx` naming, return typed objects.
- **Components**: Functional components only. Props typed with interface exported from the component file or `types/index.ts`.
- **State**: Use Zustand store (`useNavStore`) for global state. Local UI state stays in `useState`/`useReducer`.
- **Styling**: Tailwind utility classes. Dark mode via `dark:` prefix. No CSS modules or styled-components.
- **Icons**: Use lucide-react components. Icon name → component mapping in `utils/icons.tsx`.
- **Editor pattern**: Editor modifies a deep-cloned draft. Save → PUT /api/nav → YAML file written server-side.

### Git conventions

- **Commit**: Chinese or English messages, imperative mood, e.g. `feat: add link pin/unpin`, `fix: correct Bing wallpaper URL`
- **Branch**: `feat/xxx`, `fix/xxx`, `chore/xxx`
- **No linter**: ESLint / Prettier not configured — maintain consistent formatting manually

### Environment

- **Node**: >=18, uses `node:20-alpine` in Docker
- **npm**: Uses `package-lock.json` for reproducible installs
- **Ports**: 5173 (Vite dev), 3001 (Express for both dev and prod)

### Available icon names (for YAML data)

star, github, mail, message-circle, book-open, layers, package, book, triangle, check-circle, message-square, bot, cpu, figma, image, droplets, wrench, sparkles, palette, globe, code, terminal, server, database, shield, zap, link, search, home, user, settings, clock, cloud, folder, heart, music, video, camera, map, list, filter
