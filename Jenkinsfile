pipeline {
    agent any
    
    triggers {
        // Trigger automático mediante webhook de GitHub
        githubPush()
    }
    
    environment {
        // Directorio de despliegue del proyecto (dentro del contenedor Docker)
        DEPLOY_DIR = '/var/jenkins_home/deployed/cajita-pagos'
        PROJECT_NAME = 'Cajita de Pagos'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Obteniendo código desde el repositorio..."
                checkout scm
            }
        }
        
        stage('Validación') {
            steps {
                echo "Validando estructura del proyecto..."
                script {
                    // Verificar que existen los archivos principales
                    def requiredFiles = ['index.html', 'checkout.html', 'response.html', 'styles.css']
                    requiredFiles.each { file ->
                        if (!fileExists(file)) {
                            error("Archivo requerido no encontrado: ${file}")
                        }
                    }
                    echo "✓ Todos los archivos principales están presentes"
                }
            }
        }
        
        stage('Limpieza') {
            steps {
                echo "Preparando directorio de despliegue..."
                script {
                    // Crear directorio de despliegue si no existe y limpiar archivos antiguos
                    sh """
                        mkdir -p ${DEPLOY_DIR}
                        rm -f ${DEPLOY_DIR}/*
                    """
                    echo "✓ Directorio de despliegue preparado"
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "Preparando archivos para despliegue..."
                script {
                    // Para proyectos estáticos, simplemente copiamos los archivos
                    echo "Proyecto web estático - Sin proceso de build necesario"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Desplegando aplicación..."
                script {
                    // Copiar archivos al directorio de despliegue
                    sh """
                        cp -v *.html ${DEPLOY_DIR}/ || true
                        cp -v *.css ${DEPLOY_DIR}/ || true
                        cp -v *.js ${DEPLOY_DIR}/ || true
                    """
                    echo "✓ Archivos desplegados exitosamente en ${DEPLOY_DIR}"
                }
            }
        }
        
        stage('Verificación Post-Deploy') {
            steps {
                echo "Verificando despliegue..."
                script {
                    // Verificar que los archivos fueron copiados
                    def deployedFiles = sh(
                        script: "ls -1 ${DEPLOY_DIR}/*.html 2>/dev/null || echo 'No files'",
                        returnStdout: true
                    ).trim()
                    
                    if (deployedFiles && deployedFiles != 'No files') {
                        echo "✓ Despliegue verificado correctamente"
                        echo "Archivos desplegados:\n${deployedFiles}"
                        
                        // Mostrar resumen de archivos
                        sh "ls -lh ${DEPLOY_DIR}/"
                    } else {
                        error("No se encontraron archivos HTML en el directorio de despliegue")
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "=========================================="
            echo "✓ DESPLIEGUE COMPLETADO EXITOSAMENTE"
            echo "Proyecto: ${PROJECT_NAME}"
            echo "Directorio: ${DEPLOY_DIR}"
            echo "Rama: ${env.BRANCH_NAME ?: 'main'}"
            echo "Build: #${env.BUILD_NUMBER}"
            echo "=========================================="
        }
        
        failure {
            echo "=========================================="
            echo "✗ EL DESPLIEGUE FALLÓ"
            echo "Proyecto: ${PROJECT_NAME}"
            echo "Build: #${env.BUILD_NUMBER}"
            echo "=========================================="
        }
        
        always {
            echo "Pipeline ejecutado el: ${new Date()}"
            // Limpiar workspace si es necesario
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
    }
}