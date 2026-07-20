# 008 · Optimización del Backend — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## 0. Diagnóstico previo

- [x] Activar `echo=True` en `database.py`.
- [x] Ejecutar GET /api/v1/tickets y registrar 4 consultas SQL (antes).
- [x] Guardar evidencia del problema N+1.

## 1. Corrección N+1 — Eager Loading

- [x] Agregar `from sqlalchemy.orm import joinedload` en `ticket_repo.py`.
- [x] Actualizar `listar_tickets` con joinedload(categoria, solicitante, tecnico).
- [x] Actualizar `obtener_ticket` con los mismos joinedload.
- [x] Ejecutar GET /api/v1/tickets y verificar 1 sola consulta con JOIN (después).

## 2. Caché Cache-Aside

- [x] Crear `backend/app/repository/categoria_repo.py` con `@lru_cache`.
- [x] Agregar función `invalidar_cache_categorias()` con `cache_clear()`.
- [x] Crear `backend/app/routes/categorias.py` con GET /api/v1/categorias.
- [x] Registrar router en `main.py`.
- [x] Probar primera llamada (cache miss) — aparece SQL en terminal.
- [x] Probar segunda llamada (cache hit) — NO aparece SQL en terminal.

## 3. BackgroundTasks

- [x] Crear `backend/app/services/notificacion_svc.py` con crear_notificacion.
- [x] Actualizar POST /api/v1/tickets con BackgroundTasks.
- [x] Verificar respuesta 201 inmediata.
- [x] Verificar notificación en tabla `notificaciones` en phpMyAdmin.

## 4. Autenticación sin redundancia

- [x] Documentado en spec y tech-stack — implementación en feature 007.

## Cierre

- [x] Mover la feature a "Hecho" en `../../constitution/roadmap.md`. ✅