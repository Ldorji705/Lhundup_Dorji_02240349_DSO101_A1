pipeline {
    agent any
    tools {
        nodejs 'to-do-list'
    }
    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'kinley',
                    url: 'https://github.com/Ldorji705/Lhundup_Dorji_02240349_DSO101_A1.git'
            }
        }

        stage('Install') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
            post {
                always {
                    junit 'backend/junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'App is deployed on Render.com via GitHub auto-deploy'
                echo 'Backend: https://be-todo-02240349.onrender.com'
                echo 'Frontend: https://fe-todo-02240349.onrender.com'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
    }
}