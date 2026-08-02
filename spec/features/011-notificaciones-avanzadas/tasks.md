# 011 · Notificaciones Avanzadas — Tareas

## Repositorio
- [ ] Crear `backend/app/repository/notificacion_repo.py` con:
  - [ ] `listar_notificaciones(db, id_usuario)`
  - [ ] `listar_no_leidas(db, id_usuario)`
  - [ ] `contar_no_leidas(db, id_usuario)`
  - [ ] `marcar_leida(db, id_notificacion, id_usuario)`
  - [ ] `marcar_todas_leidas(db, id_usuario)`

## Servicio
- [ ] Crear `backend/app/services/notificacion_svc.py` con verificación de propiedad.

## Endpoints
- [ ] Crear `backend/app/routes/notificaciones.py` con los 5 endpoints.
- [ ] Registrar router en `main.py`.

## Pruebas en Postman
- [ ] GET /notificaciones → solo las del usuario autenticado.
- [ ] GET /notificaciones/no-leidas → solo leida=FALSE.
- [ ] GET /notificaciones/conteo → {"total": N}.
- [ ] PATCH /{id}/leer → leida=TRUE.
- [ ] PATCH /leer-todas → todas leida=TRUE.
- [ ] PATCH notificación ajena → 403.

## Cierre
- [ ] Mover a "Hecho" en roadmap.
