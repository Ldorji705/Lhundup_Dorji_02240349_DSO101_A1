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

        // Stage 6: Deploy - Trigger Render Deployments
        stage('Deploy') {
            steps {
                sh 'curl -X POST https://api.render.com/deploy/srv-d7vj411o3t8c73d0c960?key=3RBx2vWgbdE'
                sh 'curl -X POST https://api.render.com/deploy/srv-d7vjcij7uimc73eqq3ag?key=l03fYfCpbUU'
            }
        }

    }
}