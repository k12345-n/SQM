pipeline {
    agent any

    stages {
        stage('Build & Compile') {
            steps {
                sh '/opt/homebrew/bin/mvn clean compile'
            }
        }

        stage('Unit Testing') {
            steps {
                sh '/opt/homebrew/bin/mvn test'
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                sh '/usr/local/bin/npm install'
        	sh '/usr/local/bin/npx cypress run'
            }
        }

        stage('Quality Metrics') {
            steps {
                echo 'Capture code smells and technical debt'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }
    }
}