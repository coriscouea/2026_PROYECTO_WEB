# 006 · CRUD Usuarios — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Dependencia previa
- [X] Verificar que `passlib[bcrypt]` está en `backend/requirements.txt`.

## Schemas Pydantic
- [X] Crear `backend/app/schemas/usuario.py` con:
  - [X] `UsuarioCreate` — nombre, email, password, id_rol (opcional), id_sucursal (opcional).
  - [X] `UsuarioUpdate` — nombre y id_sucursal opcionales; sin email ni password.
  - [X] `UsuarioResponse` — todos los campos excepto `password`.

## Repositorio
- [X] Crear `backend/app/repository/usuario_repo.py` con:
  - [X] `crear_usuario(db, datos)` — inserta el usuario con `activo = TRUE`.
  - [X] `listar_usuarios(db, page, limit)` — lista usuarios con `activo = TRUE` y paginación.
  - [X] `obtener_usuario(db, id_usuario)` — retorna usuario por ID o None.
  - [X] `buscar_por_email(db, email)` — busca usuario por email (para verificar unicidad).
  - [X] `actualizar_usuario(db, id_usuario, datos)` — actualiza solo los campos enviados.
  - [X] `desactivar_usuario(db, id_usuario)` — marca `activo = FALSE`.

## Servicio (capa de lógica de negocio)
- [X] Crear `backend/app/services/usuario_svc.py` con:
  - [X] Sanitizar `nombre` — eliminar etiquetas HTML.
  - [X] Transformar `email` a minúsculas antes de cualquier operación.
  - [X] Verificar unicidad de email → 409 Conflict si ya existe.
  - [X] Hashear `password` con bcrypt antes de persistir.
  - [X] Asignar `id_rol` por defecto al rol `usuario` si no se envía.
  - [X] Verificar existencia de `id_rol` e `id_sucursal` → 400 si no existen.
  - [X] Verificar que el admin no se desactive a sí mismo → 400 si lo intenta.

## Endpoints
- [X] Crear `backend/app/routes/usuarios.py` con:
  - [X] `POST /api/v1/usuarios` — crear usuario, devuelve 201.
  - [X] `GET /api/v1/usuarios` — listar con paginación, devuelve 200.
  - [X] `GET /api/v1/usuarios/{id}` — detalle, devuelve 200 o 404.
  - [X] `PATCH /api/v1/usuarios/{id}` — actualizar, devuelve 200 o 403.
  - [X] `DELETE /api/v1/usuarios/{id}` — soft delete, devuelve 200 o 403/400.
- [X] Registrar el router en `backend/app/main.py`.

## Pruebas en Postman
- [X] Crear usuario válido → verificar 201 y que la respuesta NO incluye `password`.
- [X] Crear usuario con email duplicado → verificar 409.
- [X] Crear usuario con email en mayúsculas → verificar que se guarda en minúsculas.
- [X] Crear usuario con `id_rol` inexistente → verificar 400.
- [X] Listar usuarios → verificar paginación y que usuarios inactivos no aparecen.
- [X] Consultar usuario por ID existente → verificar 200 sin campo `password`.
- [X] Consultar usuario por ID inexistente → verificar 404.
- [X] Actualizar nombre → verificar 200.
- [X] Intentar actualizar email mediante PATCH → verificar que el campo se ignora.
- [X] Desactivar usuario → verificar 200 y que el registro sigue en BD con `activo = FALSE`.
- [X] Desactivar usuario ya inactivo → verificar 400.
- [X] Ejecutar cualquier endpoint con rol no admin → verificar 403.
- [X] Registrar capturas de pantalla de cada prueba como evidencia.

## Cierre
- [X] Validar contra todos los criterios de aceptación de `spec.md`.
- [X] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.
