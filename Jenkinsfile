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
    stage('Deploy') {
        // Здесь указывается код для отправки приложения в Docker registry
    }
}