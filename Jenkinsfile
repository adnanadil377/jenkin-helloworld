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
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                bat 'npm run lint'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                bat 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add test command when you have tests configured
                // bat 'npm test'
                echo 'No tests configured yet'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                script {
                    bat 'docker build -t helloworld:${BUILD_NUMBER} .'
                    bat 'docker tag helloworld:${BUILD_NUMBER} helloworld:latest'
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