# 🚀 Guía Rápida de Inicio - Jenkins CI/CD

## Archivos Creados

1. **`Jenkinsfile`** - Pipeline de despliegue automático
2. **`JENKINS_SETUP.md`** - Documentación completa de configuración
3. **`setup-deploy-dir.bat`** - Script para preparar el directorio de despliegue
4. **`jenkins-job-dsl.groovy`** - (Opcional) Configuración automática del job

## 🎯 Inicio Rápido (3 pasos)

### 1️⃣ Preparar el Entorno
Ejecutar como Administrador:
```batch
setup-deploy-dir.bat
```

### 2️⃣ Configurar Jenkins
Seguir las instrucciones en **JENKINS_SETUP.md** para:
- Crear el job de Pipeline en Jenkins
- Configurar el webhook en GitHub

### 3️⃣ Probar el Despliegue
```bash
# Hacer cualquier cambio
git add .
git commit -m "Test CI/CD"
git push origin main
```

Jenkins desplegará automáticamente los cambios en:
```
C:\deployments\cajita-pagos
```

## 📖 Documentación Completa

Ver **[JENKINS_SETUP.md](JENKINS_SETUP.md)** para instrucciones detalladas paso a paso.

## ⚡ Características del Pipeline

- ✅ Despliegue automático en cada push a `main`
- ✅ Validación de archivos del proyecto
- ✅ Limpieza automática del directorio de despliegue
- ✅ Verificación post-despliegue
- ✅ Notificaciones de éxito/fallo

## 🔧 Soporte

Si tienes problemas, revisa la sección de **Troubleshooting** en JENKINS_SETUP.md

---

**¡Listo para usar!** 🎉
