# Java 17 の JDK イメージをベースにする
FROM eclipse-temurin:17-jdk

# 作業ディレクトリ
WORKDIR /app

# ビルド済みの jar ファイルをコピー
COPY build/libs/*.jar app.jar

# アプリが使うポート（Spring Boot は 8080 がデフォルト）
EXPOSE 8080

# アプリを起動するコマンド
ENTRYPOINT ["java", "-jar", "app.jar"]