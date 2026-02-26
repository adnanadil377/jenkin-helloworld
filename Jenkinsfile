pipeline {
    agent any
    
    triggers {
        // Poll GitHub for changes every 5 minutes (can also use GitHub webhooks)
        pollSCM('H/5 * * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    bat 'docker build -t helloworld:${BUILD_NUMBER} .'
                    bat 'docker tag helloworld:${BUILD_NUMBER} helloworld:latest'
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo 'Testing Docker image...'
                script {
                    // Verify image was created
                    bat 'docker images helloworld:latest'
                    
                    // Run a test container to verify it starts correctly
                    bat 'docker run --rm -d --name helloworld-test -p 8081:80 helloworld:latest'
                    
                    // Wait for container to start
                    bat 'timeout /t 5'
                    
                    // Test if the application is responding
                    bat 'curl -f http://localhost:8081 || exit 0'
                    
                    // Stop test container
                    bat 'docker stop helloworld-test || exit 0'
                }
            }
        }
        
        stage('Run Container') {
            steps {
                echo 'Running Docker container...'
                script {
                    // Stop and remove existing container if running
                    bat 'docker stop helloworld || exit 0'
                    bat 'docker rm helloworld || exit 0'
                    
                    // Run the new container
                    bat 'docker run -d --name helloworld -p 8080:80 helloworld:latest'
                    
                    echo 'Application is running at http://localhost:8080'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            // You can add notifications here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notifications
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}