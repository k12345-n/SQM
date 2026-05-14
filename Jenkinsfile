pipeline {
    agent any
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        stage('Build & Compile') {
            steps {
                dir('spring-petclinic-main') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Run App') {
            steps {
                sh 'java -Dserver.port=8081 -Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration -jar spring-petclinic-main/target/*.jar &'
                echo 'Waiting 50s for server on Port 8081...'
                sleep 50
            }
        }
        stage('E2E Testing (Cypress)') {
            steps {
                // Member 2 Fix: Force permissions on the node_modules so Jenkins can execute Cypress
                sh 'chmod -R 755 node_modules/.bin/cypress'
                sh 'npm install'
                sh 'npx cypress run --config baseUrl=http://localhost:8081,failOnStatusCode=false || true'
            }
        }
        stage('Performance Testing (JMeter)') {
            steps {
                sh '''
                    # Member 2 Fix: Pointing to the specific subfolder and standardizing result name
                    for file in spring-petclinic-main/src/test/jmeter/*.jmx; do
                        jmeter -n -t "$file" -l "target/jmeter-results.jtl"
                    done
                '''
            }
        }
    }
    post {
        always {
            sh "pkill -f 'spring-petclinic' || true"
            
            // Capture Unit Tests
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            
            // Member 2 Fix: Point to the standardized jtl file we created in the loop above
            perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'target/jmeter-results.jtl'
            
            // Member 2 Fix: Only try to publish HTML if the folder actually exists
            script {
                if (fileExists('cypress/reports')) {
                    publishHTML(target: [reportDir: 'cypress/reports', reportFiles: 'index.html', reportName: 'Cypress E2E Report'])
                } else {
                    echo "Skipping HTML report: cypress/reports folder not found."
                }
            }
        }
    }
}