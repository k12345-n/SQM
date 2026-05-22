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
                    if (isUnix()) {
                        echo "Detected Mac/Linux environment. Compiling via sh..."
                        sh 'mvn clean package -DskipTests'
                    } else {
                        echo "Detected Windows environment. Compiling via bat..."
                        bat 'mvn clean package -DskipTests'
                    }
                }
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    if (isUnix()) {
                        echo "Detected Mac environment. Running macOS E2E orchestration..."
                        // 1. Tear down old containers and clear port 8081
                        sh 'docker-compose down || true'
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'

                        // 2. Start app in background (Unix style)
                        echo "Launching Spring Boot App in background (Mac)..."
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > app.log 2>&1 &'

                        // 3. Wait-for-health loop
                        echo "Waiting for server to become healthy on port 8081..."
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "App is up on 8081"
                                    exit 0
                                fi
                                sleep 2
                            done
                            echo "App did not start on 8081 within 120s"
                            exit 1
                        '''

                        // 4. Run Cypress Tests
                        echo "Running Cypress UI automation suite..."
                        sh 'npm install'
                        sh 'rm -rf cypress/results'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'

                    } else {
                        echo "Detected Windows environment. Running Windows E2E orchestration..."
                        // Eric's original Windows Logic
                        bat(script: 'docker-compose down', returnStatus: true)
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar "%WORKSPACE%\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar" --server.port=8081'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"' 
                        bat 'npm install'
                        bat 'if exist cypress\\results rmdir /s /q cypress\\results'
                        bat 'npx cypress run --config baseUrl=http://localhost:8081'
                    }
                }
            }
            post {
                always {
                    script {
                        echo "Cleaning up environment: Stopping background server..."
                        if (isUnix()) {
                            sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        } else {
                            bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        }
                    }
                }
            }
        }

        stage('Performance Testing (JMeter)') {
            steps {
                script {
                    if (isUnix()) {
                        echo "Detected Mac environment. Running Performance Run..."
                        // 1. Free port 8081 and start app
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > jmeter-app.log 2>&1 &'

                        // 2. Wait for health
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "App is up on 8081"
                                    exit 0
                                fi
                                sleep 2
                            done
                            exit 1
                        '''

                        // 3. Run JMeter Plans
                        sh 'mkdir -p target/jmeter'
                        sh 'jmeter -n -t src/test/jmeter/petclinic_test_plan.jmx -l target/jmeter/petclinic_test_plan.jtl'
                        sh 'jmeter -n -t src/test/jmeter/petclinic_improved.jmx -l target/jmeter/petclinic_improved.jtl'

                    } else {
                        echo "Detected Windows environment. Running Performance Run..."
                        // Eric's original Windows Logic
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar "%WORKSPACE%\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar" --server.port=8081'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"'
                        bat '''
                            if not exist "target\\jmeter" mkdir "target\\jmeter"
                            call jmeter -n -t "src\\test\\jmeter\\petclinic_test_plan.jmx" -l "target\\jmeter\\petclinic_test_plan.jtl"
                            call jmeter -n -t "src\\test\\jmeter\\petclinic_improved.jmx" -l "target\\jmeter\\petclinic_improved.jtl"
                        '''
                    }
                }
            }
            post {
                always {
                    script {
                        echo "Stopping the performance-test app on 8081..."
                        if (isUnix()) {
                            sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        } else {
                            bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        }
                    }
                    archiveArtifacts artifacts: 'target/jmeter/*.jtl', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy (Local Docker Compose)') {
            steps {
                script {
                    if (isUnix()) {
                        echo "Detected Mac environment. Deploying container stack..."
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'docker-compose down || true'
                        sh 'docker-compose up -d --build --no-deps petclinic-app'

                        // Verification loop
                        sh '''
                            for i in {1..90}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "Deployed app is up on 8081"
                                    exit 0
                                fi
                                sleep 2
                            done
                            echo "Deployed container did not become healthy in 180s"
                            exit 1
                        '''
                    } else {
                        echo "Detected Windows environment. Deploying container stack..."
                        // Eric's original Windows Logic
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat(script: 'docker-compose down', returnStatus: true)
                        bat 'docker-compose up -d --build --no-deps petclinic-app'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 90; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'Deployed app is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'Deployed container did not become healthy in 180s\'; exit 1"'
                    }
                }
                echo "Deployed: the app is now running in Docker at http://localhost:8081"
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'cypress/results/*.xml, **/target/surefire-reports/*.xml'
        }
    }
}