# 024 · Persistencia Local, Almacenamiento Seguro y Offline — Semana 12

**Estado:** implementado ✅
**Semana:** 12
**Tipo:** Frontend — Persistencia y Seguridad

---

## ¿Qué hace?

Migra los tokens JWT a almacenamiento cifrado del sistema operativo, implementa caché local de tickets con lectura offline, muestra indicador de última sincronización y garantiza el cumplimiento de la LOPDP Ecuador con logout seguro completo.

---

## Clasificación de datos

| Dato | Clase | Mecanismo | Justificación |
|---|---|---|---|
| `access_token` | Credencial | SecureStorage (Keychain/Keystore) | JWT — cifrado hardware obligatorio |
| `refresh_token` | Credencial | SecureStorage (Keychain/Keystore) | JWT — cifrado hardware obligatorio |
| `nombre` | Ajuste de UI | @capacitor/preferences | No sensible |
| `email` | Ajuste de UI | @capacitor/preferences | No sensible |
| `rol` | Ajuste de UI | @capacitor/preferences | No sensible |
| `crear_ticket_draft` | Estado efímero | @capacitor/preferences | Borrador temporal |
| `tickets_cache` | Colección | localforage (IndexedDB) | Requiere filtrado/ordenación |
| `ultima_sync` | Metadato | localforage (IndexedDB) | Asociado a la caché |

---

## Almacenamiento seguro de tokens

```typescript
// ✅ Correcto — Keychain iOS / Keystore Android
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

await SecureStoragePlugin.set({ key: 'access_token', value: token });
const { value } = await SecureStoragePlugin.get({ key: 'access_token' });
```

La contraseña del usuario nunca se almacena en ninguna forma.

---

## Caché local de tickets

**Motor elegido:** localforage (IndexedDB)

**Por qué no SQLite con WebAssembly:** Los archivos .wasm de `jeep-sqlite` tienen requisitos de versión específicos que generan errores de compatibilidad difíciles de resolver en PWA. localforage usa IndexedDB nativo — sin WebAssembly, sin configuración adicional.

**Esquema desnormalizado:**
```javascript
{
  id_ticket, titulo, estado, prioridad,
  id_categoria,
  categoria_label,     // desnormalizado — evita JOIN
  nombre_usuario,      // desnormalizado — evita JOIN
  nombre_tecnico,      // desnormalizado — evita JOIN
  fecha_creacion, fecha_actualizacion, activo
}
```

**Caducidad:** 24 horas desde la última sincronización.

---

## Estrategia de sincronización — Nivel 1 (Solo lectura)

```
cargarTickets():
  1. tieneDatos() → si hay caché, mostrar inmediatamente
  2. Network.getStatus() → verificar conectividad
  3. Si offline → toast advertencia, mantener caché
  4. Si online → GET /api/v1/tickets → guardarTickets() → actualizar UI
  5. obtenerUltimaSync() → mostrar en indicador
```

---

## Resolución de conflictos

**Estrategia: El servidor siempre gana.**
Justificación: sistema empresarial multi-rol — el backend es la única fuente de verdad.
Sacrifica: cambios locales ante versiones más recientes del servidor.

---

## Logout seguro — LOPDP Ecuador

```typescript
async logout(): Promise<void> {
  await SecureStoragePlugin.remove({ key: 'access_token' });
  await SecureStoragePlugin.remove({ key: 'refresh_token' });
  await Preferences.remove({ key: 'nombre' });
  await Preferences.remove({ key: 'email' });
  await Preferences.remove({ key: 'rol' });
  await Preferences.remove({ key: 'crear_ticket_draft' });
  await sqliteService.limpiarCacheCompleta(); // IndexedDB
}
```

---

## Documentación LOPDP

| Dato | Finalidad | Duración |
|---|---|---|
| access_token | Autenticación API | Hasta logout o expiración 30min |
| refresh_token | Renovación de sesión | Hasta logout o expiración 1 día |
| nombre, email, rol | Personalización UI | Hasta logout |
| tickets_cache | Lectura offline | 24 horas o hasta logout |
| crear_ticket_draft | Borrador formulario | Hasta envío exitoso o logout |

---

## Prueba modo avión

**Emulador:** Android API 37.1
**Resultado:**
- Con WiFi → carga desde backend → indicador "Actualizado HH:mm" ✅
- Sin WiFi → carga desde caché → toast "Sin conexión — mostrando datos locales" ✅
- Pantalla nunca vacía cuando hay caché ✅

---

## Criterios de aceptación

- [x] Tokens JWT en SecureStorage — no en texto plano
- [x] Ningún token en @capacitor/preferences
- [x] Caché local con localforage (IndexedDB)
- [x] Pantalla nunca vacía cuando hay caché disponible
- [x] Indicador de última sincronización visible
- [x] Toast al detectar sin conexión
- [x] Logout limpia SecureStorage + Preferences + IndexedDB
- [x] Caducidad de caché 24 horas implementada
- [x] Prueba modo avión en emulador Android documentada
