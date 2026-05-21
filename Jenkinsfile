pipeline {
    agent any
    stages {
        stage('Source Code Management') {
            steps { checkout scm }
        }
        stage('Build & Compile') {
            steps {
                dir('spring-petclinic-main') {
                    script {
                        if (isUnix()) {
                            sh 'mvn clean package -DskipTests'
                        } else {
                            bat 'mvn clean package -DskipTests'
                        }
                    }
                }
            }
        }
        stage('Run App') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'java -Dserver.port=8081 -Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration -jar spring-petclinic-main/target/*.jar &'
                    } else {
                        powershell 'Start-Process java -ArgumentList "-Dserver.port=8081 -Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration -jar spring-petclinic-main/target/spring-petclinic-4.0.0-SNAPSHOT.jar"'
                    }
                }
                echo 'Waiting 50s for server on Port 8081...'
                sleep 50
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
                            for file in spring-petclinic-main/src/test/jmeter/*.jmx; do
                                jmeter -n -t "$file" -l "target/jmeter-results.jtl"
                            done
                        '''
                    } else {
                        bat '''
                            IF NOT EXIST target MD target
                            for %%f in (spring-petclinic-main\\src\\test\\jmeter\\*.jmx) do (
                                jmeter -n -t "%%f" -l "target\\jmeter-results.jtl"
                            )
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                if (isUnix()) {
                    sh "pkill -f 'spring-petclinic' || true"
                } else {
                    bat 'wmic process where "commandline like \'%%spring-petclinic%%\'" call terminate || label true'
                }
            }
            
            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
            perfReport errorFailedThreshold: 100, errorUnstableThreshold: 80, sourceDataFiles: 'target/jmeter-results.jtl'
            
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