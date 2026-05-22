pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        
        stage('Build, Test & Coverage') {
            steps {
                dir('spring-petclinic-main') {
                    // Use -DskipITs to prevent Docker/Postgres container errors
                    sh 'mvn clean package jacoco:report -DskipITs'
                }
            }
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                dir('spring-petclinic-main') {
                    script {
                        // 1. Clean stale processes
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        
                        // 2. Install dependencies (if node_modules is missing, this creates it)
                        sh 'npm install'
                        
                        // 3. Start app
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        // 4. Health check
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q \'"status":"UP"\'; then exit 0; fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        // 5. Run Cypress safely
                        // We use 'npx' directly; it automatically finds the cypress binary 
                        // in node_modules, bypassing permission/path issues.
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                dir('spring-petclinic-main') {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
    
    post {
        always {
            // Pathing matches your exact folder structure
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