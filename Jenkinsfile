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
                    sh "docker image ls ${DOCKER_HUB_USER}/${DOCKER_IMAGE}"
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
                        sleep 5
                        docker ps --filter name=temp-test-${TAG}
                        docker rm -f temp-test-${TAG}
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
                                set -eu

                                LOCAL_REPO="$DOCKER_HUB_USER/$DOCKER_IMAGE"
                                TARGET_REPO="$DOCKERHUB_USERNAME/$DOCKER_IMAGE"

                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                                if [ "$LOCAL_REPO" != "$TARGET_REPO" ]; then
                                    echo "Retagging image from $LOCAL_REPO to $TARGET_REPO"
                                    docker tag "$LOCAL_REPO:$TAG" "$TARGET_REPO:$TAG"
                                    docker tag "$LOCAL_REPO:latest" "$TARGET_REPO:latest"
                                fi

                                docker push "$TARGET_REPO:$TAG"
                                docker push "$TARGET_REPO:latest"
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

