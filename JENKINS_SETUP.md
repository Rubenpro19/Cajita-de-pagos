# Configuración de Jenkins CI/CD para Cajita de Pagos

## 📋 Requisitos Previos Completados
- ✓ Jenkins ejecutándose en Docker
- ✓ Plugin de Git instalado
- ✓ Plugin de Pipeline instalado
- ✓ Credenciales del repositorio configuradas en Jenkins

---

## 🚀 Configuración del Pipeline en Jenkins

### Paso 1: Crear un Nuevo Job en Jenkins

1. **Acceder a Jenkins** a través del navegador
2. **Click en "New Item"** o "Nueva Tarea"
3. **Configurar el Job:**
   - Nombre: `cajita-pagos-pipeline` (o el nombre que prefieras)
   - Tipo: **Pipeline**
   - Click en "OK"

### Paso 2: Configurar el Pipeline

En la página de configuración del job:

#### **General**
- ☑ Marcar "GitHub project"
- Project url: `https://github.com/TU_USUARIO/TU_REPOSITORIO/`

#### **Build Triggers**
- ☑ Marcar "GitHub hook trigger for GITScm polling"
  - Esto permite que GitHub active el build automáticamente

#### **Pipeline**
Configurar la sección Pipeline:

- **Definition:** `Pipeline script from SCM`
- **SCM:** `Git`
- **Repository URL:** `https://github.com/TU_USUARIO/TU_REPOSITORIO.git`
- **Credentials:** Seleccionar las credenciales configuradas previamente
- **Branch Specifier:** `*/main`
- **Script Path:** `Jenkinsfile`

**Guardar** la configuración

---

## 🔗 Configuración del Webhook en GitHub

### Paso 1: Obtener la URL de Jenkins

Tu URL de webhook será:
```
http://TU_IP_JENKINS:PUERTO/github-webhook/
```

**Ejemplo:**
```
http://localhost:8080/github-webhook/
```

> **Nota:** Si Jenkins está en Docker localmente, necesitarás usar una herramienta como **ngrok** para exponer Jenkins a internet, o configurar Jenkins en un servidor accesible públicamente.

### Paso 2: Configurar el Webhook en GitHub

1. **Ir a tu repositorio en GitHub**
2. **Click en "Settings"** (Configuración)
3. **Click en "Webhooks"** en el menú lateral
4. **Click en "Add webhook"**
5. **Configurar el webhook:**
   ```
   Payload URL: http://TU_IP_JENKINS:PUERTO/github-webhook/
   Content type: application/json
   Secret: (dejar vacío o configurar uno si lo deseas)
   SSL verification: Enable (si usas HTTPS)
   ```
6. **En "Which events would you like to trigger this webhook?":**
   - ☑ Seleccionar "Just the push event"
7. **☑ Marcar "Active"**
8. **Click en "Add webhook"**

### Verificación del Webhook

- GitHub mostrará un ✓ verde si el webhook se configuró correctamente
- Puedes hacer click en el webhook y ver el historial de entregas en "Recent Deliveries"

---

## 🛠️ Opciones para Exponer Jenkins (si está en Docker local)

Si Jenkins está corriendo localmente en Docker, tienes estas opciones para que GitHub lo alcance:

### Opción 1: Usar ngrok (Recomendado para pruebas)

#### Paso 1: Crear cuenta en ngrok
1. Ir a https://dashboard.ngrok.com/signup
2. Crear una cuenta gratuita (puedes usar Google/GitHub)
3. Verificar tu email

#### Paso 2: Obtener el authtoken
1. Ir a https://dashboard.ngrok.com/get-started/your-authtoken
2. Copiar tu authtoken (algo como: `2abc123def456...`)

#### Paso 3: Instalar ngrok
```powershell
# Opción A: Descargar desde https://ngrok.com/download
# Opción B: Usar chocolatey
choco install ngrok
```

#### Paso 4: Configurar el authtoken
```powershell
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

#### Paso 5: Exponer Jenkins
```powershell
ngrok http 8080
```

Esto te dará una URL pública como:
```
https://abc123.ngrok-free.app
```

Usa esta URL para configurar el webhook en GitHub:
```
https://abc123.ngrok-free.app/github-webhook/
```

> **Notas:**
> - La URL de ngrok cambia cada vez que reinicias (plan gratuito)
> - Plan de pago: URLs persistentes y más características
> - Mantén ngrok ejecutándose mientras trabajas

---

### Opción 2: Usar localtunnel (Alternativa sin registro)

```powershell
# Instalar localtunnel
npm install -g localtunnel

# Exponer Jenkins
lt --port 8080
```

Te dará una URL como: `https://random-name-123.loca.lt`

---

### Opción 3: Jenkins en servidor público (Recomendado para producción)

Para entornos de producción, considera:

1. **AWS EC2**: Desplegar Jenkins en una instancia EC2
2. **Azure VM**: Usar una máquina virtual de Azure
3. **DigitalOcean Droplet**: Servidor VPS económico
4. **Railway/Render**: Plataformas PaaS con planes gratuitos

#### Ejemplo con Docker en servidor público:
```bash
# En el servidor
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Webhook URL: `http://TU_IP_PUBLICA:8080/github-webhook/`

---

### Opción 4: Polling en lugar de Webhooks (Sin exposición pública)

Si no puedes exponer Jenkins, usa **polling** en lugar de webhooks:

#### En la configuración del job de Jenkins:
- **NO marcar** "GitHub hook trigger for GITScm polling"
- **SÍ marcar** "Poll SCM"
- Schedule: `H/5 * * * *` (revisa cada 5 minutos)

**Ventajas:**
- No necesitas exponer Jenkins a internet
- No necesitas ngrok

**Desventajas:**
- Retraso de hasta 5 minutos en detectar cambios
- Mayor carga en el servidor Git

---

## 📝 Descripción del Pipeline

El Jenkinsfile implementa las siguientes etapas:

### 1. **Checkout**
- Obtiene el código desde el repositorio Git

### 2. **Validación**
- Verifica que existan todos los archivos principales del proyecto
- Archivos validados: `index.html`, `checkout.html`, `response.html`, `styles.css`

### 3. **Limpieza**
- Prepara el directorio de despliegue
- Elimina archivos antiguos

### 4. **Build**
- Para proyectos estáticos, esta etapa simplemente confirma que no se requiere compilación

### 5. **Deploy**
- Copia todos los archivos HTML, CSS y JS al directorio de despliegue
- Directorio por defecto: `C:\deployments\cajita-pagos`

### 6. **Verificación Post-Deploy**
- Confirma que los archivos fueron desplegados correctamente
- Lista los archivos desplegados

---

## 🎯 Flujo de Trabajo CI/CD

```
Desarrollador hace push a main
          ↓
GitHub detecta el push
          ↓
GitHub envía webhook a Jenkins
          ↓
Jenkins recibe el webhook
          ↓
Jenkins ejecuta el pipeline
          ↓
Pipeline: Checkout → Validación → Limpieza → Build → Deploy → Verificación
          ↓
Aplicación desplegada automáticamente
```

---

## ⚙️ Personalización del Pipeline

### Cambiar el directorio de despliegue

Editar en el `Jenkinsfile`:
```groovy
environment {
    DEPLOY_DIR = 'C:\\tu\\ruta\\personalizada'
}
```

### Agregar validaciones adicionales

En la etapa de Validación, puedes agregar más archivos:
```groovy
def requiredFiles = ['index.html', 'checkout.html', 'response.html', 'styles.css', 'tuArchivo.js']
```

### Agregar notificaciones

Puedes agregar notificaciones por email en la sección `post`:
```groovy
post {
    success {
        emailext (
            subject: "Build Exitoso: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            body: "El despliegue se completó exitosamente.",
            to: "tu-email@ejemplo.com"
        )
    }
}
```

---

## 🧪 Probar el Pipeline

### Prueba Manual
1. En Jenkins, ir al job creado
2. Click en "Build Now"
3. Ver el progreso en "Console Output"

### Prueba Automática (con webhook)
1. Hacer un cambio en cualquier archivo del proyecto
2. Hacer commit y push a la rama `main`:
   ```bash
   git add .
   git commit -m "Test de despliegue automático"
   git push origin main
   ```
3. Jenkins debería iniciar el build automáticamente
4. Verificar en Jenkins que el build se ejecutó

---

## 🔍 Troubleshooting

### Webhook no funciona
- Verificar que la URL del webhook sea accesible desde internet
- Revisar los "Recent Deliveries" en GitHub para ver errores
- Verificar que el plugin GitHub esté instalado en Jenkins

### Pipeline falla en la etapa de Deploy
- Verificar permisos de escritura en el directorio de despliegue
- Crear manualmente el directorio si no existe:
  ```powershell
  New-Item -ItemType Directory -Force -Path "C:\deployments\cajita-pagos"
  ```

### Credenciales no funcionan
- Ir a Jenkins → Manage Jenkins → Manage Credentials
- Verificar que las credenciales estén correctamente configuradas
- Probar el acceso al repositorio manualmente

---

## 📚 Recursos Adicionales

- [Documentación de Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Configuración de GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Plugin de GitHub para Jenkins](https://plugins.jenkins.io/github/)

---

## ✅ Checklist de Configuración

- [ ] Jenkins accesible vía navegador
- [ ] Plugins instalados (Git, Pipeline, GitHub)
- [ ] Credenciales del repositorio configuradas
- [ ] Job de Pipeline creado en Jenkins
- [ ] Jenkinsfile en la raíz del repositorio
- [ ] Webhook configurado en GitHub
- [ ] Prueba manual exitosa
- [ ] Prueba automática (push) exitosa
- [ ] Archivos desplegados correctamente en el directorio de destino

---

**¡Pipeline configurado y listo para usar!** 🎉
