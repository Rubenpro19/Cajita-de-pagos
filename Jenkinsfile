pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DEPLOY_DIR = '/var/jenkins_home/deployed/cajita-pagos'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    mkdir -p ${DEPLOY_DIR}
                    rm -f ${DEPLOY_DIR}/*
                    cp -v *.html ${DEPLOY_DIR}/ || true
                    cp -v *.css ${DEPLOY_DIR}/ || true
                    cp -v *.js ${DEPLOY_DIR}/ || true
                """
            }
        }
    }
}
