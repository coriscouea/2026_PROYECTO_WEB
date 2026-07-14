# 008 · Optimización del Backend — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Prerequisito
- [ ] Feature 005 (CRUD Tickets) completada y probada en Postman.

## 0. Diagnóstico previo — medir antes de optimizar

- [ ] Probar `GET /api/v1/tickets` sin eager loading y registrar tiempo de respuesta.
- [ ] Probar `GET /api/v1/categorias` sin caché y registrar tiempo de respuesta.
- [ ] Probar `POST /api/v1/tickets` con notificación síncrona y registrar tiempo de respuesta.
- [ ] Guardar capturas de Postman como evidencia de la línea base (antes).

## 1. Corrección N+1 — Eager Loading

- [ ] Abrir `backend/app/repository/ticket_repo.py`
- [ ] Agregar import: `from sqlalchemy.orm import joinedload`
- [ ] Actualizar `listar_tickets` con `joinedload`:
  ```python
  .options(
      joinedload(Ticket.categoria),
      joinedload(Ticket.solicitante),
      joinedload(Ticket.tecnico)
  )
  ```
- [ ] Actualizar `obtener_ticket` con los mismos `joinedload`
- [ ] Probar en Postman — verificar que la respuesta incluye datos de categoría y usuario
- [ ] Registrar captura de antes (sin joinedload) y después (con joinedload)

## 2. Caché Cache-Aside

- [ ] Crear `backend/app/repository/categoria_repo.py` con:
  - [ ] Función `listar_categorias(db)` con `@lru_cache(maxsize=1)`
  - [ ] Documentar tiempo de vida de 300 segundos
  - [ ] Agregar función `invalidar_cache_categorias()` con `cache_clear()`
- [ ] Crear `backend/app/routes/categorias.py` con:
  - [ ] `GET /api/v1/categorias` — devuelve lista desde caché
- [ ] Registrar el router en `backend/app/main.py`
- [ ] Agregar caché al endpoint `GET /api/v1/tickets/{id}` con invalidación al hacer PATCH.
- [ ] Llamar `cache_clear()` en el endpoint `PATCH /api/v1/tickets/{id}` tras actualizar.
- [ ] Probar en Postman — primera llamada (cache miss) y segunda llamada (cache hit).
- [ ] Registrar tiempos de respuesta de ambas llamadas como evidencia.
- [ ] Verificar que al actualizar un ticket, la siguiente consulta refleja datos frescos.

## 3. Tarea Asíncrona — BackgroundTasks

- [ ] Crear `backend/app/services/notificacion_svc.py` con:
  - [ ] Función `crear_notificacion(db, id_usuario, id_ticket, mensaje)`
  - [ ] Documentar que se ejecuta en background
- [ ] Actualizar `backend/app/routes/tickets.py`:
  - [ ] Agregar `BackgroundTasks` como parámetro en `POST /api/v1/tickets`
  - [ ] Llamar `background_tasks.add_task(crear_notificacion, ...)` después de crear el ticket
- [ ] Probar en Postman — verificar que el endpoint responde 201 inmediatamente
- [ ] Verificar en phpMyAdmin que la notificación se insertó en la tabla `notificaciones`

## 4. Autenticación sin consultas redundantes

- [ ] Revisar `backend/app/middleware/auth.py`
- [ ] Verificar que `get_current_user` NO hace `db.query(Usuario)` por request
- [ ] Confirmar que el rol se lee directamente del payload JWT
- [ ] Documentar este comportamiento como evidencia para el taller

## 5. Documentación y evidencias para el video

- [ ] Captura de Postman: `GET /api/v1/tickets` sin joinedload (tiempo de respuesta)
- [ ] Captura de Postman: `GET /api/v1/tickets` con joinedload (tiempo de respuesta)
- [ ] Captura de Postman: `GET /api/v1/categorias` primera llamada (cache miss)
- [ ] Captura de Postman: `GET /api/v1/categorias` segunda llamada (cache hit)
- [ ] Captura de Postman: `POST /api/v1/tickets` — respuesta inmediata 201
- [ ] Captura de phpMyAdmin: notificación insertada en tabla `notificaciones`
- [ ] Tabla comparativa antes/después completada

## Cierre

- [ ] Validar contra todos los criterios de aceptación de `spec.md`
- [ ] Subir cambios a GitHub con commit descriptivo
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`
