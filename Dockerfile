FROM node:20-alpine AS runner

WORKDIR /app

# Upgrade npm to avoid npm 10.8.2 bug
RUN npm install -g npm@latest

# Copy production dependencies only
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy all source files (dist/ already built locally and committed)
COPY server/ server/
COPY data/ data/
COPY config/ config/
COPY dist/ dist/

# Data directory for YAML persistence
RUN mkdir -p data && chown -R node:node /app

USER node

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
