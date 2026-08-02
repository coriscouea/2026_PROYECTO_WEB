# 011 · Notificaciones Avanzadas — Plan

## Enfoque

5 endpoints REST bajo `/api/v1/notificaciones`. El usuario autenticado
solo puede ver y modificar sus propias notificaciones — el id_usuario
siempre viene del token JWT, nunca del body.

## Implementación

1. Crear `backend/app/repository/notificacion_repo.py` — listar, contar, marcar leída, marcar todas.
2. Crear `backend/app/services/notificacion_svc.py` — lógica y verificación de propiedad.
3. Crear `backend/app/routes/notificaciones.py` — 5 endpoints.
4. Registrar router en `main.py`.
5. Probar en Postman.

## Decisiones

- **id_usuario desde JWT** — nunca del body, para evitar que un usuario
  acceda a notificaciones de otro.
- **Índice compuesto** — ya existe `ix_notificaciones_usuario_leida`
  que acelera las consultas de no leídas.
