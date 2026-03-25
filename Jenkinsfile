pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Ldorji705/Lhundup_Dorji_02240349_DSO101_A1.git'
            }
        }

        // 🔹 Backend
        stage('Install Backend') {
            steps {
                dir('Backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('Backend') {
                    sh 'npm test'
                }
            }
        }

        // 🔹 Frontend
        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // 🔹 Deploy (basic)
        stage('Deploy') {
            steps {
                echo "Deploy step (you can add Docker later)"
            }
        }
    }
}