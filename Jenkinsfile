pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        
        stage('Build & Compile') {
            steps {
                dir('spring-petclinic-main') {
                    // Added jacoco:report here so the data exists for the sidebar
                    sh 'mvn clean package jacoco:report -DskipTests'
                }
            }
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    dir('spring-petclinic-main') {
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                        sh 'rm -rf cypress/results || true'
                        sh 'mkdir -p cypress/results'
                        
                        echo "Launching App..."
                        sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                        
                        // Wait for health check
                        sh '''
                            for i in {1..60}; do
                                if curl -s http://localhost:8081/actuator/health | grep -q \'"status":"UP"\'; then exit 0; fi
                                sleep 2
                            done
                            exit 1
                        '''
                        
                        // Run Cypress (using npx to avoid path/permission issues)
                        sh 'npm install'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081'
                    }
                }
            }
            post {
                always {
                    script {
                        sh 'lsof -t -i:8081 | xargs kill -9 || true'
                    }
                }
            }
        }
        
        stage('Performance Testing (JMeter)') {
            steps {
                dir('spring-petclinic-main') {
                    sh 'mkdir -p target'
                    sh 'jmeter -n -t src/test/jmeter/performance_test.jmx -l target/jmeter-results.jtl || true'
                }
            }
        }

        stage('Deploy (Local Docker Compose)') {
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
            // 1. JUnit Test Trend (Sidebar)
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            // 2. JaCoCo Coverage Trend (Sidebar)
            // It MUST look in the target folder where 'mvn jacoco:report' put it
            jacoco execPattern: 'spring-petclinic-main/target/jacoco.exec', 
                   classPattern: 'spring-petclinic-main/target/classes', 
                   sourcePattern: 'spring-petclinic-main/src/main/java'
            
            // 3. Performance Trend (Sidebar)
            perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
            
            // 4. HTML Reports
            publishHTML(target: [reportDir: 'spring-petclinic-main/cypress/reports', reportFiles: 'index.html', reportName: 'Cypress E2E Report'])
        }
    }
}