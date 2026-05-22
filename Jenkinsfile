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
                        // Skip integration tests (-DskipITs) to prevent Docker/Database errors
                        // Run jacoco:report to generate the metrics file
                        sh 'mvn clean package jacoco:report -DskipITs'
                    }
                }
            }
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    dir('spring-petclinic-main') {
                        // 1. Clean environment
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'rm -rf cypress/results || true'
                        sh 'mkdir -p cypress/results'
                        
                        // 2. Install dependencies
                        sh 'npm install'
                        
                        // 3. Start app in background
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        // 4. Wait for health check (max 120s)
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q \'"status":"UP"\'; then exit 0; fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        // 5. Fix permissions for Cypress binary and run
                        sh 'chmod -R +x node_modules/.bin/'
                        sh './node_modules/.bin/cypress run --config baseUrl=http://localhost:8081'
                    }
                }
            }
        }
        
        stage('Deploy (Local Docker Compose)') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }
    
    post {
        always {
            // These lines parse your results and render the charts on the sidebar
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            jacoco execPattern: 'spring-petclinic-main/target/*.exec', classPattern: 'spring-petclinic-main/target/classes', sourcePattern: 'spring-petclinic-main/src/main/java'
            
            script {
                if (fileExists('spring-petclinic-main/target/jmeter-results.jtl')) {
                    perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
                }
            }
        }
    }
}