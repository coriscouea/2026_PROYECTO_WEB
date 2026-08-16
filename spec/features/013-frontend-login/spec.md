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
POST /auth/login
        ↓
Backend devuelve access_token + refresh_token
        ↓
Guardar en @capacitor/preferences
        ↓
POST /auth/me → obtener nombre, email, rol
        ↓
Guardar nombre, email, rol en Preferences
        ↓
Navegar a /tickets
```

---

## Almacenamiento de tokens

```typescript
// Claves en @capacitor/preferences
'access_token'  → JWT de acceso (30 min)
'refresh_token' → JWT de renovación (1 día)
'nombre'        → Nombre completo del usuario
'email'         → Email del usuario
'rol'           → Rol: usuario | tecnico | mesa_ayuda | admin
```

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
