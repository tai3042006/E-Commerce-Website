FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src/main ./src/main
RUN mvn -B package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/clofit-api-1.0.0.jar app.jar
EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]
