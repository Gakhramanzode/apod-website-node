pipeline {
    agent any
    environment {
        // Указываем адрес и порт докер демона
        DOCKER_HOST = 'tcp://docker:2376'
        // Указываем путь к сертификатам докера
        DOCKER_CERT_PATH = '/certs/client'
        DOCKER_TLS_VERIFY = '1'
    }
    stages {
        stage('Checkout') {
            steps {
                // Получаем код из репозитория
                git url: 'https://github.com/Gakhramanzode/apod-website-node.git'
            }
        }
        stage('Build') {
            steps {
                // Собираем приложение
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                // Тестируем приложение
                sh 'npm test'
            }
        }
        stage('Docker build') {
            steps {
                // Собираем докер образ из Dockerfile
                script {
                    def app = docker.build("apod-website-node:1.0.${env.BUILD_ID}", ".")
                }
            }
        }
        stage('Docker push') {
            steps {
                // Отправляем докер образ в репозиторий
                // script {
                //     docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                //         app.push("${env.BRANCH_NAME}")
                //         app.push("latest")
                //     }
                // }
            }
        }
    }
}