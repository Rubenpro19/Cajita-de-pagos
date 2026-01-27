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
        stage('Build') {
            steps {
                echo "Proyecto web estático: no requiere proceso de build"
            }
        }

        stage('Test') {
            steps {
                echo "Proyecto web estático: no se definieron pruebas automatizadas"
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
