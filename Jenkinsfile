pipeline {
    agent any

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Source Code Management') {
            steps {
                checkout scm
            }
        }

        stage('Build & Compile') {
            steps {
                script {
                    // Compiles code, runs validations, and builds the executable .jar file
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Unit Testing (JUnit + JaCoCo)') {
            steps {
                script {
                    bat 'mvn test'
                }
            }
            post {
                always {
                    jacoco(
                        execPattern: '**/target/jacoco.exec',
                        classPattern: '**/target/classes',
                        sourcePattern: '**/src/main/java'
                    )
                }
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    // 1. Tear down any container left from a previous deploy (ignored if Docker is off), then free port 8081
                    echo "Clearing previous deployment (if any) and port 8081..."
                    bat(script: 'docker-compose down', returnStatus: true)
                    bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'

                    // 2. Start the app in the background using JDK 21 from JAVA_HOME (the bare 'java' on PATH is Java 11 and cannot run this jar)
                    echo "Launching Spring Boot App in background (JDK 21)..."
                    bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar "%WORKSPACE%\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar" --server.port=8081'

                    // 3. Wait-for-health loop: Polls the actuator endpoint until the server is awake (Max 120s)
                    echo "Waiting for server to become healthy on port 8081..."
                    bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"' 

                    // 4. Install Node dependencies and execute Cypress End-to-End tests
                    echo "Running Cypress UI automation suite..."
                    bat 'npm install'
                    // Clear JUnit results from any previous build so old XMLs aren't re-counted (workspace is reused)
                    bat 'if exist cypress\\results rmdir /s /q cypress\\results'
                    bat 'npx cypress run --config baseUrl=http://localhost:8081'
                }
            }
            post {
                always {
                    script {
                        // 5. Clean up: Ensure the background Java server process is turned off after testing completes
                        echo "Cleaning up environment: Stopping background server..."
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                    }
                }
            }
        }

        stage('Performance Testing (JMeter)') {
            steps {
                script {
                    // 1. Free port 8081 and start a fresh app instance for the load test (E2E killed the previous one)
                    echo "Clearing port 8081 and launching the app for the performance run..."
                    bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                    bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar "%WORKSPACE%\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar" --server.port=8081'

                    // 2. Wait until the app is healthy on 8081
                    echo "Waiting for server to become healthy on port 8081..."
                    bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"'

                    // 3. Run both JMeter plans (they default to localhost:8081) and save JTL results. 'call' is required so the .bat returns and runs the next line.
                    echo "Running JMeter performance plans against http://localhost:8081 ..."
                    bat '''
                        if not exist "target\\jmeter" mkdir "target\\jmeter"
                        call jmeter -n -t "src\\test\\jmeter\\petclinic_test_plan.jmx" -l "target\\jmeter\\petclinic_test_plan.jtl"
                        call jmeter -n -t "src\\test\\jmeter\\petclinic_improved.jmx" -l "target\\jmeter\\petclinic_improved.jtl"
                    '''
                }
            }
            post {
                always {
                    script {
                        echo "Stopping the performance-test app on 8081..."
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                    }
                    archiveArtifacts artifacts: 'target/jmeter/*.jtl', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy (Local Docker Compose)') {
            steps {
                script {
                    // 1. Free host port 8081 so the container can bind it
                    echo "Freeing port 8081 for the Docker container..."
                    bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'

                    // 2. Build the image and run ONLY the app container. App uses in-memory H2, so --no-deps skips the unused mysql/postgres. Requires Docker Desktop running.
                    echo "Deploying via Docker Compose (Docker Desktop must be running)..."
                    bat(script: 'docker-compose down', returnStatus: true)
                    bat 'docker-compose up -d --build --no-deps petclinic-app'

                    // 3. Verify the deployed container actually serves on 8081 (allows time for the image build + app boot)
                    echo "Verifying the deployed container responds on 8081..."
                    bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 90; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'Deployed app is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'Deployed container did not become healthy in 180s\'; exit 1"'
                }
                echo "Deployed: the app is now running in Docker at http://localhost:8081"
            }
        }
    }

    post {
        always {
            // Records test reports in the Jenkins UI: Cypress E2E results (JUnit XML) plus any Maven surefire reports
            junit allowEmptyResults: true, testResults: 'cypress/results/*.xml, **/target/surefire-reports/*.xml'
        }
    }
}