# Stage 1: Build & Compile the executable package
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime environment for execution
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose production port
EXPOSE 8081

# Execute with the 8081 port binding flag and bypass spring security autoconfig if required
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8081", "--spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"]