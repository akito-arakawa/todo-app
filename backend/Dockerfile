# Java 17 の JDK を使用
FROM eclipse-temurin:17-jdk

# 作業ディレクトリを設定
WORKDIR /app

# Gradle Wrapper とソースコードをコピー
COPY . .

# Gradle Wrapperに実行権限を付与
RUN chmod +x ./gradlew

# JARファイルをビルド（初回に時間がかかります）
RUN ./gradlew bootJar

# アプリケーションの実行（生成された JAR を使用）
CMD ["java", "-jar", "build/libs/app.jar"]
