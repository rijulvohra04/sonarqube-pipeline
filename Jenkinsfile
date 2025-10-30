pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'      // Jenkins credentials ID
    SONARQUBE_NAME = 'MySonarQube'                 // name from Manage Jenkins > Configure System
    IMAGE_NAME = 'rijul0408/cicode-demo'           // your DockerHub repo
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        sh 'npm ci'
        sh 'npm test'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
      }
    }

    stage('SonarQube Analysis') {
     steps {
      withSonarQubeEnv("${SONARQUBE_NAME}") {
      sh '''
        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
          -Dsonar.projectKey=cicode-demo \
          -Dsonar.sources=src \
          -Dsonar.tests=test \
          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
      '''
    }
  }
}


    stage("Wait For Quality Gate") {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          script {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "Pipeline aborted due to quality gate: ${qg.status}"
            }
          }
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:latest ."
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${IMAGE_NAME}:latest
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker rm -f cicode-demo || true
          docker run -d --name cicode-demo -p 3000:3000 ${IMAGE_NAME}:latest
        '''
      }
    }
  }

  post {
    always {
      echo "Pipeline finished"
    }
  }
}
