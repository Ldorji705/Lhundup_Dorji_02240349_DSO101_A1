pipeline {
    agent any
    tools {
        nodejs 'to-do-list'
    }
    stages {

        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Ldorji705/Lhundup_Dorji_02240349_DSO101_A1.git'
            }
        }

        // Stage 2: Install Backend Dependencies
        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        // Stage 3: Install Frontend Dependencies
        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        // Stage 4: Build Frontend
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // Stage 5: Run Backend Tests
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit '**/junit.xml'
                }
            }
        }

        // Stage 6: Deploy - Build and Push Docker Images
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        docker.build('ldorji705/be-todo:02240349', './backend').push()
                        docker.build('ldorji705/fe-todo:02240349', './frontend').push()
                    }
                }
            }
        }

    }
}