# 開発用の軽量イメージ
FROM node:20-alpine

WORKDIR /app

# パッケージ関連ファイルを先にコピーして依存関係だけをインストール
COPY package*.json ./
RUN npm install

# 残りのソースコードをコピー（appディレクトリの内容を/app/appにコピー）
COPY ./app ./app

# Next.js の開発サーバーを起動
CMD ["npm", "run", "dev"]
