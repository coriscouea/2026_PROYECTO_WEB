# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia técnica que ningún plan de feature debería contradecir._

## Tecnologías

- **Lenguaje backend:** Python 3.11+
- **Lenguaje frontend:** JavaScript + HTML5 + CSS3
- **Framework backend:** FastAPI — API REST, validación con Pydantic, documentación Swagger UI automática
- **ORM:** SQLAlchemy 2.0 — mapeo de entidades y consultas; Alembic para migraciones
- **Base de datos:** MySQL 8 (motor InnoDB) — integridad referencial y transacciones ACID
- **Framework frontend:** Ionic + Capacitor — interfaz multiplataforma (Android, iOS, PWA)
- **Autenticación:** JWT con python-jose (HS256)
- **Patrón:** MVVM — View (Ionic), ViewModel (JS/axios), Model (FastAPI + SQLAlchemy)
- **Tests:** validación manual por endpoints Swagger en etapas iniciales
- **Despliegue:** PWA — instalable desde el navegador sin tienda de aplicaciones
- **Metodología:** SDD (Spec-Driven Development)

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
- `uvicorn app.main:app --reload` — servidor de desarrollo
- `uvicorn app.main:app --host 0.0.0.0 --port 8000` — accesible desde la red local (pruebas móvil)
- `alembic upgrade head` — aplicar migraciones
- `alembic revision --autogenerate -m "descripcion"` — generar migración
- `pip install -r requirements.txt` — instalar dependencias
- `pytest` — ejecutar pruebas automatizadas (feature 022)

**Frontend:**
- `ionic serve` — servidor de desarrollo web
- `ionic serve --host 0.0.0.0` — accesible desde celular en red local WiFi
- `ionic build --prod` — compilar para producción (genera PWA)
- `npx cap sync` — sincronizar código web con proyectos nativos
- `npx cap open android` — abrir en Android Studio para generar .apk
- `npx cap open ios` — abrir en Xcode para generar .ipa (requiere Mac)

## Despliegue multiplataforma

Ionic + Capacitor permite generar las tres plataformas desde un único código fuente:

```
Código Ionic (HTML/CSS/JS)
        ↓
┌─────────────────────────────────┐
│     Capacitor (puente nativo)   │
├──────────┬──────────┬───────────┤
│ Android  │   iOS    │  PWA/Web  │
│  .apk    │  .ipa    │           │
└──────────┴──────────┴───────────┘
```

| Plataforma | Herramienta requerida | Resultado |
|---|---|---|
| PWA / PC | Solo navegador | Instalable desde el browser |
| Android | Android Studio | Archivo .apk |
| iOS | Xcode + Mac | Archivo .ipa |

**Para la defensa universitaria:**
- PC → navegador normal en la computadora
- Android → celular con .apk instalado o red local WiFi
- iOS → simulador Xcode (si se tiene Mac)

**Prueba en red local:**
El celular y la computadora deben estar en la misma red WiFi. El backend corre con `--host 0.0.0.0` y el frontend con `ionic serve --host 0.0.0.0`. El celular accede por la IP local de la computadora.


## Modelo de datos

- `Usuario.activo` — BOOLEAN; nunca se elimina físicamente (regla 4)
- `Tickets.estado` — ENUM(pendiente, en_proceso, finalizado); inicia en pendiente
- `Tickets.id_tecnico_asignado` — nullable; se llena cuando un técnico toma el ticket
- `Historial_Ticket` — registra todos los eventos del ticket, no solo cambios de estado
- `Notificaciones.leida` — BOOLEAN DEFAULT FALSE

## Índices estratégicos

| Tabla | Campo(s) | Motivo |
|---|---|---|
| Usuario | `email` | Login — búsqueda por email |
| Tickets | `estado` | Filtro de bandeja |
| Tickets | `id_categoria` | Enrutamiento por categoría |
| Tickets | `id_usuario` | Tickets por solicitante |
| Historial_Ticket | `id_ticket` | Historial de un ticket |
| Comentarios | `id_ticket` | Comentarios de un ticket |
| Notificaciones | `id_usuario`, `leida` | Notificaciones no leídas |

## Optimizaciones de backend

- **Eager loading** — `joinedload` en SQLAlchemy para relaciones que siempre se necesitan (categoria, solicitante, tecnico en Tickets). Previene el problema N+1.
- **Lazy loading** — comportamiento por defecto para relaciones que solo se necesitan en casos específicos (comentarios, historial).
- **Caché cache-aside** — `functools.lru_cache` para datos estáticos (categorías, roles). TTL de 300 segundos. Invalidación explícita con `cache_clear()`. Redis en versión futura (feature 017).
- **BackgroundTasks** — FastAPI `BackgroundTasks` para procesamiento asíncrono de notificaciones sin bloquear la respuesta al cliente.
- **JWT sin consultas redundantes** — el rol del usuario viaja en el payload del token; el middleware de autorización no consulta la BD en cada request.
- **Filtro SQL** — activos/inactivos/todos aplicado en SQL antes de paginar

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
- **Escalada de roles:** `/auth/registro` siempre fuerza `id_rol = usuario` ignorando el body
- **Sanitización XSS:** bleach.clean() en titulo, descripcion, nombre y texto de comentarios

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
- Logging con niveles INFO/WARNING/ERROR (feature 019)

## Estilo visual

- Framework de componentes: Ionic UI.
- Responsive obligatorio: móvil (380px) y escritorio (1280px).
- Iconografía: Ionicons (incluido en Ionic).

## Optimizaciones futuras (backlog)

- Redis para caché distribuida y colas persistentes (feature 017)
- Pruebas automatizadas con pytest (feature 022)
- Docker con docker-compose (feature 023)
- Rotación de refresh token (feature 021)
- Configuración centralizada con Pydantic Settings (feature 020)
- Logging estructurado (feature 019)

## Límites duros

- No escribir SQL manual — todo acceso a datos pasa por SQLAlchemy.
- No eliminar registros físicamente — solo soft delete con campo `activo`.
- No subir archivos `.env` al repositorio — usar `.env.example` como referencia.
- No implementar ninguna feature sin su `spec.md` aprobado previamente.
- No usar Flask — reemplazado por FastAPI desde la semana 5.
- Las contraseñas nunca se almacenan en texto plano — siempre como hash bcrypt.
- No loguear passwords, tokens ni datos sensibles

