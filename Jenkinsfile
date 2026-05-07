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
                dir('spring-petclinic-main') {
            		sh 'mvn clean package -DskipTests'
        	}
            }
        }

        stage('Run Application') {
            steps {
                sh 'java -jar spring-petclinic-main/target/*.jar &'
        	echo 'Waiting 45 seconds for the real application to start...'
        	sleep 45
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
            sh "pkill -f 'target/.*.jar' || true"
            
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
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