FROM node:20-alpine

WORKDIR /app

# 只安装服务端运行时必需的包（express + js-yaml），前端依赖已打包进 dist/
RUN npm install express js-yaml

# 覆盖 npm 自动生成的 package.json，提供 "type": "module" 确保 Node.js 正确解析 ESM
COPY package.json ./

# 复制构建产物和服务端代码
COPY dist/ dist/
COPY server/ server/
COPY data/ data/
COPY config/ config/

# 确保 data 目录对 node 用户可写（供 PUT /api/nav 写入 YAML）
RUN chown -R node:node /app

USER node

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
