# 005 · CRUD Tickets — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Schemas Pydantic
- [X] Crear `backend/app/schemas/ticket.py` con:
  - [X] `TicketCreate` — campos obligatorios para crear un ticket.
  - [X] `TicketUpdate` — campos opcionales para actualizar (PATCH).
  - [X] `TicketResponse` — campos que devuelve la API al consultar.
- [X] Crear `backend/app/schemas/response.py` con el formato estándar `{status, message, data}`.

## Repositorio
- [X] Crear `backend/app/repository/ticket_repo.py` con:
  - [X] `crear_ticket(db, datos)` — inserta el ticket con estado `pendiente` y técnico `None`.
  - [X] `listar_tickets(db, rol, page, limit)` — lista tickets filtrados por rol con paginación.
  - [X] `obtener_ticket(db, id_ticket)` — retorna un ticket por ID o None si no existe.
  - [X] `actualizar_ticket(db, id_ticket, datos)` — actualiza solo los campos enviados.
  - [X] `desactivar_ticket(db, id_ticket)` — marca `activo = FALSE` (soft delete).

## Servicio (capa de lógica de negocio)
- [X] Crear `backend/app/services/ticket_svc.py` con:
  - [X] Sanitizar `titulo` y `descripcion` — eliminar etiquetas HTML antes de persistir.
  - [X] Verificar existencia de `id_categoria` e `id_usuario` antes del INSERT → 400 si no existe.
  - [X] Verificar rol del usuario antes de PATCH y DELETE → 403 si no tiene permiso.
  - [X] Validar transición de estados → solo `pendiente → en_proceso → finalizado`; devolver 422 si se intenta saltar.
  - [X] Verificar que el ticket no esté ya inactivo antes de DELETE → 400 si ya lo está.

## Endpoints
- [X] Crear `backend/app/routes/tickets.py` con:
  - [X] `POST /api/v1/tickets` — crear ticket, devuelve 201.
  - [X] `GET /api/v1/tickets` — listar con paginación, devuelve 200.
  - [X] `GET /api/v1/tickets/{id}` — detalle, devuelve 200 o 404.
  - [X] `PATCH /api/v1/tickets/{id}` — actualizar, devuelve 200 o 403.
  - [X] `DELETE /api/v1/tickets/{id}` — soft delete, devuelve 200 o 404.
- [X] Registrar el router en `backend/app/main.py`.

## Pruebas en Postman
- [X] Crear ticket válido → verificar respuesta 201 y estado `pendiente`.
- [X] Crear ticket sin `titulo` → verificar respuesta 400.
- [X] Crear ticket con `id_categoria` inexistente → verificar respuesta 400.
- [X] Listar tickets → verificar paginación con `page=1&limit=5`.
- [X] Consultar ticket por ID existente → verificar respuesta 200.
- [X] Consultar ticket por ID inexistente → verificar respuesta 404.
- [X] Actualizar estado de ticket → verificar respuesta 200.
- [X] Actualizar ticket con rol no autorizado → verificar respuesta 403.
- [X] Soft delete de ticket → verificar que el registro sigue en la BD con `activo = FALSE`.
- [X] Registrar capturas de pantalla de cada prueba como evidencia.

## Cierre
- [X] Validar contra todos los criterios de aceptación de `spec.md`.
- [X] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.
