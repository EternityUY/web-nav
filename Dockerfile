FROM node:20-alpine AS builder

WORKDIR /app

# Upgrade npm to avoid npm 10.8.2 bug "Exit handler never called!" which breaks installs
RUN npm install -g npm@latest

# Install ALL dependencies (including devDependencies like vite, TypeScript, Tailwind)
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

# Upgrade npm to avoid npm 10.8.2 bug
RUN npm install -g npm@latest

# Copy production dependencies only
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

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
