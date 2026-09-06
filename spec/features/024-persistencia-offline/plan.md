# 024 · Persistencia Offline y Almacenamiento Seguro — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué SecureStorage y no @capacitor/preferences para los tokens?
`@capacitor/preferences` guarda datos en texto plano — es un fallo de seguridad grave para tokens JWT. `capacitor-secure-storage-plugin` usa el Keychain de iOS y el Keystore de Android — cifrado gestionado por el sistema operativo. La LOPDP Ecuador exige protección de credenciales sin excepción.

### ¿Por qué localforage y no @capacitor-community/sqlite?
SQLite con WebAssembly en el navegador requiere archivos .wasm con versiones específicas de sql.js y jeep-sqlite que generan errores de compatibilidad difíciles de resolver. localforage usa IndexedDB nativo del navegador — sin WebAssembly, sin configuración de assets, sin errores de versión. Para el caso de uso de caché de lectura es equivalente.

### ¿Por qué esquema desnormalizado en la caché local?
El backend normaliza para integridad transaccional. El cliente prioriza velocidad de lectura. El esquema local incluye `categoria_label` y `nombre_tecnico` ya resueltos — evita JOINs costosos al mostrar la bandeja.

### ¿Por qué Nivel 1 (solo lectura) y no Nivel 2 (escritura diferida)?
HelpDesk Web es un sistema empresarial en red local — la conectividad offline prolongada no es un caso de uso real. El Nivel 2 (Outbox pattern) agrega complejidad de gestión de conflictos, idempotencia con UUID y reintentos exponenciales que exceden el alcance del proyecto universitario.

### ¿Por qué "el servidor siempre gana" como estrategia de conflictos?
Los tickets son modificados por múltiples roles (técnico, admin, usuario). La estrategia "última escritura gana" podría sobrescribir el trabajo del técnico con datos del usuario. La resolución manual interrumpe el flujo de trabajo. El servidor como fuente de verdad es la opción más segura para un sistema de tickets empresarial.

### ¿Por qué caducidad de 24 horas para la caché?
Los tickets tienen eventos frecuentes (comentarios, cambios de estado). Una caducidad mayor podría mostrar datos muy desactualizados. 24 horas es un balance entre disponibilidad offline y frescura de datos.

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `services/auth.ts` | Tokens → SecureStorage, logout seguro LOPDP |
| `tickets.page.ts` | Integrar SqliteService, Network, ultimaSync |
| `tickets.page.html` | Indicador de última sincronización |
| `tickets.page.scss` | Estilos del indicador sync |
| `main.ts` | Sin jeep-sqlite (revertido) |
| `index.html` | Sin jeep-sqlite (revertido) |

## Archivos creados

| Archivo | Descripción |
|---|---|
| `services/sqlite.ts` | Caché local con localforage (IndexedDB) |

## Paquetes instalados

| Paquete | Versión | Uso |
|---|---|---|
| capacitor-secure-storage-plugin | 0.13.0 | Tokens JWT cifrados |
| @capacitor/network | 8.0.1 | Detección de conectividad |
| localforage | 1.10.0 | Caché IndexedDB |

---

## Estrategia de sincronización

```
1. inicializar() → localforage.ready()
2. tieneDatos() → leer caché
3. Si hay caché → mostrar inmediatamente (pantalla nunca vacía)
4. Network.getStatus() → verificar conectividad
5. Si offline → toast "Sin conexión — mostrando datos locales"
6. Si online → GET /api/v1/tickets → guardarTickets() → actualizar UI
7. ultimaSync → mostrar fecha en indicador
```

---

## Cumplimiento LOPDP Ecuador

| Obligación | Implementación |
|---|---|
| Minimización | Solo campos que muestra la UI en el esquema local |
| Plazo de conservación | Caducidad 24 horas implementada en cacheExpirada() |
| Derecho de supresión | logout() destruye SecureStorage + Preferences + IndexedDB |
| Protección de credenciales | SecureStorage con Keychain/Keystore |
| Transparencia | PRIVACIDAD.md documentando qué se almacena |
