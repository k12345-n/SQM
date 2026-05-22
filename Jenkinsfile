pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        
        stage('Build, Test & Coverage') {
            steps {
                dir('spring-petclinic-main') {
                    // Skip ITs to prevent database container crashes
                    script {
                        if (isUnix()) {
                            sh 'mvn clean package jacoco:report -DskipITs'
                        } else {
                            bat 'mvn clean package jacoco:report -DskipITs'
                        }
                    }
                }
            }
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    dir('spring-petclinic-main') {
                        // 1. Reset environment
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'rm -rf cypress/results || true'
                        sh 'mkdir -p cypress/results'
                        
                        // 2. Start application
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        // 3. Health check
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then exit 0; fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        // 4. Force permissions and run tests
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
            // These lines generate the trend graphs on the left sidebar
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            // This captures the coverage data and renders the Coverage Trend widget
            jacoco execPattern: 'spring-petclinic-main/target/*.exec', classPattern: 'spring-petclinic-main/target/classes', sourcePattern: 'spring-petclinic-main/src/main/java'
            
            // Performance Trend widget
            script {
                if (fileExists('spring-petclinic-main/target/jmeter-results.jtl')) {
                    perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
                }
            }
        }
    }
}