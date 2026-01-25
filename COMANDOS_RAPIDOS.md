# 🚀 Guía Rápida de Comandos - Jenkins CI/CD

## 📋 Pasos Rápidos de Configuración

### 1. Preparar Directorio de Despliegue
```batch
setup-deploy-dir.bat
```

### 2. Configurar ngrok (si Jenkins está local)

#### Opción A: Usar el script automático
```powershell
.\setup-ngrok.ps1
```

#### Opción B: Configuración manual
```powershell
# Crear cuenta en https://dashboard.ngrok.com/signup
# Obtener authtoken de https://dashboard.ngrok.com/get-started/your-authtoken

# Configurar authtoken
ngrok config add-authtoken TU_AUTHTOKEN

# Iniciar ngrok
ngrok http 8080
```

### 3. Configurar Jenkins y GitHub
Ver instrucciones detalladas en [JENKINS_SETUP.md](JENKINS_SETUP.md)

---

## 🔧 Comandos Útiles

### ngrok
```powershell
# Iniciar ngrok
ngrok http 8080

# Verificar configuración
ngrok config check

# Ver status
ngrok diagnose
```

### Git (para probar el pipeline)
```bash
# Hacer cambios y probar despliegue automático
git add .
git commit -m "Prueba de CI/CD"
git push origin main
```

### Docker (si usas Jenkins en Docker)
```powershell
# Ver contenedores corriendo
docker ps

# Ver logs de Jenkins
docker logs <container_id>

# Acceder a Jenkins
# http://localhost:8080
```

---

## 🌐 URLs Importantes

### Jenkins Local
- URL: `http://localhost:8080`
- Webhook (con ngrok): `https://TU-URL.ngrok-free.app/github-webhook/`

### GitHub
- Repositorio: `https://github.com/TU_USUARIO/TU_REPOSITORIO`
- Webhooks: `https://github.com/TU_USUARIO/TU_REPOSITORIO/settings/hooks`

### ngrok
- Dashboard: `https://dashboard.ngrok.com`
- Authtoken: `https://dashboard.ngrok.com/get-started/your-authtoken`

---

## ✅ Checklist Rápido

- [ ] Jenkins corriendo y accesible
- [ ] Directorio de despliegue creado
- [ ] ngrok configurado (si es necesario)
- [ ] Job de Pipeline creado en Jenkins
- [ ] Webhook configurado en GitHub
- [ ] Primera prueba manual exitosa
- [ ] Prueba automática (push) exitosa

---

## 🆘 Troubleshooting Rápido

### Error: ngrok authentication failed
```powershell
# Ejecutar:
.\setup-ngrok.ps1
# O configurar manualmente:
ngrok config add-authtoken TU_AUTHTOKEN
```

### Error: Cannot create directory
```batch
# Ejecutar como Administrador:
setup-deploy-dir.bat
```

### Webhook no funciona
1. Verificar que ngrok esté corriendo
2. Verificar la URL en GitHub webhooks
3. Revisar "Recent Deliveries" en GitHub

### Pipeline falla
1. Ver "Console Output" en Jenkins
2. Verificar credenciales de Git
3. Verificar que Jenkinsfile existe en el repo

---

## 📚 Documentación Completa

- [JENKINS_SETUP.md](JENKINS_SETUP.md) - Guía completa paso a paso
- [README_JENKINS.md](README_JENKINS.md) - Resumen del proyecto

---

## 🎯 Workflow Típico

```
1. Desarrollar → 2. Commit → 3. Push → 4. GitHub webhook → 5. Jenkins build → 6. Deploy automático
```

**¡Listo para usar!** 🚀
