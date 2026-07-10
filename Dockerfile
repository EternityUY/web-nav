FROM python:3.12-alpine

WORKDIR /app

# 安装 Python 依赖
COPY server/requirements.txt server/
RUN pip install --no-cache-dir -r server/requirements.txt

# 复制构建产物和应用文件
COPY dist/ dist/
COPY server/ server/
COPY data/ data/
COPY config/ config/

# 确保 data 目录可写
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3001

CMD ["python", "server/index.py"]
