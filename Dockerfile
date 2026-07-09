FROM node:20-alpine AS builder

WORKDIR /app

# Explicitly set development mode so devDependencies (vite, typescript, etc.) are installed
ENV NODE_ENV=development

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci

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
