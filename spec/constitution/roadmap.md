# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

1. **000 · Propuesta de aplicación** — define el problema, público objetivo y funcionalidades principales de HelpDesk Web.
2. **001 · Diseño de base de datos** — modelo de 8 entidades normalizadas, relaciones, reglas de negocio y diagrama ER.
3. **002 · Selección de ORM** — comparación SQLAlchemy vs Django ORM y justificación técnica de la elección.
4. **003 · Constitution SDD** — estructura spec/ con mission.md, tech-stack.md y roadmap.md.

## Siguiente 🔜

_Lo próximo a abordar. Idealmente una sola feature "en curso" a la vez._

5. **004 · Setup backend** — configuración inicial de FastAPI + SQLAlchemy + Alembic con conexión a MySQL.
6. **005 · CRUD Tickets** — endpoints Create, Read, Update y soft delete de tickets; validaciones, reglas de negocio y pruebas Postman.
7. **006 · CRUD Usuarios** — crear, consultar, desactivar usuarios; gestión de sucursales y roles.
8. **008 · Optimización del backend** — eager loading, caché cache-aside, BackgroundTasks y JWT sin consultas redundantes.

## Backlog / ideas 💡

_Sin comprometer ni ordenar del todo. Ideas que respetan la constitución._

- **007 · Autenticación y roles** — login con JWT/cookies de sesión, protección de endpoints por rol. (Semana 9 según el profesor)
- **008 · Bandeja por rol** — vista filtrada por rol (técnico, mesa de ayuda); tomar ticket manualmente.
- **009 · Historial de estados** — registro automático con transacción ACID: cambiar estado + insertar historial como operación atómica.
- **010 · Comentarios** — agregar y consultar comentarios de seguimiento en cada ticket.
- **011 · Notificaciones** — generar notificación automática al asignar ticket o cambiar estado.
- **012 · Métricas básicas** — tiempo promedio de resolución, tickets por categoría y por sucursal.
- **013 · Frontend login** — pantalla de inicio de sesión en Ionic conectada al backend.
- **014 · Frontend tickets** — pantallas de crear ticket, bandeja y detalle/seguimiento.
- **015 · PWA y despliegue** — configuración de service worker, instalación y despliegue final.
- **016 · Índices y N+1** — revisión de consultas SQLAlchemy con `joinedload`/`selectinload` para evitar el problema N+1; validación de índices en tablas críticas.
- **017 · Redis y caché** — caché de consultas repetitivas (categorías, roles, sucursales) y ejecución de tareas pesadas en segundo plano con Redis.
- **018 · Encriptación extremo a extremo** — seguridad en tránsito entre Ionic y FastAPI para datos sensibles.

## Optimizaciones pendientes 🔧

_Aplicar cuando el sistema base esté funcionando — no antes._

- **N+1 con joinedload** — usar `selectinload` o `joinedload` en SQLAlchemy para evitar consultas repetitivas al listar tickets con usuario y categoría.
- **Cache con Redis** — cachear consultas de alta frecuencia (listado de categorías, roles, sucursales) que cambian poco y se consultan en cada ticket creado. Redis también para tareas pesadas en segundo plano.
- **Cron job de limpieza** — eliminar físicamente registros con `deleted_at` mayor a 30 días para evitar acumulación de registros basura en la base de datos.
- **Lazy Loading en el frontend** — cargar tickets en la bandeja de forma paginada y progresiva, no todos de golpe.
- **Encriptación extremo a extremo** — en datos sensibles que viajen entre la app móvil y el backend (a revisar con el profesor en semanas de seguridad).

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
