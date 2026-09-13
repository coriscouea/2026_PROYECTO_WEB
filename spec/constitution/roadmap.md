# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

1. **000 · Propuesta de aplicación** — define el problema, público objetivo y funcionalidades principales de HelpDesk Web.
2. **001 · Diseño de base de datos** — modelo de 8 entidades normalizadas, relaciones, reglas de negocio y diagrama ER.
3. **002 · Selección de ORM** — comparación SQLAlchemy vs Django ORM y justificación técnica de la elección.
4. **003 · Constitution SDD** — estructura spec/ con mission.md, tech-stack.md y roadmap.md.
5. **004 · Setup backend** — FastAPI + SQLAlchemy + Alembic + 8 modelos + migración inicial en MySQL. Swagger UI en /docs.
6. **005 · CRUD Tickets** — 5 endpoints REST (POST, GET, GET/{id}, PATCH, DELETE) con validaciones Pydantic, regla de transición de estados y soft delete. Probado en Swagger. Revisión posterior (Semana 13): corregido IDOR/spoofing en `POST /api/v1/tickets` (`id_usuario` se aceptaba del body sin comparar contra el JWT — ahora se fuerza siempre desde el token); agregada validación de rol al asignar técnico (`id_tecnico_asignado` debe tener rol técnico/mesa_ayuda/admin).
7. **006 · CRUD Usuarios** — 5 endpoints REST con hash bcrypt, asignación de rol por defecto, email único y soft delete. Probado en Swagger.
8. **008 · Optimización del backend** — eager loading con joinedload, caché cache-aside con lru_cache, BackgroundTasks para notificaciones asíncronas. Comparación antes/después documentada.
9. **007 · Autenticación y roles** — login con JWT, access token (30 min) + refresh token (1 día), middleware de protección de rutas por rol (RBAC sin consulta a BD), rate limiting con slowapi en `/auth/login` (5/min), filtrado de tickets por pertenencia/categoría (mitigación IDOR), respuestas de error estandarizadas `{exito, errores, mensaje}`. Probado en Postman/Swagger. (Semana 9). Revisión posterior: corregida escalada de roles en `/auth/registro` (forzaba rol por defecto solo si no venía `id_rol` — ahora lo sobreescribe siempre). Revisión posterior (Semana 13): `svc_refresh` no validaba `usuario.activo` — un usuario desactivado podía seguir renovando su access token hasta por 1 día; ahora aplica el mismo chequeo que el login.
10. **009 · Historial de eventos del ticket** — registro de todos los eventos (creación, asignación, cambio estado, comentario, cambio prioridad, cierre) con tipo_evento, descripción, usuario y fecha. Línea de tiempo completa. Registro y operación principal son atómicos (una sola transacción) en creación/actualización/desactivación de ticket y en creación de comentario.
11. **010 · Comentarios** — CRUD de comentarios por ticket, ordenados por fecha ascendente, con autor y timestamp.
12. **011 · Notificaciones avanzadas** — marcar como leída, contar no leídas, listar solo pendientes.
13. **012 · Métricas básicas** — tickets abiertos/cerrados, por categoría, por técnico, tiempo promedio de resolución. Calculado en la API. Revisión posterior: corregido bug de filtro (`estado == True` → `activo == True`) que rompía el conteo por estado/categoría/técnico.
14. **013 · Frontend login** — glassmorphism oscuro, JWT en almacenamiento seguro (ver feature 024), enter para login, registro con validaciones UX y barra de fortaleza. Revisión posterior (Semana 13): cerrados los dos puntos del plan original que habían quedado sin implementar — se creó `services/http.ts`, cliente Axios centralizado con interceptor de autenticación (adjunta el token) e interceptor de renovación automática (captura 401, usa el refresh token, reintenta la petición original una sola vez, cola para peticiones concurrentes). Todos los servicios (`ticket.ts`, `usuario.ts`, `metricas.ts`, `notificacion.ts`, `auth.ts`, `registro.page.ts`) migraron a este cliente único.
15. **014 · Frontend tickets** — bandeja con dashboard por rol, detalle con historial+comentarios, crear ticket, cambiar estado, tomar ticket, desactivar ticket (admin), sidebar árbol de navegación, gestión de usuarios, dashboard de métricas.
16. **015 · PWA y despliegue** — ionic build --prod, manifest.webmanifest, instalable en PC (Edge) y Android vía WiFi, script iniciar_helpdesk.bat.
17. **016 · Índices y N+1** — revisión de consultas SQLAlchemy con joinedload/selectinload.
18. **017 · Redis y caché distribuida** — caché de consultas repetitivas y colas con Celery.
19. **019 · Logging estructurado** — niveles INFO/WARNING/ERROR en main.py y middleware/auth.py, lifespan handler.
20. **020 · Configuración centralizada** — pydantic-settings en core/config.py, reemplaza os.getenv().
021. **021** Reset password Tabla solicitudes_reset, endpoint solicitar-reset, panel admin, cambio password
22. **022 · Sistema de diseño — Semana 10** — tokens de diseño en 3 niveles (primitivo/semántico/componente) en global.scss. Tipografía MD3, espaciado base 8px, radio, sombra, animaciones. Contraste WCAG AA verificado. 5 componentes Angular reutilizables: EstadoBadge, EmptyState, LoadingState, TicketCard, ErrorState. ErrorService traductor HTTP. 4 estados por pantalla. Accesibilidad aria-label completa. Responsivo con breakpoints y safe area.
23. **023 · Navegación y estado — Semana 11** — rutas públicas/protegidas con canActivate, redirectUrl en guard, validación blur en crear-ticket, errores 422 mapeados por campo, tipo cerrado EstadoRemoto<T>, borrador formulario con Preferences y flag ticketGuardado.
24. **024 · Persistencia offline — Semana 12** — tokens JWT en SecureStorage cifrado (Keychain/Keystore), caché local de tickets con localforage (IndexedDB), indicador de última sincronización, caducidad 24h, logout seguro LOPDP (limpia SecureStorage + Preferences + IndexedDB), prueba modo avión en emulador Android API 37.1.

## Siguiente 🔜

_Lo próximo a abordar. Idealmente una sola feature "en curso" a la vez._


## Backlog / ideas 💡

_Opcionales para versiones futuras._

- **025 · Pruebas de carga** — Locust con escenarios para los 4 roles.
- **026 · Cola de operaciones pendientes** — Outbox pattern para crear tickets offline.
- **027 · Pruebas automatizadas** — pytest cubriendo auth, CRUD, validaciones y reglas de negocio.
- **028 · Docker** — docker-compose.yml con FastAPI + MySQL para levantar con un comando.
- **029 · HTTPS/TLS** — certificado SSL para producción real.
- **030 · Rotación de refresh token** — invalidar refresh token anterior al renovar.

## Plan de frontend (detalle)

### 013 · Frontend login
- Pantalla de login con email y contraseña
- Validación de campos en el frontend
- Llamada a `POST /auth/login` con axios
- Guardar access_token y refresh_token en almacenamiento seguro de Capacitor
- Interceptor HTTP para adjuntar token en cada request
- Redirección automática al expirar token — usar refresh token
- Mensaje claro de error (401, 422)

### 014 · Frontend tickets
**Bandeja de tickets:**
- Lista de tickets con filtros: activos, inactivos, todos
- Tarjeta por ticket: número, título, categoría, estado, prioridad, fecha
- Filtro por estado y categoría
- Paginación con scroll infinito o botón "cargar más"
- Botón flotante para crear ticket (rol usuario)

**Crear ticket:**
- Formulario simple: título, descripción, categoría
- Selector de prioridad
- Llamada a `POST /api/v1/tickets`

**Detalle del ticket:**
- Información general del ticket
- Historial de eventos en línea de tiempo
- Sección de comentarios ordenados ASC
- Campo para agregar comentario
- Botones de acción según rol (cambiar estado, asignar técnico)

### 015 · PWA y despliegue
- `ionic build --prod` — genera carpeta `dist/`
- Configurar `manifest.json` — nombre, ícono, color tema
- Verificar service worker generado por Ionic
- `npx cap sync` — sincronizar con proyectos nativos
- `npx cap open android` — generar .apk en Android Studio
- Probar en celular Android conectado por USB o WiFi local
- Probar en PC como PWA instalable desde el navegador

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.