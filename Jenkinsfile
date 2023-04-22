node {
    def app
    stage('Checkout') {
        //Клонирование репозитория с исходным кодом приложения на рабочий узел Jenkins
        git url: 'https://github.com/Gakhramanzode/apod-website-node.git'
    }
    stage('npm build') {
        nodejs(nodeJSInstallationName: 'Node.js') {
            // Сборка приложения
            sh 'npm install'
        }
    }
    stage('npm test') {
        nodejs(nodeJSInstallationName: 'Node.js') {
            // Тестирование приложения
            sh 'npm test'
        }
    }
    stage('Docker build') {
        // Сборка приложения в Docker image
        script {
            app = docker.build("gakhramanzode/apod-website-node:1.0.${env.BUILD_ID}")
        }
    }
    stage('Docker push') {
        // Отправка приложения в Docker registry
        script {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                app.push()
            }
        }
    }
}