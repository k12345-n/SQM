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
                            sh 'mvn clean package jacoco:report -DskipITs'
                        } else {
                            bat 'mvn clean package jacoco:report -DskipITs'
                        }
                    }
                }
            }
        }
        
        stage('Prepare & E2E Testing') {
            steps {
                dir('spring-petclinic-main') {
                    script {
                        // 1. Clean environment
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'rm -rf cypress/results || true'
                        sh 'mkdir -p cypress/results'
                        
                        // 2. Start application
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        // 3. Wait for app
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q \'"status":"UP"\'; then exit 0; fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        // 4. Install and run Cypress
                        sh 'npm install'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'
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
            // Records test results for the sidebar charts
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            // Collects coverage data
            jacoco execPattern: 'spring-petclinic-main/target/*.exec', classPattern: 'spring-petclinic-main/target/classes', sourcePattern: 'spring-petclinic-main/src/main/java'
            
            // Performance report
            script {
                if (fileExists('spring-petclinic-main/target/jmeter-results.jtl')) {
                    perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
                }
            }
        }
    }
}