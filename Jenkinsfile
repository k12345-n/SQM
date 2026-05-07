pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Member 2: Pulling latest code from GitHub Desktop sync
                checkout scm
            }
        }

        stage('Build & Compile') {
            steps {
                // Builds the executable JAR file for the application
                // -DskipTests is used here because we run them in the next stages
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Run Application') {
            steps {
                // Member 2: Orchestrating the environment
                // Starts the Spring Boot app in the background (&)
                // This prevents the 403 Forbidden error in Cypress
                sh 'java -jar target/*.jar &'
                
                // Wait 20 seconds for the Spring Boot server to fully wake up
                echo 'Waiting for Spring PetClinic to start on port 8080...'
                sleep 20 
            }
        }

        stage('Unit Testing') {
            steps {
                // Triggers Member 3's JUnit tests (if any in src/test)
                sh 'mvn test'
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                // Member 2: Triggering Member 3's Cypress and Security suite
                // Installs dependencies from the package.json you moved
                sh 'npm install'
                // Runs all 8 test files, including the security injection tests
                sh 'npx cypress run'
            }
        }

        stage('Quality Metrics') {
            steps {
                // Member 4: Gathering data for the SQM report
                echo 'Finalizing metrics for Build Success and Security Debt...'
            }
        }
    }

    post {
        always {
            // Member 2: Ensuring the background app is closed after tests finish
            // This prevents "Address already in use" errors on the next build
            sh 'pkill -f java || true'
            
            // Captures JUnit results for Member 4's Trend Charts
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            
            // Archives the final JAR file for Member 1's records
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }
        success {
            echo 'SQM Pipeline Complete: Automation Engine is Green!'
        }
        failure {
            echo 'Pipeline Failed: Member 2 should check the Console Output.'
        }
    }
}