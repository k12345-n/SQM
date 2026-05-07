pipeline {
    agent any

    stages {
        stage('Build & Compile') {
            steps {
                // Now works automatically due to your Global Path setting
                sh 'mvn clean compile'
            }
        }

        stage('Unit Testing') {
            steps {
                sh 'mvn test'
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                // Member 2: Orchestrating the automation for Member 3
                sh 'npm install'
                sh 'npx cypress run'
            }
        }

        stage('Quality Metrics') {
            steps {
                // Member 4's data point for Technical Debt
                echo 'Capture code smells and technical debt'
            }
        }
    }

    post {
        always {
            // Captures test data for Member 4's visualization
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }
    }
}