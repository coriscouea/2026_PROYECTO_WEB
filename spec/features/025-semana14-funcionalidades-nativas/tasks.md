# 025 · Funcionalidades Nativas — Tasks

**Estado:** completado ✅

## Grupo A — Instalación y configuración
- [x] Instalar @capacitor/camera@8.2.4
- [x] Instalar @capacitor/local-notifications@8.3.1
- [x] ionic capacitor add android
- [x] Declarar CAMERA en AndroidManifest.xml
- [x] Declarar POST_NOTIFICATIONS en AndroidManifest.xml
- [x] Crear network_security_config.xml con IPs de red local
- [x] Agregar networkSecurityConfig en AndroidManifest.xml
- [x] Agregar usesCleartextTraffic en AndroidManifest.xml
- [x] Configurar androidScheme: 'http' en capacitor.config.ts
- [x] Configurar MixedContentMode en MainActivity.java
- [x] Configurar JavascriptInterface para abrir ajustes en MainActivity.java
- [x] Configurar Java 21 en gradle.properties
- [x] Configurar SDK path en gradle.properties
- [x] Configurar overridePathCheck en gradle.properties
- [x] Cambiar app_name a "HelpDesk Web" en strings.xml
- [x] Generar íconos con @capacitor/assets
- [x] Verificar targetSdkVersion 36 en variables.gradle
- [x] Crear Info.plist con cadenas de propósito iOS
- [x] Agregar CORS origins del teléfono en backend/.env

## Grupo B — Servicio de cámara
- [x] Crear services/camera.ts con tipo EstadoPermisoCamara
- [x] Implementar estaDisponible() — Capacitor.isNativePlatform()
- [x] Implementar tomarFoto() con checkPermissions()
- [x] Estado concedido — Camera.getPhoto() con source CAMERA
- [x] Estado denegado — retornar mensaje informativo
- [x] Estado denegado permanente — retornar flag para botón ajustes
- [x] Estado restringido — retornar sin acción
- [x] Implementar elegirFoto() con source PHOTOS (selector del sistema)
- [x] Implementar abrirAjustes() con JavascriptInterface
- [x] Manejar cancelación de cámara por el usuario

## Grupo C — Integración cámara en crear-ticket
- [x] Agregar camaraDisponible, fotoBase64, mostrarBotonAjustes en crear-ticket.page.ts
- [x] Implementar solicitarFotoCamara() con manejo de 4 estados
- [x] Implementar solicitarFotoGaleria()
- [x] Implementar eliminarFoto()
- [x] Implementar abrirAjustesSistema()
- [x] Agregar foto al body de crearTicket()
- [x] Incluir foto en guardarBorrador() y restaurarBorrador()
- [x] Agregar sección foto en crear-ticket.page.html
- [x] Previsualización con *ngIf="fotoBase64"
- [x] Botones cámara/galería con *ngIf="!fotoBase64"
- [x] Mensaje denegación permanente con botón ajustes
- [x] Agregar estilos foto en crear-ticket.page.scss

## Grupo D — Servicio de notificaciones locales
- [x] Crear services/local-notification.ts
- [x] Implementar estaDisponible()
- [x] Implementar solicitarPermiso() con 4 estados
- [x] Implementar mostrarNotificacion() con id fijo (no Date.now())
- [x] Implementar verificarEstado()
- [x] Implementar abrirAjustes()

## Grupo E — Canal e integración notificaciones
- [x] Crear canal 'helpdesk-tickets' en app.component.ts ngOnInit
- [x] Solo en isNativePlatform()
- [x] Agregar notificacionesPermitidas y mostrarBotonAjustesNotif en tickets.page.ts
- [x] Implementar inicializarNotificacionesLocales() con 4 estados
- [x] Llamar inicializarNotificacionesLocales() en ionViewWillEnter
- [x] Actualizar cargarConteoNotificaciones() para disparar notificación
- [x] Condición: conteoNotificaciones > conteoAnterior

## Grupo F — Compilación e instalación en dispositivo físico
- [x] ionic build --prod
- [x] npx cap sync android
- [x] gradlew assembleDebug
- [x] adb install en Xiaomi POCO M8 5G (5dcd678d)
- [x] Verificar login funciona desde app nativa
- [x] Verificar Mixed Content resuelto
- [x] Verificar CORS configurado para teléfono físico

## Grupo G — Pruebas de los 5 casos
- [x] Caso 1: permiso concedido — foto tomada y previsualizada ✅
- [x] Caso 2: permiso denegado — mensaje informativo, sin colapso ✅
- [x] Caso 3: denegado permanente — botón Abrir Ajustes funcional ✅
- [x] Caso 4: revocado durante uso — MIUI reinicia, vuelve al login ✅
- [x] Caso 5: capacidad ausente PWA — sección oculta, formulario funcional ✅
- [x] Notificaciones: banner nativo al detectar nuevas notificaciones ✅
