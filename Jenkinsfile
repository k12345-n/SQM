pipeline {
    agent any
    
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        
        stage('Build, Test & Coverage') {
            steps {
                dir('spring-petclinic-main') {
                    sh 'mvn clean package jacoco:report -DskipITs'
                }
            }
        }
        
        stage('Prepare & E2E Testing') {
            steps {
                dir('spring-petclinic-main') {
                    // 1. Force a clean install of dependencies
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                    
                    // 2. Kill anything on port 8081
                    sh 'lsof -t -i:8081 | xargs kill -9 || true'
                    
                    // 3. Start app
                    sh 'java -jar target/spring-petclinic-4.0.0-SNAPSHOT.jar --server.port=8081 > ../app.log 2>&1 &'
                    
                    // 4. Wait for app
                    sh '''
                        for i in {1..60}; do
                            if curl -s http://localhost:8081/actuator/health | grep -q '"status":"UP"'; then exit 0; fi
                            sleep 2
                        done
                        exit 1
                    '''
                    
                    // 5. Run Cypress using absolute node_modules path
                    sh './node_modules/.bin/cypress run --config baseUrl=http://localhost:8081'
                }
            }
        }
    }
    
    post {
        always {
            // Record results from the sub-directory
            junit allowEmptyResults: true, testResults: 'spring-petclinic-main/cypress/results/*.xml, spring-petclinic-main/target/surefire-reports/*.xml'
            
            // Generate Coverage Graphs
            jacoco execPattern: 'spring-petclinic-main/target/*.exec', classPattern: 'spring-petclinic-main/target/classes', sourcePattern: 'spring-petclinic-main/src/main/java'
            
            // Performance Graph
            script {
                if (fileExists('spring-petclinic-main/target/jmeter-results.jtl')) {
                    perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'spring-petclinic-main/target/jmeter-results.jtl'
                }
            }
        }
    }
}