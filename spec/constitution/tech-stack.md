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

## Límites duros

- No escribir SQL manual — todo acceso a datos pasa por SQLAlchemy.
- No eliminar registros físicamente — solo soft delete con campo `activo`.
- No subir archivos `.env` al repositorio — usar `.env.example` como referencia.
- No implementar ninguna feature sin su `spec.md` aprobado previamente.
- No usar Flask — decisión reemplazada por FastAPI desde la semana 5.
- Las contraseñas nunca se almacenan en texto plano — siempre como hash.
