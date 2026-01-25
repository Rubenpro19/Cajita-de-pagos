// Job DSL Script para crear el pipeline automáticamente
// Este archivo es OPCIONAL - puedes usar esto si tienes el plugin Job DSL instalado
// O simplemente crear el job manualmente siguiendo JENKINS_SETUP.md

pipelineJob('cajita-pagos-pipeline') {
    description('Pipeline de CI/CD para el proyecto Cajita de Pagos')
    
    properties {
        githubProjectUrl('https://github.com/TU_USUARIO/TU_REPOSITORIO/')
    }
    
    triggers {
        githubPush()
    }
    
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url('https://github.com/TU_USUARIO/TU_REPOSITORIO.git')
                        credentials('github-credentials-id') // Cambiar por el ID de tus credenciales
                    }
                    branch('*/main')
                }
            }
            scriptPath('Jenkinsfile')
        }
    }
    
    logRotator {
        numToKeep(10)
        daysToKeep(30)
    }
}
