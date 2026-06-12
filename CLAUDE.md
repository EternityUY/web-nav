# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev mode (Vite HMR + Express API concurrently)
npm run build        # Build frontend to dist/
npm start            # Production mode (Express serves API + static dist/)
```

## Architecture

### Web navigation start page (Bing-style)

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js API server (port 3001, proxied via Vite in dev)
- **Data**: YAML file (`data/nav.yaml`) is the source of truth, read/written via REST API

### Key files & structure

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
    useSearchEngines.ts                # (future) search engine config
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
      CategoryEditor.tsx               # Add/edit/delete categories
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

### Key patterns

- **State management**: Zustand single store. `fetchNav()` called in `App` on mount.
- **Editing**: Editor panel modifies a draft copy (deep-cloned). Save → PUT /api/nav → YAML file.
- **Background**: Bing wallpaper API returns 8 images → random one selected → `background-size: cover`.
- **Search**: Engine selector dropdown. Press `/` to focus search. Engine URLs defined in `utils/search.ts`.
- **Weather**: Free Open-Meteo API via browser geolocation. Falls back to Beijing coordinates.
- **Theme**: Dark mode by default. `.dark` class on `<html>` toggled via Tailwind.

### Available icon names (for YAML)

star, github, mail, message-circle, book-open, layers, package, book, triangle, check-circle, message-square, bot, cpu, figma, image, droplets, wrench, sparkles, palette, globe, code, terminal, server, database, shield, zap, link, search, home, user, settings, clock, cloud, folder, heart, music, video, camera, map, list, filter
