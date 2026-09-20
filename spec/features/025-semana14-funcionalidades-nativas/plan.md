# 025 · Funcionalidades Nativas — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué cámara y notificaciones locales?
La cámara aporta valor real al reporte de fallas — una foto del equipo roto vale más que una descripción. Las notificaciones locales mejoran la experiencia de seguimiento sin requerir servidor de push externo ni configuración adicional.

### ¿Por qué ambas son opcionales y no esenciales?
HelpDesk Web es un sistema de tickets empresarial — puede usarse completamente desde la PWA web sin capacidades nativas. El modelo de degradación elegante garantiza que ningún usuario quede bloqueado.

### ¿Por qué Photo Picker del sistema en lugar de permisos de galería?
Desde la política 2025 de Google Play, solicitar `READ_MEDIA_IMAGES` puede bloquear la publicación de la app si no se justifica adecuadamente. El selector del sistema no requiere ningún permiso y la app solo accede a las fotos que el usuario selecciona explícitamente.

### ¿Por qué JavascriptInterface en MainActivity para abrir ajustes?
Capacitor no incluye un método nativo para abrir los ajustes de la app. Los plugins disponibles (`capacitor-native-settings`, `capacitor-native-settings-extended`) no funcionaron correctamente en MIUI. La solución con `JavascriptInterface` expone un método nativo de Android directamente al WebView — más confiable en Xiaomi MIUI.

### ¿Por qué el canal de notificaciones se crea en app.component.ts?
Los canales de Android son inmutables una vez creados. Crearlos en `app.component.ts` en `ngOnInit` garantiza que existen antes de la primera notificación, independientemente de qué pantalla visite el usuario primero.

### ¿Por qué `androidScheme: 'http'` en capacitor.config.ts?
Capacitor sirve la app en `https://localhost` internamente. Las llamadas al backend en `http://192.168.1.x:8000` son bloqueadas como Mixed Content por el WebView de Android. Cambiar el esquema a `http` resuelve el conflicto en desarrollo sin afectar la seguridad en producción (donde se usaría HTTPS).

### ¿Por qué no notificaciones push en lugar de locales?
Las notificaciones push requieren un servidor FCM (Firebase Cloud Messaging) y configuración de credenciales externas. Las notificaciones locales funcionan completamente offline y son más simples de implementar para el alcance del proyecto universitario.

---

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/app/services/camera.ts` | Servicio de cámara con 4 estados de permiso |
| `src/app/services/local-notification.ts` | Servicio de notificaciones locales |
| `android/app/src/main/res/xml/network_security_config.xml` | Permite tráfico HTTP en red local |
| `ios/App/App/Info.plist` | Cadenas de propósito iOS documentadas |
| `resources/icon.png` | Ícono personalizado de la app |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/pages/crear-ticket/crear-ticket.page.ts` | Integración cámara, 4 estados, borrador con foto |
| `src/app/pages/crear-ticket/crear-ticket.page.html` | Sección foto con previsualización |
| `src/app/pages/crear-ticket/crear-ticket.page.scss` | Estilos sección foto |
| `src/app/pages/tickets/tickets.page.ts` | Notificaciones locales, 4 estados |
| `src/app/app.component.ts` | Canal de notificaciones en ngOnInit |
| `android/app/src/main/AndroidManifest.xml` | CAMERA + POST_NOTIFICATIONS + network config |
| `android/app/src/main/java/io/ionic/starter/MainActivity.java` | MixedContentMode + JavascriptInterface |
| `android/gradle.properties` | Java 21, SDK path, overridePathCheck |
| `android/app/src/main/res/values/strings.xml` | app_name: "HelpDesk Web" |
| `capacitor.config.ts` | androidScheme: 'http' |

---

## Proceso de compilación e instalación (orden correcto)

```powershell
# Desde frontend/
ionic build --prod
Remove-Item "android\app\src\main\assets\public\ngsw.json" -ErrorAction SilentlyContinue
npx cap sync android
cd android
.\gradlew assembleDebug
cd ..
$env:PATH = "$env:PATH;C:\Users\cesar\AppData\Local\Android\Sdk\platform-tools"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
adb -s 5dcd678d install -r "android\app\build\outputs\apk\debug\app-debug.apk"
```

## Variables de entorno requeridas

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "C:\Users\cesar\AppData\Local\Android\Sdk"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\platform-tools"
```

## Problemas resueltos

| Problema | Causa | Solución |
|---|---|---|
| Mixed Content | Capacitor usa https://localhost | androidScheme: 'http' + MixedContentMode |
| CORS | IP teléfono no en CORS_ORIGINS | Agregar http://localhost + IPs en .env |
| Gradle falla | Ruta con tildes (Práctico_Experimental) | android.overridePathCheck=true |
| Java incompatible | Android Studio usa Java 25 | Eclipse Temurin Java 21 en gradle.properties |
| ngsw.json bloquea build | Service Worker incompatible con Gradle | Eliminar antes de cada assembleDebug |
| OneDrive bloquea build | Sincronización activa | Pausar OneDrive antes de compilar |
| Botón ajustes no abría | Plugins nativos incompatibles con MIUI | JavascriptInterface en MainActivity |
| Notificación ID inválido | Date.now() excede 32-bit integer | Usar id fijo = 1 |
