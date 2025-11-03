pipeline {
    agent any

    tools {
        sonarScanner 'MySonarQube'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        credentialsId: 'github-token',
                        url: 'https://github.com/rijulvohra04/sonarqube-pipeline.git'
                    ]]
                ])
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }
        
        stage('Test Network Connection') {
            steps {
                sh 'curl http://host.docker.internal:9000'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonarQube') {
                    sh '$SONAR_SCANNER_HOME/bin/sonar-scanner'
                }
            }
        }

        stage('Wait for Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t rijulvohra04/sonarqube-pipeline:latest .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push rijulvohra04/sonarqube-pipeline:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}