# 009 · Historial de Eventos del Ticket — Tareas

## Migración de base de datos
- [ ] Crear migración Alembic: renombrar tabla `historial_estado` a `historial_ticket`.
- [ ] Agregar columna `tipo_evento` ENUM a `historial_ticket`.
- [ ] Agregar columna `descripcion` VARCHAR(255) a `historial_ticket`.
- [ ] Aplicar migración con `alembic upgrade head`.
- [ ] Verificar en phpMyAdmin.

## Modelo
- [ ] Renombrar `backend/app/models/historial_estado.py` a `historial_ticket.py`.
- [ ] Actualizar la clase con campos `tipo_evento` y `descripcion`.
- [ ] Actualizar import en `main.py`.

## Repositorio
- [ ] Crear `backend/app/repository/historial_repo.py` con:
  - [ ] `registrar_evento(db, id_ticket, id_usuario, tipo_evento, descripcion)`

## Servicio
- [ ] Crear `backend/app/services/historial_svc.py` con funciones de registro por tipo de evento.
- [ ] Actualizar `ticket_svc.py`:
  - [ ] `svc_crear_ticket` → registrar evento `ticket_creado`
  - [ ] `svc_actualizar_ticket` → registrar evento según campo cambiado
  - [ ] `svc_desactivar_ticket` → registrar evento `ticket_cerrado`

## Endpoints
- [ ] Crear `backend/app/routes/historial.py` con GET /api/v1/tickets/{id}/historial.
- [ ] Registrar router en `main.py`.

## Pruebas en Postman
- [ ] Crear ticket → verificar evento `ticket_creado` en historial.
- [ ] Cambiar estado → verificar evento `estado_cambiado`.
- [ ] Cambiar prioridad → verificar evento `prioridad_cambiada`.
- [ ] GET historial → verificar orden ascendente por fecha.
- [ ] GET historial ticket ajeno con rol usuario → verificar 403.

## Cierre
- [ ] Mover a "Hecho" en roadmap.
