# HelpDesk Web — Frontend

Cliente multiplataforma PWA + Android nativo construido con Ionic + Capacitor + Angular.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Ionic Framework | 8.8.17 | Componentes UI móvil |
| Capacitor | 8.5.0 | Acceso a APIs nativas |
| Angular | 20.x | Framework JS |
| Angular CLI | 20.3.28 | Build y generación |
| Ionic CLI | 7.2.1 | Serve, build, doctor |
| Axios | — | HTTP Client centralizado |
| capacitor-secure-storage-plugin | 0.13.0 | Tokens JWT cifrados (Keychain/Keystore) |
| @capacitor/preferences | 8.0.1 | Datos de sesión no sensibles |
| @capacitor/network | 8.0.1 | Detección de conectividad |
| @capacitor/camera | 8.2.4 | Cámara nativa con 4 estados de permiso |
| @capacitor/local-notifications | 8.3.1 | Notificaciones locales nativas |
| localforage | 1.10.0 | Caché local IndexedDB |
| Node.js | v24.14.0 | Runtime |
| npm | 11.9.0 | Gestión de paquetes |

---

## Estructura

```
frontend/src/app/
├── pages/
│   ├── login/              # Login dividido estilo Pichincha
│   ├── registro/           # Registro con validaciones UX
│   ├── olvido-password/    # Solicitud reset contraseña
│   ├── tickets/            # Dashboard + caché offline + notificaciones locales
│   ├── detalle/            # Info + acciones por rol + historial + comentarios
│   ├── crear-ticket/       # Formulario + validación blur + borrador + cámara nativa
│   ├── notificaciones/     # Lista con badge
│   ├── usuarios/           # Admin panel
│   └── metricas/           # Dashboard analytics con donut chart
├── components/
│   ├── estado-badge/       # Badge de estado reutilizable
│   ├── empty-state/        # Estado vacío reutilizable
│   ├── loading-state/      # Spinner reutilizable
│   ├── ticket-card/        # Tarjeta de ticket reutilizable
│   └── error-state/        # Estado de error con reintentar
├── services/
│   ├── http.ts             # Cliente HTTP centralizado con interceptores
│   ├── auth.ts             # Login, logout seguro, SecureStorage
│   ├── ticket.ts           # CRUD tickets, historial, comentarios
│   ├── notificacion.ts     # listar, conteo, marcar leída (backend)
│   ├── local-notification.ts # Notificaciones locales nativas (dispositivo)
│   ├── camera.ts           # Cámara nativa con 4 estados de permiso
│   ├── usuario.ts          # CRUD usuarios, solicitudes reset
│   ├── metricas.ts         # resumen global, por categoría, técnico
│   ├── error.ts            # Traductor códigos HTTP → mensajes usuario
│   └── sqlite.ts           # Caché local con localforage (IndexedDB)
├── guards/
│   └── auth-guard.ts       # canActivate + redirectUrl
├── models/
│   └── estado-remoto.ts    # Tipo cerrado EstadoRemoto<T>
└── app.routes.ts           # Rutas públicas y protegidas
```

---

## Instalación

```bash
cd frontend
npm install
```

---

## Variables de entorno

```typescript
// environment.ts — desarrollo
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000'
};

// environment.prod.ts — producción
export const environment = {
  production: true,
  apiUrl: 'http://192.168.1.12:8000'
};
```

---

## Comandos principales

| Comando | Descripción |
|---|---|
| `ionic serve` | Desarrollo — localhost:8100 |
| `ionic build --prod` | Build de producción → www/ |
| `npx serve www -s -p 8081` | Servir PWA → localhost:8081 |
| `npx cap sync android` | Sincronizar con Android |
| `ionic capacitor add android` | Agregar plataforma Android |

## Compilación APK (orden correcto)

```powershell
# Variables de entorno
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "C:\Users\cesar\AppData\Local\Android\Sdk"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\platform-tools"

# Build
ionic build --prod
Remove-Item "android\app\src\main\assets\public\ngsw.json" -ErrorAction SilentlyContinue
npx cap sync android
cd android
.\gradlew assembleDebug
cd ..

# Instalar en dispositivo físico
adb -s 5dcd678d install -r "android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## Almacenamiento local

| Dato | Mecanismo | Por qué |
|---|---|---|
| JWT tokens | SecureStorage (Keychain/Keystore) | Credenciales — cifrado obligatorio |
| nombre, email, rol | @capacitor/preferences | No sensibles — ajustes de UI |
| tickets_cache | localforage (IndexedDB) | Colección — requiere filtrado |
| crear_ticket_draft | @capacitor/preferences | Estado efímero — incluye foto |

---

## Cliente HTTP centralizado (Semana 13)

`services/http.ts` — instancia única Axios con:

1. **Interceptor de autenticación** — inyecta token desde SecureStorage
2. **Interceptor de renovación 401** — renueva token transparentemente, flag anti-bucle, cola concurrente
3. **Interceptor de logging** — solo en desarrollo, oculta Authorization

---

## Funcionalidades nativas (Semana 14)

### Cámara — `services/camera.ts`
- 4 estados de permiso: concedido, denegado, denegado permanente, restringido
- Selector del sistema para fotos existentes — sin permisos de galería
- Botón "Abrir Ajustes del sistema" via JavascriptInterface

### Notificaciones locales — `services/local-notification.ts`
- Canal `helpdesk-tickets` creado en `app.component.ts`
- Permiso solicitado al entrar a la bandeja — nunca al inicio
- Banner nativo al detectar nuevas notificaciones del backend

---

## Configuración Android

| Archivo | Propósito |
|---|---|
| `android/app/src/main/AndroidManifest.xml` | CAMERA + POST_NOTIFICATIONS + network config |
| `android/app/src/main/res/xml/network_security_config.xml` | Permite HTTP en red local |
| `android/app/src/main/java/io/ionic/starter/MainActivity.java` | MixedContentMode + JavascriptInterface |
| `android/gradle.properties` | Java 21, SDK path, overridePathCheck |
| `capacitor.config.ts` | androidScheme: 'http' |

---

## Dispositivos de prueba

| Dispositivo | Tipo | URL |
|---|---|---|
| PC desarrollo | Navegador | http://localhost:8100 |
| PC producción PWA | Navegador | http://localhost:8081 |
| Android emulador | Chrome | http://10.0.2.2:8081 |
| Xiaomi POCO M8 5G | App nativa | http://192.168.1.12:8000 |

---

## Modo offline

La bandeja implementa caché local:
1. Lee desde caché primero — pantalla nunca vacía
2. Verifica conectividad con `@capacitor/network`
3. Si hay conexión → actualiza desde backend → guarda en caché
4. Si no hay → muestra caché + toast advertencia
5. Indicador de última sincronización visible
