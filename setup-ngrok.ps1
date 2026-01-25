# Script de configuración de ngrok para Jenkins
# Ejecutar con PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración de ngrok para Jenkins  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ngrok está instalado
Write-Host "Verificando instalación de ngrok..." -ForegroundColor Yellow
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokInstalled) {
    Write-Host "ERROR: ngrok no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones de instalación:" -ForegroundColor Yellow
    Write-Host "1. Descargar desde: https://ngrok.com/download" -ForegroundColor White
    Write-Host "2. Instalar con chocolatey: choco install ngrok" -ForegroundColor White
    Write-Host ""
    
    $install = Read-Host "¿Deseas instalar con chocolatey? (s/n)"
    if ($install -eq 's' -or $install -eq 'S') {
        Write-Host "Instalando ngrok con chocolatey..." -ForegroundColor Yellow
        choco install ngrok -y
    } else {
        Write-Host "Por favor, instala ngrok manualmente y ejecuta este script de nuevo" -ForegroundColor Yellow
        pause
        exit
    }
}

Write-Host "OK - ngrok está instalado" -ForegroundColor Green
Write-Host ""

# Solicitar authtoken
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuración del authtoken" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para obtener tu authtoken:" -ForegroundColor Yellow
Write-Host "1. Crea una cuenta en: https://dashboard.ngrok.com/signup" -ForegroundColor White
Write-Host "2. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor White
Write-Host "3. Copia tu authtoken" -ForegroundColor White
Write-Host ""

$authtoken = Read-Host "Ingresa tu authtoken de ngrok"

if ([string]::IsNullOrWhiteSpace($authtoken)) {
    Write-Host "ERROR: No se ingresó ningún authtoken" -ForegroundColor Red
    pause
    exit
}

# Configurar authtoken
Write-Host ""
Write-Host "Configurando authtoken..." -ForegroundColor Yellow
try {
    & ngrok config add-authtoken $authtoken
    Write-Host "OK - Authtoken configurado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "ERROR: No se pudo configurar el authtoken" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuración completada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar ngrok y exponer Jenkins:" -ForegroundColor Yellow
Write-Host "  ngrok http 8080" -ForegroundColor White
Write-Host ""
Write-Host "Luego usa la URL proporcionada en tu webhook de GitHub" -ForegroundColor Yellow
Write-Host "Ejemplo: https://abc123.ngrok-free.app/github-webhook/" -ForegroundColor White
Write-Host ""

$start = Read-Host "¿Deseas iniciar ngrok ahora? (s/n)"
if ($start -eq 's' -or $start -eq 'S') {
    Write-Host ""
    Write-Host "Iniciando ngrok..." -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para detener ngrok" -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 2
    & ngrok http 8080
} else {
    Write-Host ""
    Write-Host "Puedes iniciar ngrok manualmente cuando lo necesites con:" -ForegroundColor Yellow
    Write-Host "  ngrok http 8080" -ForegroundColor White
    Write-Host ""
}
