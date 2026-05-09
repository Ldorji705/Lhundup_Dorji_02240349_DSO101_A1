pipeline {
    agent any

    tools {
        nodejs 'to-do-list'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'github-creds',
                url: 'https://github.com/Ldorji705/Lhundup_Dorji_02240349_DSO101_A1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint / Health Check') {
            steps {
                dir('backend') {
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'echo "Dependencies installed successfully"'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'echo "No tests configured yet - skipping"'
                }
            }
        }

        stage('Deploy (Simulation)') {
            steps {
                sh '''
                    echo "Starting deployment..."
                    echo "Backend is ready"
                    echo "You can now run: npm start inside backend/"
                '''
            }
        }
    }

    post {
        success {
            echo ' Pipeline executed successfully!'
        }

        failure {
            echo ' Pipeline failed. Check logs above.'
        }

        always {
            echo ' Pipeline finished.'
        }
    }
}