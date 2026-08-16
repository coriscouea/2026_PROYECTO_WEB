# 013 · Frontend Login — Tasks

**Estado:** completado ✅

---

## Tasks completadas

### Servicio de autenticación
- [x] Crear `services/auth.ts` con Axios
- [x] Implementar `login()` — llama POST /auth/login, guarda tokens
- [x] Implementar `logout()` — limpia Preferences, redirige a login
- [x] Implementar `getToken()` — obtiene access_token
- [x] Implementar `getRol()` — obtiene rol guardado
- [x] Implementar `getNombre()` — obtiene nombre guardado
- [x] Implementar `getEmail()` — obtiene email guardado
- [x] Implementar `obtenerPerfil()` — llama GET /auth/me, guarda nombre/email/rol

### Guard de autenticación
- [x] Crear `guards/auth.guard.ts`
- [x] Verificar token en CanActivate
- [x] Redirigir a /login si no hay token
- [x] Aplicar guard a todas las rutas protegidas en `app.routes.ts`

### Pantalla Login
- [x] Crear `pages/login/`
- [x] Diseño dividido dos paneles — izquierdo servicios, derecho formulario
- [x] Logo ⚡ con gradiente azul
- [x] Panel izquierdo con 10 servicios en grid 2x5
- [x] Nombre del autor al fondo del panel izquierdo
- [x] Campos email y password con inputs nativos
- [x] Fix autorrelleno navegador con -webkit-box-shadow
- [x] Botón mostrar/ocultar contraseña
- [x] Checkbox "Mantener sesión"
- [x] Enter en contraseña ejecuta login
- [x] Manejo errores 401, 429
- [x] Links a /olvido-password y /registro
- [x] Responsive móvil — paneles apilados en pantalla < 600px

### Pantalla Registro
- [x] Crear `pages/registro/`
- [x] Campo nombre con validación min 3 en tiempo real
- [x] Campo email con validación de formato en tiempo real
- [x] Campo password con barra de fortaleza (Débil/Media/Fuerte)
- [x] Campo confirmar password con validación de coincidencia
- [x] Ícono ✅ verde en campos válidos
- [x] Borde rojo + mensaje en campos inválidos
- [x] Botón deshabilitado hasta formulario válido
- [x] Manejo error 409 email duplicado
- [x] Redirección a /login tras éxito con mensaje

### Pantalla Olvido de contraseña
- [x] Crear `pages/olvido-password/`
- [x] Campo email con validación de formato
- [x] Llamada a POST /auth/solicitar-reset
- [x] Manejo error 429 rate limiting
- [x] Mostrar mensaje de éxito con instrucciones WhatsApp
- [x] Link "Volver al login"

### Rutas
- [x] Agregar /login, /registro, /olvido-password en app.routes.ts
- [x] Aplicar authGuard a todas las rutas protegidas
- [x] Lazy loading en todas las páginas
