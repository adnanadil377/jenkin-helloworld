pipeline {
    agent any
    
    // Environment variables
    environment {
        // Change these to match your Docker Hub repository details
        DOCKER_IMAGE = 'jenkins-helloworld'
        DOCKER_CREDS_ID = 'dockerhub-token' // Jenkins credential kind must be 'Username with password'
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

            try {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                    sh '''
                                set -eu

                                LOCAL_REPO="$DOCKER_HUB_USER/$DOCKER_IMAGE"
                                TARGET_REPO="$DOCKERHUB_USERNAME/$DOCKER_IMAGE"

                                echo "[DEBUG] Jenkins build number: $BUILD_NUMBER"
                                echo "[DEBUG] Workspace: $WORKSPACE"
                                echo "[DEBUG] Local repo: $LOCAL_REPO"
                                echo "[DEBUG] Target repo: $TARGET_REPO"
                                echo "[DEBUG] TAG: $TAG"
                                echo "[DEBUG] Docker Hub username from credentials: $DOCKERHUB_USERNAME"

                                if [ -z "$DOCKERHUB_USERNAME" ]; then
                                    echo "[ERROR] DOCKERHUB_USERNAME is empty from credentials id: $DOCKER_CREDS_ID"
                                    exit 1
                                fi

                                if [ -z "$DOCKERHUB_TOKEN" ]; then
                                    echo "[ERROR] DOCKERHUB_TOKEN is empty from credentials id: $DOCKER_CREDS_ID"
                                    exit 1
                                fi

                                echo "[DEBUG] Token received (length only): ${#DOCKERHUB_TOKEN}"
                                echo "[DEBUG] Docker client version:"
                                docker --version

                                echo "[DEBUG] Checking local image tags before push:"
                                docker image ls "$LOCAL_REPO" || true
                                docker image inspect "$LOCAL_REPO:$TAG" >/dev/null 2>&1 || { echo "[ERROR] Local image missing: $LOCAL_REPO:$TAG"; exit 1; }
                                docker image inspect "$LOCAL_REPO:latest" >/dev/null 2>&1 || { echo "[ERROR] Local image missing: $LOCAL_REPO:latest"; exit 1; }

                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                                echo "[DEBUG] Docker login succeeded"

                                if [ "$LOCAL_REPO" != "$TARGET_REPO" ]; then
                                    echo "Retagging image from $LOCAL_REPO to $TARGET_REPO"
                                    docker tag "$LOCAL_REPO:$TAG" "$TARGET_REPO:$TAG"
                                    docker tag "$LOCAL_REPO:latest" "$TARGET_REPO:latest"
                                fi

                                echo "[DEBUG] Image tags that will be pushed:"
                                docker image ls "$TARGET_REPO" || true

                                docker push "$TARGET_REPO:$TAG"
                                docker push "$TARGET_REPO:latest"
                docker logout
                '''
                }
            } catch (Exception ex) {
                echo "[ERROR] Could not bind credentials with id '${DOCKER_CREDS_ID}' as Username with password."
                echo "[ERROR] Ensure Jenkins credential kind is 'Username with password' and password is Docker Hub token."
                echo "[ERROR] Original exception: ${ex.getMessage()}"
                throw ex
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

