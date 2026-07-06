# 005 · CRUD Tickets — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Schemas Pydantic
- [ ] Crear `backend/app/schemas/ticket.py` con:
  - [ ] `TicketCreate` — campos obligatorios para crear un ticket.
  - [ ] `TicketUpdate` — campos opcionales para actualizar (PATCH).
  - [ ] `TicketResponse` — campos que devuelve la API al consultar.
- [ ] Crear `backend/app/schemas/response.py` con el formato estándar `{status, message, data}`.

## Repositorio
- [ ] Crear `backend/app/repository/ticket_repo.py` con:
  - [ ] `crear_ticket(db, datos)` — inserta el ticket con estado `pendiente` y técnico `None`.
  - [ ] `listar_tickets(db, rol, page, limit)` — lista tickets filtrados por rol con paginación.
  - [ ] `obtener_ticket(db, id_ticket)` — retorna un ticket por ID o None si no existe.
  - [ ] `actualizar_ticket(db, id_ticket, datos)` — actualiza solo los campos enviados.
  - [ ] `desactivar_ticket(db, id_ticket)` — marca `activo = FALSE` (soft delete).

## Servicio (capa de lógica de negocio)
- [ ] Crear `backend/app/services/ticket_svc.py` con:
  - [ ] Sanitizar `titulo` y `descripcion` — eliminar etiquetas HTML antes de persistir.
  - [ ] Verificar existencia de `id_categoria` e `id_usuario` antes del INSERT → 400 si no existe.
  - [ ] Verificar rol del usuario antes de PATCH y DELETE → 403 si no tiene permiso.
  - [ ] Validar transición de estados → solo `pendiente → en_proceso → finalizado`; devolver 422 si se intenta saltar.
  - [ ] Verificar que el ticket no esté ya inactivo antes de DELETE → 400 si ya lo está.

## Endpoints
- [ ] Crear `backend/app/routes/tickets.py` con:
  - [ ] `POST /api/v1/tickets` — crear ticket, devuelve 201.
  - [ ] `GET /api/v1/tickets` — listar con paginación, devuelve 200.
  - [ ] `GET /api/v1/tickets/{id}` — detalle, devuelve 200 o 404.
  - [ ] `PATCH /api/v1/tickets/{id}` — actualizar, devuelve 200 o 403.
  - [ ] `DELETE /api/v1/tickets/{id}` — soft delete, devuelve 200 o 404.
- [ ] Registrar el router en `backend/app/main.py`.

## Pruebas en Postman
- [ ] Crear ticket válido → verificar respuesta 201 y estado `pendiente`.
- [ ] Crear ticket sin `titulo` → verificar respuesta 400.
- [ ] Crear ticket con `id_categoria` inexistente → verificar respuesta 400.
- [ ] Listar tickets → verificar paginación con `page=1&limit=5`.
- [ ] Consultar ticket por ID existente → verificar respuesta 200.
- [ ] Consultar ticket por ID inexistente → verificar respuesta 404.
- [ ] Actualizar estado de ticket → verificar respuesta 200.
- [ ] Actualizar ticket con rol no autorizado → verificar respuesta 403.
- [ ] Soft delete de ticket → verificar que el registro sigue en la BD con `activo = FALSE`.
- [ ] Registrar capturas de pantalla de cada prueba como evidencia.

## Cierre
- [ ] Validar contra todos los criterios de aceptación de `spec.md`.
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.
