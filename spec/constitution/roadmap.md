# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

1. **000 · Propuesta de aplicación** — define el problema, público objetivo y funcionalidades principales de HelpDesk Web.
2. **001 · Diseño de base de datos** — modelo de 8 entidades normalizadas, relaciones, reglas de negocio y diagrama ER.
3. **002 · Selección de ORM** — comparación SQLAlchemy vs Django ORM y justificación técnica de la elección.
4. **003 · Constitution SDD** — estructura spec/ con mission.md, tech-stack.md y roadmap.md.
5. **004 · Setup backend** — FastAPI + SQLAlchemy + Alembic + 8 modelos + migración inicial en MySQL. Swagger UI en /docs.
6. **005 · CRUD Tickets** — 5 endpoints REST (POST, GET, GET/{id}, PATCH, DELETE) con validaciones Pydantic, regla de transición de estados y soft delete. Probado en Swagger.
7. **006 · CRUD Usuarios** — 5 endpoints REST con hash bcrypt, asignación de rol por defecto, email único y soft delete. Probado en Swagger.
8. **008 · Optimización del backend** — eager loading con joinedload, caché cache-aside con lru_cache, BackgroundTasks para notificaciones asíncronas. Comparación antes/después documentada.
9. **007 · Autenticación y roles** — login con JWT, access token (30 min) + refresh token (1 día), middleware de protección de rutas por rol (RBAC sin consulta a BD), rate limiting con slowapi en `/auth/login` (5/min), filtrado de tickets por pertenencia/categoría (mitigación IDOR), respuestas de error estandarizadas `{exito, errores, mensaje}`. Probado en Postman/Swagger. (Semana 9)

## Siguiente 🔜

_Lo próximo a abordar. Idealmente una sola feature "en curso" a la vez._

_Semanas 10-12 — backend completo antes de tocar frontend._

10. **009 · Historial de eventos del ticket** — registro de todos los eventos (creación, asignación, cambio estado, comentario, cambio prioridad, cierre) con tipo_evento, descripción, usuario y fecha. Línea de tiempo completa.
11. **010 · Comentarios** — CRUD de comentarios por ticket, ordenados por fecha ascendente, con autor y timestamp.
12. **011 · Notificaciones avanzadas** — marcar como leída, contar no leídas, listar solo pendientes.
13. **012 · Métricas básicas** — tickets abiertos/cerrados, por categoría, por técnico, tiempo promedio de resolución. Calculado en la API.
14. **019 · Logging estructurado** — reemplazar prints por logging con niveles INFO/WARNING/ERROR.
15. **020 · Configuración centralizada** — clase Settings de Pydantic que centralice todas las variables de entorno.

## Backlog / ideas 💡

_Sin comprometer ni ordenar del todo. Ideas que respetan la constitución._

_Semanas 12-16 — frontend, calidad y despliegue._

- **013 · Frontend login** — pantalla de inicio de sesión en Ionic.
- **014 · Frontend tickets** — bandeja, detalle y crear ticket en Ionic.
- **015 · PWA y despliegue** — service worker, instalación y despliegue final.
- **021 · Rotación de refresh token** — invalidar refresh token anterior al renovar.
- **022 · Pruebas automatizadas** — pytest cubriendo auth, CRUD, validaciones y reglas de negocio.
- **023 · Docker** — docker-compose.yml con FastAPI + MySQL para levantar con un comando.
- **016 · Índices y N+1** — revisión de consultas SQLAlchemy con joinedload/selectinload.
- **017 · Redis y caché distribuida** — caché de consultas repetitivas y colas con Celery.
- **018 · Encriptación extremo a extremo** — HTTPS/TLS en producción.

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
