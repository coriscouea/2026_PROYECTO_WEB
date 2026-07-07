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
- **Tests:** por definir en cada feature (validación manual por endpoints Swagger en etapas iniciales)
- **Despliegue:** PWA — instalable desde el navegador sin tienda de aplicaciones

## Archivos / módulos clave

- `backend/app/models/` — clases SQLAlchemy que mapean las 8 entidades de la base de datos.
- `backend/app/routes/` — endpoints FastAPI organizados por entidad (tickets, usuarios, auth…).
- `backend/app/repository/` — patrón repositorio: acceso a datos separado de la lógica de negocio.
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

## Índices de base de datos

Crear índices solo en campos estratégicos — no en todas las tablas. Los índices aceleran las consultas más frecuentes y son la primera defensa contra el problema N+1.

| Tabla            | Campo(s)             | Motivo                                              |
|------------------|----------------------|-----------------------------------------------------|
| Usuario          | `email`              | Búsqueda en login — consulta de alta frecuencia     |
| Usuario          | `id_rol`             | Filtro de bandeja por rol                           |
| Tickets          | `estado`             | Filtro principal de la bandeja compartida           |
| Tickets          | `id_usuario`         | Consulta de tickets del solicitante                 |
| Tickets          | `id_tecnico_asignado`| Consulta de tickets asignados al técnico            |
| Tickets          | `id_categoria`       | Filtro por categoría para métricas                  |
| Historial_Estado | `id_ticket`          | Consulta del historial de un ticket específico      |
| Comentarios      | `id_ticket`          | Consulta de comentarios de un ticket específico     |
| Notificaciones   | `id_usuario`         | Consulta de notificaciones del usuario autenticado  |

## Convenciones

- Nombres de tablas en snake_case y plural: `tickets`, `historial_estado`.
- Claves primarias: `id_<entidad>` INT autoincremental.
- Claves foráneas: `id_<entidad_referenciada>` INT.
- Todos los endpoints bajo prefijo `/api/v1/`.
- Idioma del código: inglés para variables y funciones; español para comentarios y documentación.
- Soft delete obligatorio: usar `activo = FALSE` en lugar de `DELETE`.
- Validaciones de entrada en la capa FastAPI (Pydantic schemas), no en la capa de base de datos.

## Estilo visual

- Framework de componentes: Ionic UI — usar componentes nativos de Ionic (ion-card, ion-list, ion-button).
- Tema: modo claro por defecto; colores corporativos neutros (pendiente de definir paleta).
- Responsive obligatorio: la interfaz debe funcionar en móvil (380px) y escritorio (1280px).
- Iconografía: Ionicons (incluido en Ionic).

## Idempotencia

Un método es idempotente cuando ejecutarlo varias veces con los mismos parámetros produce el mismo resultado que ejecutarlo una sola vez. Esto es crítico para el frontend Ionic cuando hay fallas de red y se reintenta automáticamente una solicitud.

| Método | Idempotente | Implicación para HelpDesk Web |
|--------|-------------|-------------------------------|
| GET    | Sí          | Listar o consultar tickets/usuarios es siempre seguro de reintentar |
| POST   | No          | Crear un ticket dos veces crea dos tickets — la capa service debe verificar unicidad antes del INSERT |
| PATCH  | No necesariamente | Cambiar estado de un ticket dos veces puede tener efectos distintos — la regla de transición de estados lo controla |
| DELETE | Sí          | Desactivar un usuario ya inactivo devuelve 400, no genera un segundo efecto |

**Regla práctica:** el frontend nunca reintenta automáticamente un POST sin confirmación del usuario. Para GET, PATCH y DELETE el reintento es seguro.

## Soft delete

El soft delete usa un solo campo: `activo: BOOLEAN DEFAULT TRUE`. Cuando un registro se desactiva, `activo` cambia a `FALSE` pero el registro permanece en la base de datos indefinidamente, garantizando trazabilidad completa (reglas de negocio 3 y 4). Ningún registro de tickets ni usuarios se elimina físicamente, nunca.

## Optimizaciones futuras (backlog)

- **Redis** — caché para consultas repetitivas de alto tráfico (categorías, roles, sucursales) y ejecución de tareas pesadas en segundo plano.
- **Lazy loading** — carga diferida de relaciones en SQLAlchemy para evitar el problema N+1.
- **Encriptación extremo a extremo** — para datos sensibles en tránsito entre Ionic y FastAPI.

## Autenticación y autorización

- **Mecanismo:** JWT (JSON Web Token) con algoritmo HS256.
- **Access token** — vida corta: 15 minutos. Se adjunta en cada solicitud protegida en el encabezado `Authorization: Bearer <token>`.
- **Refresh token** — vida larga: 7 días. Solo se envía al endpoint `POST /auth/refresh` para renovar el access token sin relogin.
- **Payload del JWT** — solo incluir lo mínimo necesario: `sub` (id_usuario), `rol`, `iat` (emisión), `exp` (expiración). Nunca incluir contraseñas ni datos sensibles.
- **Endpoints públicos** — no requieren token: `POST /auth/registro`, `POST /auth/login`.
- **Endpoints protegidos** — requieren access token válido en el encabezado Authorization.
- **RBAC** — el rol viene en el payload del JWT; el middleware de autorización lo lee sin consultar la base de datos en cada solicitud.
- **Código 401** — token ausente, inválido o expirado.
- **Código 403** — token válido pero rol insuficiente para la operación.
- **Código 429** — demasiadas solicitudes al endpoint de login (rate limiting para prevenir fuerza bruta).

## Seguridad de la API

- **CORS** — configurar restrictivamente qué orígenes pueden consumir la API; en desarrollo solo `localhost`, en producción solo el dominio de la app.
- **Rate limiting** — aplicar en `POST /auth/login` para dificultar ataques de fuerza bruta sobre contraseñas; responde 429 al superar el límite.
- **IDOR (Insecure Direct Object Reference)** — riesgo crítico: un usuario no debe poder acceder ni modificar recursos de otro usuario cambiando el ID en la URL. Mitigación: verificar siempre que el recurso pertenece al usuario autenticado antes de ejecutar la operación.
- **No registrar en logs** contraseñas, tokens completos ni información sensible, ni siquiera con fines de depuración.
- **Claves JWT y credenciales** solo en variables de entorno (`.env`) — nunca en el código fuente ni en el repositorio.

## Límites duros

- No escribir SQL manual — todo acceso a datos pasa por SQLAlchemy.
- No eliminar registros físicamente — solo soft delete con campo `activo`.
- No subir archivos `.env` al repositorio — usar `.env.example` como referencia.
- No implementar ninguna feature sin su `spec.md` aprobado previamente.
- No usar Flask — decisión reemplazada por FastAPI desde la semana 5.
- Las contraseñas nunca se almacenan en texto plano — siempre como hash.
