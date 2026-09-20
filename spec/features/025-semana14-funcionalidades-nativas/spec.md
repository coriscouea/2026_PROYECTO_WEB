# 025 · Funcionalidades Nativas del Dispositivo — Semana 14

**Estado:** implementado ✅
**Semana:** 14
**Tipo:** Frontend — Capacidades Nativas Android

---

## ¿Qué hace?

Incorpora dos capacidades nativas del dispositivo al prototipo integrado: la cámara para adjuntar evidencia fotográfica al crear tickets, y las notificaciones locales para alertar al usuario sobre cambios en sus tickets. Ambas gestionan correctamente el ciclo completo de permisos y garantizan que la app siga siendo utilizable cuando las capacidades no están disponibles.

---

## Capacidades implementadas

| Capacidad | Plugin | Versión | Tipo |
|---|---|---|---|
| Cámara | `@capacitor/camera` | 8.2.4 | Opcional |
| Notificaciones locales | `@capacitor/local-notifications` | 8.3.1 | Opcional |

---

## Verificación de plugins

Ambos plugins cumplen los criterios de la guía:
- Resuelven la necesidad exacta sin funciones innecesarias
- Soporte declarado para Android e iOS
- Actividad reciente — actualizados en 2025
- Mantenidos por el equipo oficial de Ionic
- Permisos mínimos — sin solicitar más de lo necesario

---

## Declaraciones de permisos

### Android — `AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### iOS — `ios/App/App/Info.plist`
```xml
<key>NSCameraUsageDescription</key>
<string>HelpDesk Web usa la cámara para fotografiar la falla técnica al crear un ticket de soporte, permitiendo al técnico visualizar el problema antes de atenderlo.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>HelpDesk Web accede al selector de fotos del sistema para adjuntar una imagen existente al ticket de soporte sin necesidad de tomar una nueva foto.</string>

<key>NSUserNotificationsUsageDescription</key>
<string>HelpDesk Web envía notificaciones locales para alertar al usuario cuando llegan cambios en sus tickets de soporte técnico.</string>
```

---

## Solicitud en el momento de uso

- **Cámara:** se solicita al tocar el botón "Tomar foto" en Crear Ticket — nunca al iniciar
- **Notificaciones:** se solicita al entrar a la bandeja por primera vez — nunca al iniciar

---

## Matriz de degradación elegante

### Cámara
| Estado | Comportamiento |
|---|---|
| Concedido | Abre cámara, toma foto, muestra previsualización en formulario |
| Denegado | Toast informativo, formulario activo, ticket se crea sin foto |
| Denegado permanente | Botón "Abrir Ajustes del sistema" — abre configuración de la app |
| Restringido/Ausente | Sección de foto oculta completamente (PWA web) |

### Notificaciones
| Estado | Comportamiento |
|---|---|
| Concedido | Banner nativo del sistema al detectar nuevas notificaciones |
| Denegado | Toast informativo, badge en UI sigue funcionando |
| Denegado permanente | Toast informativo, badge en UI sigue funcionando |
| Restringido/Ausente | Solo badge numérico en la UI |

La app **nunca colapsa** ni muestra pantalla vacía en ninguno de los 4 estados.

---

## Integración con semanas anteriores

- **Semana 12:** foto incluida en el borrador con `localforage`, persiste al navegar
- **Semana 13:** ticket con foto enviado via cliente HTTP centralizado con interceptores
- **Semana 12:** notificaciones locales articuladas con la caché local de tickets

---

## Configuración Android adicional

- `android/app/src/main/res/xml/network_security_config.xml` — permite HTTP en red local
- `android/app/src/main/java/io/ionic/starter/MainActivity.java` — MixedContentMode + JavascriptInterface para abrir ajustes
- `capacitor.config.ts` — `androidScheme: 'http'` para evitar Mixed Content
- `android/gradle.properties` — Java 21, SDK path, overridePathCheck

---

## Dispositivo de prueba

**Xiaomi POCO M8 5G** — Android MIUI
- ADB ID: `5dcd678d`
- Paquete: `io.ionic.starter`

---

## Cumplimiento de tienda

- Sin `READ_MEDIA_IMAGES` — se usa Photo Picker del sistema ✅
- Sin permisos de galería amplia ✅
- `targetSdkVersion 36` — cumple plazo agosto 2026 ✅
- `minSdkVersion 24` — Android 7.0+ ✅

---

## Criterios de aceptación

- [x] 2 capacidades nativas pertinentes seleccionadas e integradas
- [x] Permisos declarados en Android y cadenas de propósito en iOS documentadas
- [x] Selector del sistema usado — sin permisos de galería
- [x] Denegación permanente gestionada con botón a Ajustes (cámara)
- [x] 4 estados de permiso implementados en cámara
- [x] App no colapsa en ningún estado de indisponibilidad
- [x] Integración con persistencia local (Semana 12) y backend (Semana 13)
- [x] Pruebas en dispositivo físico Xiaomi POCO M8 5G
- [x] Nivel de API 36 verificado
