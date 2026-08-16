# 021 · Reset de Contraseña — Tasks

**Estado:** completado ✅

---

## Tasks completadas

### Backend — Modelo y migración
- [x] Crear `models/solicitudes_reset.py` con campos id_solicitud, id_usuario, fecha, atendida
- [x] Agregar índices en id_usuario y atendida
- [x] Importar modelo en main.py
- [x] Ejecutar `alembic revision --autogenerate -m "crear_tabla_solicitudes_reset"`
- [x] Ejecutar `alembic upgrade head`
- [x] Verificar tabla en phpMyAdmin

### Backend — Repositorio
- [x] Crear `repository/solicitud_reset_repo.py`
- [x] Implementar `crear_solicitud(db, id_usuario)`
- [x] Implementar `listar_solicitudes_pendientes(db)` con joinedload usuario
- [x] Implementar `marcar_atendida(db, id_solicitud)`

### Backend — Endpoint solicitar-reset
- [x] Agregar POST /auth/solicitar-reset en routes/auth.py
- [x] Decorar con @limiter.limit("3/minute")
- [x] Validar que email no esté vacío
- [x] Buscar usuario por email (solo activos)
- [x] Crear solicitud_reset si el usuario existe
- [x] Respuesta siempre igual independientemente del resultado
- [x] Eliminar lógica de notificación falsa (primera versión incorrecta)

### Backend — Endpoints admin solicitudes
- [x] Crear `routes/solicitudes.py`
- [x] Implementar GET /api/v1/solicitudes (solo pendientes, solo admin)
- [x] Implementar PATCH /api/v1/solicitudes/{id}/atender (solo admin)
- [x] Mensaje de respuesta con recordatorio WhatsApp
- [x] Registrar router en main.py

### Backend — Cambio de contraseña en PATCH usuarios
- [x] Agregar campo `password: Optional[str]` en UsuarioUpdate schema
- [x] En usuario_svc.py: si viene password, hashear con bcrypt antes de guardar
- [x] Verificar que password nunca se devuelve en respuestas

### Frontend — Pantalla olvido-password
- [x] Crear `pages/olvido-password/` con ionic generate page
- [x] Implementar HTML con campo email y botón solicitar
- [x] Validar formato de email antes de enviar
- [x] Llamar a POST /auth/solicitar-reset
- [x] Manejar error 429 con mensaje claro
- [x] Mostrar caja de éxito con instrucciones WhatsApp
- [x] Link "Volver al login"
- [x] Agregar ruta /olvido-password en app.routes.ts
- [x] Agregar enlace desde login.page.html

### Frontend — Panel admin en Gestión de usuarios
- [x] Agregar método `listarSolicitudes()` en services/usuario.ts
- [x] Agregar método `atenderSolicitud(id)` en services/usuario.ts
- [x] Cargar solicitudes en ngOnInit e ionViewWillEnter
- [x] Mostrar sección amarilla con solicitudes pendientes
- [x] Botón "Atender" con alert recordatorio WhatsApp
- [x] Sección desaparece cuando no hay solicitudes pendientes

### Frontend — Mini modal cambio de contraseña
- [x] Agregar botón 🔑 en cada tarjeta de usuario
- [x] Crear mini modal con campo nueva contraseña
- [x] Toggle mostrar/ocultar contraseña
- [x] Validar mínimo 8 caracteres
- [x] Llamar a PATCH /api/v1/usuarios/{id} con campo password
- [x] Alert de confirmación con recordatorio WhatsApp
- [x] Cerrar modal y limpiar campos tras éxito

### Pruebas
- [x] Solicitar reset con email válido → solicitud creada en BD
- [x] Solicitar reset con email inválido → misma respuesta (seguridad)
- [x] Solicitar reset 4 veces en 1 min → 429 Too Many Requests
- [x] Admin ve solicitud pendiente en panel
- [x] Admin atiende → solicitud desaparece del panel
- [x] Admin cambia contraseña → login con nueva clave funciona
