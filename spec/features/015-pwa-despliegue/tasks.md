# 015 · PWA y Despliegue — Tasks

**Estado:** completado ✅

---

## Tasks completadas

### Configuración de entornos
- [x] Crear `src/environments/environment.ts` con apiUrl localhost
- [x] Crear `src/environments/environment.prod.ts` con apiUrl IP red local
- [x] Verificar que todos los servicios usan `environment.apiUrl`

### manifest.webmanifest
- [x] Crear `src/manifest.webmanifest`
- [x] Configurar name: "HelpDesk Web"
- [x] Configurar short_name: "HelpDesk"
- [x] Configurar background_color: "#0D1B2A"
- [x] Configurar theme_color: "#0288D1"
- [x] Configurar display: "standalone"
- [x] Agregar link rel="manifest" en index.html
- [x] Cambiar título en index.html a "HelpDesk Web"

### Build de producción
- [x] Ajustar budget en angular.json (6kb warning, 10kb error)
- [x] Ejecutar ionic build --prod sin errores
- [x] Verificar que www/ contiene todos los archivos

### CORS backend
- [x] Agregar http://localhost:8081 al .env CORS_ORIGINS
- [x] Agregar http://192.168.1.12:8081 al .env
- [x] Agregar http://10.0.2.2:8081 al .env
- [x] Reiniciar backend y verificar que OPTIONS devuelve 200

### Firewall Windows
- [x] Agregar regla entrada TCP puerto 8000
- [x] Agregar regla entrada TCP puerto 8081
- [x] Verificar acceso desde dispositivo Android en la misma red

### Script de arranque
- [x] Crear iniciar_helpdesk.bat en la raíz del proyecto
- [x] Backend: activar venv + uvicorn --host 0.0.0.0 --port 8000
- [x] Frontend: npx serve www -s -p 8081
- [x] Abrir cada servidor en ventana separada
- [x] Probar arranque con doble clic

### Pruebas de despliegue
- [x] Probar login en PC Chrome → 200 OK
- [x] Probar instalación PWA en Edge PC
- [x] Probar en emulador Android API 37.1 con http://10.0.2.2:8081
- [x] Probar en Android físico con http://192.168.1.12:8081
- [x] Verificar diseño responsive en Chrome DevTools iPhone 14

### Android Studio
- [x] Instalar Android Studio
- [x] Instalar SDK Platform API 37.1
- [x] Crear AVD Medium Phone API 37.1
- [x] Iniciar emulador y verificar acceso a la PWA
