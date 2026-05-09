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

        stage('Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'echo Deployment Stage'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }

        success {
            echo 'Pipeline executed successfully!'
        }
    }
}