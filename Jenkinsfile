node {
    stage('Checkout') {
        git url: 'https://github.com/Gakhramanzode/apod-website-node.git'
    }
    stage('Build') {
        nodejs(nodeJSInstallationName: 'Node.js') {
            // Здесь указывается код для сборки приложения
            sh 'npm install'
        }
    }
    stage('Test') {
        nodejs(nodeJSInstallationName: 'Node.js') {
            // Здесь указывается код для тестирования приложения
            sh 'npm test'
        }
    }
    stage('Docker build') {
        // Здесь указывается код для сборки приложения в Docker Image
        steps {
            script {
                // Создаем новый образ из Dockerfile в папке docker
                def app = docker.build("apod-website-node:1.0.${env.BUILD_ID}")
            }
        }
    }
    stage('Deploy') {
        // Здесь указывается код для отправки приложения в Docker registry
    }
}