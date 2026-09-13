# 004 · Setup Backend — Spec

**Estado:** implementado ✅

## Qué hace

Configura la base del servidor backend: instala FastAPI, conecta SQLAlchemy
a MySQL, define las 8 entidades como clases Python y deja Alembic listo
para gestionar las migraciones del esquema de base de datos.

## Por qué

Sin esta base no es posible implementar ninguna feature posterior. Es el
cimiento sobre el que se construyen autenticación, tickets, historial y
notificaciones. Debe completarse antes de tocar cualquier lógica de negocio.

## Criterios de aceptación

- [X] El servidor FastAPI arranca sin errores con `uvicorn app.main:app --reload`.
- [X] SQLAlchemy se conecta exitosamente a MySQL y no lanza excepciones al iniciar.
- [X] Las 8 entidades (Usuario, Roles, Sucursales, Categorías, Tickets, Comentarios, Historial_Estado, Notificaciones) existen como clases en `backend/app/models/`.
- [X] `alembic upgrade head` crea las tablas correctamente en la base de datos.
- [X] La documentación Swagger UI es accesible en `http://localhost:8000/docs`.
- [X] Las variables de entorno (host, puerto, credenciales MySQL) se leen desde `.env`.

## Fuera de alcance

- Autenticación y manejo de roles (→ feature 005).
- Endpoints CRUD de tickets o usuarios (→ features 006 y 007).

## Revisión posterior

- **Doble fuente de esquema** — corregido en revisión (Semana 13): `main.py` llamaba `Base.metadata.create_all(bind=engine)` en cada arranque, además de las migraciones de Alembic. Con Alembic ya consolidado (feature 020), esto podía crear tablas sin registrar el `alembic_version` correspondiente y esconder migraciones faltantes. Se eliminó `create_all` — Alembic es ahora la única fuente de verdad del esquema, como ya indicaba `tech-stack.md` ("No escribir SQL manual... todo acceso a datos pasa por SQLAlchemy" y el flujo de Alembic).
