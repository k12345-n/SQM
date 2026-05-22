pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { 
                checkout scm 
            }
        }
        
        stage('Build & Compile') {
            steps {
                dir('spring-petclinic-main') {
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
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    if (isUnix()) {
                        echo "Detected Mac environment. Running macOS E2E orchestration..."
                        // 1. Clear any stale background process hanging on port 8081
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        
                        // 2. Clear previous JUnit results from any prior run
                        sh 'rm -rf cypress/results || true'
                        
                        // 3. Launch Spring Boot application in the background cleanly using Unix '&'
                        echo "Launching Spring Boot App in background (Mac)..."
                        sh 'java -jar spring-petclinic-main/target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > app.log 2>&1 &'
                        
                        // 4. Wait-for-health loop: Polls the actuator endpoint until awake (Max 120s)
                        echo "Waiting for server to become healthy on port 8081..."
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "App is up on 8081"
                                    exit 0
                                fi
                                sleep 2
                            done
                            echo "===== App did not start in 120s -- app.log below ====="
                            cat app.log
                            exit 1
                        '''
                        
                        // 5. Install dependencies and execute Cypress E2E tests
                        sh 'chmod -R 755 node_modules/.bin/cypress || true'
                        sh 'npm install --no-audit --no-fund'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'
                        
                    } else {
                        echo "Detected Windows environment. Running Windows E2E orchestration..."
                        // 1. Clear Windows stale environments
                        bat(script: 'docker-compose down', returnStatus: true)
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        
                        // 2. Launch background process using simplified pathing matching subfolder structure
                        echo "Launching Spring Boot App in background (Windows)..."
                        bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar spring-petclinic-main\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081'
                        
                        // 3. Health confirmation poll
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"' 
                        
                        // 4. Clean and execute tests
                        bat 'npm install'
                        bat 'if exist cypress\\results rmdir /s /q cypress\\results'
                        bat 'npx cypress run --config baseUrl=http://localhost:8081'
                    }
                }
            }
            post {
                always {
                    script {
                        echo "Cleaning up E2E environment: Stopping background server..."
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
                        echo "Detected Mac environment. Launching app instance for JMeter..."
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'java -jar spring-petclinic-main/target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > jmeter-app.log 2>&1 &'
                        
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "App is up on 8081 for Performance Run"
                                    exit 0
                                fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        echo "Running Unix JMeter performance plans..."
                        sh 'mkdir -p target'
                        sh '''
                            for file in spring-petclinic-main/src/test/jmeter/*.jmx; do
                                jmeter -n -t "$file" -l "target/jmeter-results.jtl"
                            done
                        '''
                    } else {
                        echo "Detected Windows environment. Running Windows JMeter test..."
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar spring-petclinic-main\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"'
                        bat '''
                            IF NOT EXIST target MD target
                            for %%f in (spring-petclinic-main\\src\\test\\jmeter\\*.jmx) do (
                                call jmeter -n -t "%%f" -l "target\\jmeter-results.jtl"
                            )
                        '''
                    }
                }
            }
            post {
                always {
                    script {
                        echo "Stopping the performance-test app on port 8081..."
                        if (isUnix()) {
                            sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        } else {
                            bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        }
                    }
                }
            }
        }

        stage('Deploy (Local Docker Compose)') {
            steps {
                echo 'Deploying integrated services matrix to local Docker Engine...'
                script {
                    if (isUnix()) {
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'docker-compose down || true'
                        sh 'docker-compose up -d --build'
                        
                        echo "Verifying local container service deployment health..."
                        sh '''
                            for i in {1..90}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then
                                    echo "Deployed container is active on port 8081"
                                    exit 0
                                fi
                                sleep 2
                            done
                            exit 1
                        '''
                    } else {
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat 'docker-compose down || rem'
                        bat 'docker-compose up -d --build'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 90; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'Deployed container is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; exit 1"'
                    }
                }
                echo 'Application is live and containerized at http://localhost:8081'
            }
        }
    }
    
    post {
        always {
            junit allowEmptyResults: true, testResults: 'cypress/results/*.xml, **/target/surefire-reports/*.xml'
            perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'target/jmeter-results.jtl'
            
            script {
                if (fileExists('cypress/reports')) {
                    publishHTML(target: [reportDir: 'cypress/reports', reportFiles: 'index.html', reportName: 'Cypress E2E Report'])
                } else {
                    echo "Skipping HTML report generation: cypress/reports folder missing."
                }
            }
        }
    }
}