@echo off
REM Script de preparación del entorno de despliegue para Jenkins
REM Ejecutar este script antes de hacer el primer despliegue

echo ========================================
echo Configuracion de Entorno de Despliegue
echo Cajita de Pagos - Jenkins CI/CD
echo ========================================
echo.

REM Crear directorio de despliegue
set DEPLOY_DIR=C:\deployments\cajita-pagos

echo Creando directorio de despliegue...
if not exist "%DEPLOY_DIR%" (
    mkdir "%DEPLOY_DIR%"
    echo OK - Directorio creado: %DEPLOY_DIR%
) else (
    echo OK - Directorio ya existe: %DEPLOY_DIR%
)

echo.
echo Verificando permisos de escritura...
echo test > "%DEPLOY_DIR%\test.txt" 2>nul
if exist "%DEPLOY_DIR%\test.txt" (
    del "%DEPLOY_DIR%\test.txt"
    echo OK - Permisos de escritura verificados
) else (
    echo ERROR - No se tienen permisos de escritura en el directorio
    echo Por favor, ejecute este script como Administrador
    pause
    exit /b 1
)

echo.
echo ========================================
echo Configuracion completada exitosamente
echo ========================================
echo.
echo Directorio de despliegue: %DEPLOY_DIR%
echo.
echo Siguiente paso:
echo 1. Configurar el job en Jenkins siguiendo JENKINS_SETUP.md
echo 2. Configurar el webhook en GitHub
echo 3. Hacer push a la rama main para activar el despliegue
echo.
pause
