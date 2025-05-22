# ToDo管理アプリケーション（React × Spring Boot × PostgreSQL）
## 概要
このアプリケーションは、タスクを管理するWebアプリです。ユーザーはタスクの登録、編集、削除を行い、進捗状況を可視化することができます。
## 使用技術
### フロントエンド
- React
- Next.js
- TypeScript
- Tailwind CSS
### バックエンド
- Spring Boot
- Spring Security
- JWT（JSON Web Token）による認証
- JPA(Hibernate)
### ライブラリ
- shadcn/ui
- Framer Motion
### データベース
- PostgreSQL(Dockerコンテナ上で動作)
### インフラ/ツール
- Docker/Docker Compose
- Liquibase
- Git/GitHub
- Render
- Vercel
## 🌐 本番環境のURL（Vercel）
https://todo-frontend-psi-gilt.vercel.app/auth/login
<br>
※ バックエンドは Render（無料プラン）上にホスティングされています。
<br>
※ 無料プランの特性上、数分間アクセスがないとサーバーがスリープし、次のリクエスト時に時間がかかることがあります。
## ローカルでのセットアップ手順
### 1.`.env`ファイルの作成

```
DB_URL=jdbc:postgresql://localhost:5432/your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```
※ `.env` ファイルは `backend` ディレクトリ直下に配置してください。
### 注意事項
`.env`ファイルには機密情報を含むため、**絶対に公開リポジトリに含めないでください**。

### 2. Docker コンテナ起動
```
docker-compose up -d
```
### Spring Bootアプリ起動
```
cd backend

./gradlew bootRun
# または
./gradlew bootJar
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```
### フロントエンド起動（Next.js）
```
cd frontend
npm install
npm run dev
```
## 機能一覧
- ユーザー登録 / ログイン（JWT認証）
- タスクの作成 / 編集 / 削除
- タスクのステータス変更（未完了 / 完了）
- タスクのフィルタリング表示（期限切れ / 今日 / 完了済み）
- タブによるステータスごとの分類表示
- 日付入力による期限管理