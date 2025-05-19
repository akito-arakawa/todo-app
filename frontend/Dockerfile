# Step1: ビルド用
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係インストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをすべてコピー
COPY . .

# Next.js をビルド（standalone モードで）
RUN npm run build

# Step2: 実行用
FROM node:18-alpine AS runner

WORKDIR /app

# standalone構成をコピー（これで server.js や .next が含まれる）
COPY --from=builder /app/.next/standalone ./

# 静的ファイルをコピー（Next.js の画像やフォントなど）
COPY --from=builder /app/.next/static ./.next/static

# public フォルダを直接コピー（favicon.ico 等）
COPY public ./public

# ポート指定
EXPOSE 3000

# 起動コマンド
CMD ["node", "server.js"]
