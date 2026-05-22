pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { 
                checkout scm 
            }
        }
        
        stage('Build, Test & Coverage') {
            steps {
                dir('spring-petclinic-main') {
                    script {
                        if (isUnix()) {
                            echo "Detected Mac/Linux environment. Compiling with localized test overrides..."
                            // FIX: Added skip parameter to prevent the PostgresIntegrationTests container loop crash
                            sh 'mvn clean package jacoco:report -Dspring.docker.compose.skip.in-tests=true'
                        } else {
                            echo "Detected Windows environment. Compiling with localized test overrides..."
                            bat 'mvn clean package jacoco:report -Dspring.docker.compose.skip.in-tests=true'
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
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        
                        sh 'rm -rf spring-petclinic-main/cypress/results || true'
                        sh 'mkdir -p spring-petclinic-main/cypress/results'
                        
                        echo "Launching Spring Boot App in background (Mac)..."
                        sh 'cd spring-petclinic-main && java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        echo "Waiting for server to become healthy on port 8081..."
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
                        
                        sh 'chmod -R 755 node_modules/.bin/cypress || true'
                        sh 'npm install --no-audit --no-fund'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'
                        
                    } else {
                        echo "Detected Windows environment. Running Windows E2E orchestration..."
                        bat(script: 'docker-compose down', returnStatus: true)
                        bat 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; exit 0"'
                        bat 'start "" /B "%JAVA_HOME%\\bin\\java" -jar spring-petclinic-main\\target\\spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081'
                        bat 'powershell -NoProfile -Command "for ($i=0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:8081/actuator/health -TimeoutSec 3 | Out-Null; Write-Host \'App is up on 8081\'; exit 0 } catch { Start-Sleep -Seconds 2 } }; Write-Host \'App did not start on 8081 within 120s\'; exit 1"' 
                        bat 'npm install'
                        bat 'if exist spring-petclinic-main\\cypress\\results rmdir /s /q spring-petclinic-main\\cypress\\results'
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
                        sh 'cd spring-petclinic-main && java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../jmeter-app.log 2>&1 &'
                        
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
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            jacoco execPattern: 'spring-petclinic-main/target/*.exec', classPattern: 'spring-petclinic-main/target/classes', sourcePattern: 'spring-petclinic-main/src/main/java'
            
            perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
            
            script {
                if (fileExists('spring-petclinic-main/cypress/reports')) {
                    publishHTML(target: [reportDir: 'spring-petclinic-main/cypress/reports', reportFiles: 'index.html', reportName: 'Cypress E2E Report'])
                } else {
                    echo "Skipping HTML report generation: cypress/reports folder missing."
                }
            }
        }
    }
}