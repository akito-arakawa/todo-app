# todoリスト
## 概要
このアプリケーションは、タスクを管理するWebアプリです。ユーザーはタスクの登録、編集、削除を行い、進捗状況を可視化することができます。
## 仕様技術
### フロントエンド
- React
- Next.js
- typeScript
- Tailwind CSS
### バックエンド
- Spring Boot
- Spring Security
- JWT認証
- JPA(Hibernate)
### ライブラリ
- shadcn/ui
- Motion
- javadoc.io
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
## ローカルでのセットアップ手順
### 1.`.env`ファイルの作成
```
DB_URL=jdbc:postgresql://localhost:5432/your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```
