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

## Backlog / ideas 💡

_Sin comprometer ni ordenar del todo. Ideas que respetan la constitución._

- **005 · Autenticación y roles** — login con JWT, asignación de rol por administrador, protección de endpoints.
- **006 · CRUD Usuarios** — crear, consultar, desactivar usuarios; gestión de sucursales y roles.
- **007 · CRUD Tickets** — registrar, listar y actualizar tickets; enrutamiento a bandeja por categoría.
- **008 · Bandeja por rol** — vista filtrada por rol (técnico, mesa de ayuda); tomar ticket manualmente.
- **009 · Historial de estados** — registro automático de cada cambio de estado con fecha y responsable.
- **010 · Comentarios** — agregar y consultar comentarios de seguimiento en cada ticket.
- **011 · Notificaciones** — generar notificación automática al asignar ticket o cambiar estado.
- **012 · Métricas básicas** — tiempo promedio de resolución, tickets por categoría y por sucursal.
- **013 · Frontend login** — pantalla de inicio de sesión en Ionic conectada al backend.
- **014 · Frontend tickets** — pantallas de crear ticket, bandeja y detalle/seguimiento.
- **015 · PWA y despliegue** — configuración de service worker, instalación y despliegue final.

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
