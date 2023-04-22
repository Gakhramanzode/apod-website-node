node {
    def app
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
        script {
            app = docker.build("gakhramanzode/apod-website-node:1.0.${env.BUILD_ID}")
        }
    }
    stage('Deploy') {
        // Здесь указывается код для отправки приложения в Docker registry
        script {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                app.push()
            }
        }
    }
}