pipeline {
    agent any
    
    // Environment variables
    environment {
        // Change these to match your Docker Hub repository details
        DOCKER_IMAGE = 'jenkins-helloworld'
        DOCKER_CREDS_ID = 'jenkinslab5' // ID of credentials in Jenkins
        DOCKER_HUB_USER = 'adnan23bcs35' // Replace with your Docker Hub username
        TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the SCM automatically
                checkout scm
            }
        }
        
       

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}..."
                    sh "docker build -t ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG} -t ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    echo "Testing if the container runs..."
                    // Start the container, wait a moment, and ensure it is up
                    sh """
                        docker run -d --name temp-test-${TAG} -p 8085:80 ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}
                       
                    """
                }
            }
        }
    stage('Push Docker Image') {
    steps {
        script {
            echo "Pushing Docker Image to Docker Hub..."

            withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                sh '''
                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                docker push "$DOCKERHUB_USERNAME/$DOCKER_IMAGE:$TAG"
                docker push "$DOCKERHUB_USERNAME/$DOCKER_IMAGE:latest"
                docker logout
                '''
            }
        }
    }
}
        
    }

    post {
        always {
            echo "Pipeline finished."
            // Clean up workspace
            cleanWs()
            // Clean up local images
        }
        success {
            echo "Build and Push was successful!"
        }
        failure {
            echo "Build or Push failed."
        }
    }
}

