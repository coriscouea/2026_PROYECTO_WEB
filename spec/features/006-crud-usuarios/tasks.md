# 006 · CRUD Usuarios — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Dependencia previa
- [ ] Verificar que `passlib[bcrypt]` está en `backend/requirements.txt`.

## Schemas Pydantic
- [ ] Crear `backend/app/schemas/usuario.py` con:
  - [ ] `UsuarioCreate` — nombre, email, password, id_rol (opcional), id_sucursal (opcional).
  - [ ] `UsuarioUpdate` — nombre y id_sucursal opcionales; sin email ni password.
  - [ ] `UsuarioResponse` — todos los campos excepto `password`.

## Repositorio
- [ ] Crear `backend/app/repository/usuario_repo.py` con:
  - [ ] `crear_usuario(db, datos)` — inserta el usuario con `activo = TRUE`.
  - [ ] `listar_usuarios(db, page, limit)` — lista usuarios con `activo = TRUE` y paginación.
  - [ ] `obtener_usuario(db, id_usuario)` — retorna usuario por ID o None.
  - [ ] `buscar_por_email(db, email)` — busca usuario por email (para verificar unicidad).
  - [ ] `actualizar_usuario(db, id_usuario, datos)` — actualiza solo los campos enviados.
  - [ ] `desactivar_usuario(db, id_usuario)` — marca `activo = FALSE`.

## Servicio (capa de lógica de negocio)
- [ ] Crear `backend/app/services/usuario_svc.py` con:
  - [ ] Sanitizar `nombre` — eliminar etiquetas HTML.
  - [ ] Transformar `email` a minúsculas antes de cualquier operación.
  - [ ] Verificar unicidad de email → 409 Conflict si ya existe.
  - [ ] Hashear `password` con bcrypt antes de persistir.
  - [ ] Asignar `id_rol` por defecto al rol `usuario` si no se envía.
  - [ ] Verificar existencia de `id_rol` e `id_sucursal` → 400 si no existen.
  - [ ] Verificar que el admin no se desactive a sí mismo → 400 si lo intenta.

## Endpoints
- [ ] Crear `backend/app/routes/usuarios.py` con:
  - [ ] `POST /api/v1/usuarios` — crear usuario, devuelve 201.
  - [ ] `GET /api/v1/usuarios` — listar con paginación, devuelve 200.
  - [ ] `GET /api/v1/usuarios/{id}` — detalle, devuelve 200 o 404.
  - [ ] `PATCH /api/v1/usuarios/{id}` — actualizar, devuelve 200 o 403.
  - [ ] `DELETE /api/v1/usuarios/{id}` — soft delete, devuelve 200 o 403/400.
- [ ] Registrar el router en `backend/app/main.py`.

## Pruebas en Postman
- [ ] Crear usuario válido → verificar 201 y que la respuesta NO incluye `password`.
- [ ] Crear usuario con email duplicado → verificar 409.
- [ ] Crear usuario con email en mayúsculas → verificar que se guarda en minúsculas.
- [ ] Crear usuario con `id_rol` inexistente → verificar 400.
- [ ] Listar usuarios → verificar paginación y que usuarios inactivos no aparecen.
- [ ] Consultar usuario por ID existente → verificar 200 sin campo `password`.
- [ ] Consultar usuario por ID inexistente → verificar 404.
- [ ] Actualizar nombre → verificar 200.
- [ ] Intentar actualizar email mediante PATCH → verificar que el campo se ignora.
- [ ] Desactivar usuario → verificar 200 y que el registro sigue en BD con `activo = FALSE`.
- [ ] Desactivar usuario ya inactivo → verificar 400.
- [ ] Ejecutar cualquier endpoint con rol no admin → verificar 403.
- [ ] Registrar capturas de pantalla de cada prueba como evidencia.

## Cierre
- [ ] Validar contra todos los criterios de aceptación de `spec.md`.
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.
