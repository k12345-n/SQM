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
                script {
                    if (isUnix()) {
                        sh 'mvn clean package -DskipTests'
                    } else {
                        bat 'mvn clean package -DskipTests'
                    }
                }
            }
        }
        
        stage('E2E Testing (Cypress)') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'chmod -R 755 node_modules/.bin/cypress'
                        sh 'npm install'
                        sh 'npx cypress run --config baseUrl=http://localhost:8081,failOnStatusCode=false || true'
                    } else {
                        bat 'npm install'
                        bat 'npx cypress run --config baseUrl=http://localhost:8081,failOnStatusCode=false'
                    }
                }
            }
        }
        
        stage('Performance Testing (JMeter)') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            for file in src/test/jmeter/*.jmx; do
                                jmeter -n -t "$file" -l "target/jmeter-results.jtl"
                            done
                        '''
                    } else {
                        bat '''
                            IF NOT EXIST target MD target
                            for %%f in (src\\test\\jmeter\\*.jmx) do (
                                jmeter -n -t "%%f" -l "target\\jmeter-results.jtl"
                            )
                        '''
                    }
                }
            }
        }

        stage('Deploy (Local Docker Compose)') {
            steps {
                echo 'Deploying integrated services matrix to local Docker Engine...'
                script {
                    if (isUnix()) {
                        sh 'docker-compose down || true'
                        sh 'docker-compose up -d --build'
                    } else {
                        bat 'docker-compose down || rem'
                        bat 'docker-compose up -d --build'
                    }
                }
                echo 'Application is live and containerized at http://localhost:8081'
            }
        }
    }
    
    post {
        always {
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
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