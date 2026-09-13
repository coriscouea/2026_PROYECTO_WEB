# 013 · Frontend Login

**Estado:** implementado ✅  
**Semana:** 9  
**Tipo:** Frontend

---

## ¿Qué hace?

Pantallas de autenticación en Ionic Angular. Incluye login dividido estilo Pichincha, registro con validaciones UX, pantalla de recuperación de contraseña y guard de autenticación para proteger rutas.

---

## Pantallas

### Login (`/login`)
- Diseño dividido en dos paneles
- Panel izquierdo: logo ⚡, servicios que cubre HelpDesk, nombre del autor
- Panel derecho: formulario email/password, checkbox "Mantener sesión", links a olvido-password y registro
- Enter en contraseña ejecuta el login
- Manejo de errores: 401 credenciales incorrectas, 429 rate limiting

### Registro (`/registro`)
- Validaciones en tiempo real: nombre (min 3), email (formato), password (min 8), confirmación
- Barra de fortaleza: Débil / Media / Fuerte
- Campo válido muestra ícono ✅ verde
- Campo inválido muestra borde rojo + mensaje debajo
- Botón deshabilitado hasta que todos los campos sean válidos
- Redirige al login tras registro exitoso

### Olvido de contraseña (`/olvido-password`)
- Campo email con validación de formato
- Rate limiting 3/min (maneja 429)
- Respuesta siempre igual (seguridad contra enumeración)
- Mensaje de éxito explicando flujo WhatsApp Mesa de Ayuda

---

## Flujo de autenticación

```
Usuario ingresa email + password
        ↓
POST /auth/login (vía HttpService)
        ↓
Backend devuelve access_token + refresh_token
        ↓
Guardar tokens en SecureStoragePlugin (cifrado Keychain/Keystore)
        ↓
POST /auth/me → obtener nombre, email, rol
        ↓
Guardar nombre, email, rol en @capacitor/preferences
        ↓
Navegar a /tickets
```

> **Actualizado (Semana 13):** el almacenamiento de tokens migró de
> `@capacitor/preferences` a `SecureStoragePlugin` en la feature 024
> (persistencia offline). Ver [[024-persistencia-offline]].

---

## Almacenamiento de sesión

```typescript
// Tokens JWT — SecureStoragePlugin (cifrado Keychain/Keystore)
'access_token'  → JWT de acceso (30 min)
'refresh_token' → JWT de renovación (1 día)

// Datos no sensibles — @capacitor/preferences
'nombre'        → Nombre completo del usuario
'email'         → Email del usuario
'rol'           → Rol: usuario | tecnico | mesa_ayuda | admin
```

---

## Cliente HTTP centralizado y renovación automática (Semana 13)

`services/http.ts` reemplaza el uso directo de Axios en cada servicio.
Ningún servicio (`ticket.ts`, `usuario.ts`, `metricas.ts`, `notificacion.ts`,
`auth.ts`) importa Axios — todos consumen `HttpService`.

Interceptores registrados, en orden:

1. **Autenticación** — antes de cada request, lee `access_token` de
   `SecureStoragePlugin` y lo adjunta como `Authorization: Bearer <token>`.
   Rutas públicas (`/auth/login`, `/auth/registro`, `/auth/solicitar-reset`)
   se excluyen.
2. **Renovación** — captura el 401 de una respuesta rechazada (`onRejected`,
   comportamiento estándar de Axios — sin `validateStatus` custom, para no
   romper el manejo de errores 403/404/409/422/429 de las pantallas). Si
   el 401 no es de un reintento previo (`_reintentado`), llama a
   `POST /auth/refresh` con el `refresh_token`, guarda el nuevo
   `access_token` y reintenta la petición original una sola vez. Varias
   peticiones simultáneas que reciben 401 comparten una sola renovación
   (cola `this.cola`) para evitar llamadas duplicadas a `/auth/refresh`.
   Si la renovación falla (sin refresh token, o también expirado), cierra
   sesión y redirige a `/login`.
3. **Logging** — solo en desarrollo (`!environment.production`), registra
   método, URL, código de respuesta y duración de cada request en consola.

Esto cierra el punto pendiente del plan original de esta feature
("Redirección automática al expirar token — usar refresh token") y del
`spec.md` de la feature 007 (sección "Riesgos de seguridad" →
"Tokens vencidos mal manejados"), que quedó descrito pero no
implementado hasta ahora.

---

## Guard de autenticación

`auth.guard.ts` — protege todas las rutas excepto `/login`, `/registro` y `/olvido-password`. Si no hay token, redirige a `/login`.

---

## Criterios de aceptación

- [x] Login llama a POST /auth/login y guarda access_token y refresh_token
- [x] Error 401 muestra "Credenciales incorrectas"
- [x] Error 429 muestra mensaje de rate limiting
- [x] Enter en contraseña ejecuta el login
- [x] Registro valida nombre, email, password y confirmación en tiempo real
- [x] Barra de fortaleza de contraseña funciona correctamente
- [x] Email duplicado muestra mensaje claro (409)
- [x] Guard redirige a /login si no hay token
- [x] Perfil del usuario se obtiene de GET /auth/me al hacer login
- [x] Olvido de contraseña crea solicitud en BD
- [x] Mensaje de éxito explica flujo WhatsApp
