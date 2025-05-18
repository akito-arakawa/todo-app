# Java 17 の JDK イメージを使用
FROM eclipse-temurin:17-jdk

# 作業ディレクトリ作成
WORKDIR /app

# Gradle Wrapperやソースコードをコピー
COPY . .

# JARファイルをビルド
RUN ./gradlew bootJar

# jarを実行
CMD ["java", "-jar", "build/libs/app.jar"]
