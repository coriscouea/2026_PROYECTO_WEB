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

## Siguiente 🔜

_Lo próximo a abordar. Idealmente una sola feature "en curso" a la vez._

9. **007 · Autenticación y roles** — login con JWT, access token + refresh token, middleware de protección de rutas por rol, rate limiting en login. (Semana 9)

## Backlog / ideas 💡

_Sin comprometer ni ordenar del todo. Ideas que respetan la constitución._

- **009 · Historial de estados** — registro automático con transacción ACID: cambiar estado + insertar historial como operación atómica.
- **010 · Comentarios** — agregar y consultar comentarios de seguimiento en cada ticket.
- **011 · Notificaciones avanzadas** — marcar como leídas, listar por usuario, filtrar no leídas.
- **012 · Métricas básicas** — tiempo promedio de resolución, tickets por categoría y por sucursal.
- **013 · Frontend login** — pantalla de inicio de sesión en Ionic conectada al backend.
- **014 · Frontend tickets** — pantallas de crear ticket, bandeja y detalle/seguimiento.
- **015 · PWA y despliegue** — configuración de service worker, instalación y despliegue final.
- **016 · Índices y N+1** — revisión de consultas SQLAlchemy con `joinedload`/`selectinload`; validación de índices en tablas críticas.
- **017 · Redis y caché distribuida** — caché de consultas repetitivas y colas de trabajo persistentes con Celery.
- **018 · Encriptación extremo a extremo** — seguridad en tránsito entre Ionic y FastAPI para datos sensibles.

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
