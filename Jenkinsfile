pipeline {
    agent any
    
    triggers {
        // Trigger automático mediante webhook de GitHub
        githubPush()
    }
    
    environment {
        // Directorio de despliegue del proyecto
        DEPLOY_DIR = 'C:\\deployments\\cajita-pagos'
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
                    // Crear directorio de despliegue si no existe
                    bat """
                        if not exist "${DEPLOY_DIR}" mkdir "${DEPLOY_DIR}"
                        if exist "${DEPLOY_DIR}\\*" del /Q "${DEPLOY_DIR}\\*"
                    """
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
                    bat """
                        xcopy /Y /E /I *.html "${DEPLOY_DIR}"
                        xcopy /Y /E /I *.css "${DEPLOY_DIR}"
                        xcopy /Y /E /I *.js "${DEPLOY_DIR}"
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
                    def deployedFiles = bat(
                        script: "@echo off && dir /B \"${DEPLOY_DIR}\\*.html\"",
                        returnStdout: true
                    ).trim()
                    
                    if (deployedFiles) {
                        echo "✓ Despliegue verificado correctamente"
                        echo "Archivos desplegados:\n${deployedFiles}"
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