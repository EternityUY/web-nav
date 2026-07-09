FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies like vite, TypeScript, Tailwind)
# Note: using npm install instead of npm ci because GitHub Actions CI + BuildKit
# can cause npm ci to skip devDependencies even when NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install

# Build frontend (Vite → dist/)
COPY tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY public/ public/
COPY src/ src/
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy server & data
COPY server/ server/
COPY data/ data/
COPY config/ config/

# Data directory for YAML persistence
RUN mkdir -p data && chown -R node:node /app

USER node

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
