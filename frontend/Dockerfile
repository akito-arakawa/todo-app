# Step 1: Build Stage
FROM node:18-alpine AS builder

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとlockファイルをコピーして依存解決
COPY package*.json ./
RUN npm install

# アプリの全ファイルをコピー
COPY . .

# アプリをビルド（Next.js standalone 構成）
RUN npm run build

---

# Step 2: Run Stage
FROM node:18-alpine AS runner

# 作業ディレクトリを指定
WORKDIR /app

# standalone build 出力をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# ポートを公開（Render用）
EXPOSE 3000

# アプリ起動コマンド
CMD ["node", "server.js"]
