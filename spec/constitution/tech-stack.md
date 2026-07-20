# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia técnica que ningún plan de feature debería contradecir._

## Tecnologías

- **Lenguaje backend:** Python 3.11+
- **Lenguaje frontend:** JavaScript + HTML5 + CSS3
- **Framework backend:** FastAPI — API REST, validación con Pydantic, documentación Swagger UI automática
- **ORM:** SQLAlchemy 2.0 — mapeo de entidades y consultas; Alembic para migraciones
- **Base de datos:** MySQL 8 (motor InnoDB) — integridad referencial y transacciones ACID
- **Framework frontend:** Ionic + Capacitor — interfaz multiplataforma (Android, iOS, PWA)
- **Patrón:** MVVM — View (Ionic), ViewModel (JS/axios), Model (FastAPI + SQLAlchemy)
- **Tests:** validación manual por endpoints Swagger en etapas iniciales
- **Despliegue:** PWA — instalable desde el navegador sin tienda de aplicaciones

## Archivos / módulos clave

- `backend/app/models/` — 8 clases SQLAlchemy que mapean las entidades de la base de datos.
- `backend/app/schemas/` — schemas Pydantic de entrada y salida (validación y serialización).
- `backend/app/repository/` — patrón repositorio: acceso a datos separado de la lógica de negocio.
- `backend/app/services/` — lógica de negocio y reglas de dominio.
- `backend/app/routes/` — endpoints FastAPI organizados por entidad.
- `backend/app/middleware/` — autenticación JWT y protección de rutas.
- `backend/app/core/` — funciones de seguridad (hash, generación y verificación de tokens).
- `backend/alembic/` — migraciones del esquema de base de datos con Alembic.
- `frontend/src/pages/` — pantallas Ionic (View en MVVM).
- `frontend/src/services/` — llamadas axios a la API (ViewModel en MVVM).
- `spec/constitution/` — reglas estables del proyecto; mandan sobre cualquier decisión de feature.
- `spec/features/` — una carpeta por feature con spec.md, plan.md y tasks.md.

## Comandos

**Backend:**
- `uvicorn app.main:app --reload` — arranca el servidor FastAPI en modo desarrollo.
- `alembic upgrade head` — aplica las migraciones pendientes a la base de datos.
- `alembic revision --autogenerate -m "descripcion"` — genera una migración automática.
- `pip install -r requirements.txt` — instala dependencias del backend.

**Frontend:**
- `ionic serve` — arranca el entorno local del frontend.
- `ionic build` — compila el frontend para producción.
- `npm install` — instala dependencias del frontend.

## Modelo de datos / dominio

- `Usuario.activo` — BOOLEAN, controla si el usuario está habilitado; nunca se elimina físicamente.
- `Usuario.id_rol` — FK → Roles; el rol por defecto al registrarse es siempre 'usuario'.
- `Tickets.estado` — ENUM(pendiente, en_proceso, finalizado); inicia siempre en 'pendiente'.
- `Tickets.id_tecnico_asignado` — nullable; se llena cuando un técnico toma el ticket desde su bandeja.
- `Historial_Estado` — se inserta automáticamente en cada cambio de Tickets.estado.
- `Notificaciones.leida` — BOOLEAN DEFAULT FALSE; se marca TRUE cuando el usuario la visualiza.
- `Categorias` — valores fijos: Técnica, Redes, ERP; determinan a qué bandeja va el ticket.

## Índices estratégicos

| Tabla | Campo(s) indexado(s) | Motivo |
|---|---|---|
| Usuario | `email` | Login — búsqueda por email en cada autenticación |
| Tickets | `estado` | Filtro de bandeja — consulta más frecuente |
| Tickets | `id_categoria` | Enrutamiento por categoría al crear ticket |
| Tickets | `id_usuario` | Listado de tickets por solicitante |
| Historial_Estado | `id_ticket` | Consulta del historial de un ticket |
| Comentarios | `id_ticket` | Carga de comentarios de un ticket |
| Notificaciones | `id_usuario`, `leida` | Bandeja de notificaciones no leídas |

## Optimizaciones de backend

- **Eager loading** — `joinedload` en SQLAlchemy para relaciones que siempre se necesitan (categoria, solicitante, tecnico en Tickets). Previene el problema N+1.
- **Lazy loading** — comportamiento por defecto para relaciones que solo se necesitan en casos específicos (comentarios, historial).
- **Caché cache-aside** — `functools.lru_cache` para datos estáticos (categorías, roles). TTL de 300 segundos. Invalidación explícita con `cache_clear()`. Redis en versión futura (feature 017).
- **BackgroundTasks** — FastAPI `BackgroundTasks` para procesamiento asíncrono de notificaciones sin bloquear la respuesta al cliente.
- **JWT sin consultas redundantes** — el rol del usuario viaja en el payload del token; el middleware de autorización no consulta la BD en cada request.

## Autenticación y autorización

- **Mecanismo:** JWT (JSON Web Token) con algoritmo HS256.
- **Access token** — vida: 30 minutos. Se adjunta en cada solicitud protegida en el encabezado `Authorization: Bearer <token>`.
- **Refresh token** — vida: 1 día. Solo se envía al endpoint `POST /auth/refresh`.
- **Payload del JWT** — solo incluir lo mínimo: `sub` (id_usuario), `email`, `rol`, `iat`, `exp`.
- **Endpoints públicos** — no requieren token: `POST /auth/registro`, `POST /auth/login`.
- **RBAC** — el rol viene en el payload del JWT; el middleware lee el rol sin consultar la BD.
- **Código 401** — token ausente, inválido o expirado.
- **Código 403** — token válido pero rol insuficiente.
- **Código 429** — rate limiting en login (prevención de fuerza bruta).

## Seguridad de la API

- **CORS** — configurar restrictivamente los orígenes permitidos desde `.env`.
- **Rate limiting** — aplicar en `POST /auth/login` con slowapi → 429 al superar el límite.
- **IDOR** — verificar siempre que el recurso pertenece al usuario autenticado antes de ejecutar la operación.
- **No registrar en logs** contraseñas, tokens completos ni información sensible.
- **Claves JWT y credenciales** solo en variables de entorno `.env` — nunca en el código fuente.

## Idempotencia

| Método | Idempotente | Implicación para HelpDesk Web |
|---|---|---|
| GET | Sí | Listar o consultar tickets/usuarios es seguro de reintentar |
| POST | No | Crear un ticket dos veces crea dos tickets — la capa service verifica unicidad |
| PATCH | No necesariamente | La regla de transición de estados lo controla |
| DELETE | Sí | Desactivar un usuario ya inactivo devuelve 400 |

## Soft delete

El soft delete usa un solo campo: `activo: BOOLEAN DEFAULT TRUE`. Cuando un registro se desactiva, `activo` cambia a `FALSE` pero el registro permanece en la base de datos indefinidamente, garantizando trazabilidad completa (reglas de negocio 3 y 4). Ningún registro de tickets ni usuarios se elimina físicamente, nunca.

## Convenciones

- Nombres de tablas en snake_case y plural: `tickets`, `historial_estado`.
- Claves primarias: `id_<entidad>` INT autoincremental.
- Claves foráneas: `id_<entidad_referenciada>` INT.
- Todos los endpoints bajo prefijo `/api/v1/`.
- Idioma del código: inglés para variables y funciones; español para comentarios y documentación.
- Soft delete obligatorio: usar `activo = FALSE` en lugar de `DELETE`.
- Validaciones de entrada en la capa FastAPI (Pydantic schemas).
- Formato de respuesta: `{exito, datos, mensaje}` para éxito; `{exito, errores, mensaje}` para error.

## Estilo visual

- Framework de componentes: Ionic UI.
- Responsive obligatorio: móvil (380px) y escritorio (1280px).
- Iconografía: Ionicons (incluido en Ionic).

## Optimizaciones futuras (backlog)

- **Redis** — caché distribuida para múltiples instancias y colas de trabajo persistentes (feature 017).
- **Lazy loading / N+1** — revisión de consultas con `joinedload`/`selectinload` (feature 016).
- **Encriptación extremo a extremo** — seguridad en tránsito entre Ionic y FastAPI (feature 018).

## Límites duros

- No escribir SQL manual — todo acceso a datos pasa por SQLAlchemy.
- No eliminar registros físicamente — solo soft delete con campo `activo`.
- No subir archivos `.env` al repositorio — usar `.env.example` como referencia.
- No implementar ninguna feature sin su `spec.md` aprobado previamente.
- No usar Flask — reemplazado por FastAPI desde la semana 5.
- Las contraseñas nunca se almacenan en texto plano — siempre como hash bcrypt.

