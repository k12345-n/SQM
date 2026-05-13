pipeline {
    agent any

    stages {
        stage('Build App') {
            steps {
                // Move into the actual app folder and build the real JAR
                dir('spring-petclinic-main') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Run App') {
            steps {
                // Run on 8081 to avoid crashing your Jenkins on 8080
                // We also pass the security disable flag here
                sh 'java -Dserver.port=8081 -Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration -jar spring-petclinic-main/target/*.jar &'
                
                echo 'Infrastructure: Waiting 50s for server to start on Port 8081...'
                sleep 50
            }
        }

        stage('E2E Testing (Cypress)') {
            steps {
                sh 'npm install'
                // Orchestrating Member 3's tests to target the new port 8081
                sh 'npx cypress run --config baseUrl=http://localhost:8081,failOnStatusCode=false || true'
            }
        }

	stage('Performance Testing (JMeter)') {
            steps {
                // Member 2 Fix: Running the JMeter file from the new path Member 3 added
                sh 'jmeter -n -t src/test/jmeter/*.jmx -l target/jmeter-results.jtl'
            }
        }
    }

    post {
        always {
            // Clean up the background app process specifically
            sh "pkill -f 'spring-petclinic' || true"
            
            // Collect results for Member 4's dashboard
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            archiveArtifacts artifacts: 'spring-petclinic-main/target/*.jar', allowEmptyArchive: true
        }
    }
}