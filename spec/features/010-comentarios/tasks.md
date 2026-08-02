# 010 · Comentarios — Tareas

## Schemas
- [ ] Crear `backend/app/schemas/comentario.py` con ComentarioCreate y ComentarioResponse.

## Repositorio
- [ ] Crear `backend/app/repository/comentario_repo.py` con:
  - [ ] `crear_comentario(db, id_ticket, id_usuario, texto)`
  - [ ] `listar_comentarios(db, id_ticket)` — ordenados por fecha ASC

## Servicio
- [ ] Crear `backend/app/services/comentario_svc.py` con:
  - [ ] Verificar que el ticket existe.
  - [ ] Verificar acceso según rol (igual que en tickets).
  - [ ] Sanitizar texto (eliminar etiquetas HTML).
  - [ ] Crear comentario.
  - [ ] Registrar evento `comentario_agregado` en historial_ticket.

## Endpoints
- [ ] Crear `backend/app/routes/comentarios.py` con:
  - [ ] POST /api/v1/tickets/{id}/comentarios
  - [ ] GET /api/v1/tickets/{id}/comentarios
- [ ] Registrar router en `main.py`.

## Pruebas en Postman
- [ ] Crear comentario en ticket propio → 201.
- [ ] Crear comentario en ticket ajeno (rol usuario) → 403.
- [ ] Comentario vacío → 422.
- [ ] Ticket inexistente → 404.
- [ ] GET comentarios → ordenados por fecha ASC.
- [ ] Verificar evento en historial_ticket.

## Cierre
- [ ] Mover a "Hecho" en roadmap.
