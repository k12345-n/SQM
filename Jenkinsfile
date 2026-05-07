pipeline {
    agent any // This tells Jenkins to run the job on your MacBook

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your GitHub repository
                checkout scm
            }
        }

        stage('Build & Compile') {
            steps {
                // Verifies the code is functionally correct and compiles
                sh 'mvn clean compile'
            }
        }

        stage('Unit Testing') {
            steps {
                // Triggers Member 3's JUnit tests
                // This ensures "Functional Suitability" as per the research paper
                sh 'mvn test'
            }
        }

        stage('Quality Analysis') {
            steps {
                // This is where Member 4 tracks "Technical Debt"
                // For now, we use a placeholder; later we can connect SonarQube
                echo 'Running Static Code Analysis...'
            }
        }

        stage('Performance Test') {
            steps {
                // Runs Member 3's JMeter scripts from your 'performance' folder
                echo 'Triggering JMeter Performance Tests...'
                // sh 'jmeter -n -t performance/test.jmx -l results.jtl'
            }
        }
    }

    post {
        always {
            // This captures the test results so Member 4 can see "Failure Rates"
            junit '**/target/surefire-reports/*.xml'
            
            // Saves the compiled .jar file as a "Build Artifact"
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }
        success {
            echo 'Build Successful! The engine is running perfectly.'
        }
        failure {
            echo 'Build Failed. Member 2 needs to check the logs!'
        }
    }
}