# 004 · Setup Backend — Spec

**Estado:** propuesta

## Qué hace

Configura la base del servidor backend: instala FastAPI, conecta SQLAlchemy
a MySQL, define las 8 entidades como clases Python y deja Alembic listo
para gestionar las migraciones del esquema de base de datos.

## Por qué

Sin esta base no es posible implementar ninguna feature posterior. Es el
cimiento sobre el que se construyen autenticación, tickets, historial y
notificaciones. Debe completarse antes de tocar cualquier lógica de negocio.

## Criterios de aceptación

- [ ] El servidor FastAPI arranca sin errores con `uvicorn app.main:app --reload`.
- [ ] SQLAlchemy se conecta exitosamente a MySQL y no lanza excepciones al iniciar.
- [ ] Las 8 entidades (Usuario, Roles, Sucursales, Categorías, Tickets, Comentarios, Historial_Estado, Notificaciones) existen como clases en `backend/app/models/`.
- [ ] `alembic upgrade head` crea las tablas correctamente en la base de datos.
- [ ] La documentación Swagger UI es accesible en `http://localhost:8000/docs`.
- [ ] Las variables de entorno (host, puerto, credenciales MySQL) se leen desde `.env` y no están hardcodeadas.

## Fuera de alcance

- Autenticación y manejo de roles (→ feature 005).
- Endpoints CRUD de tickets o usuarios (→ features 006 y 007).
- Datos de prueba o seeders (→ se definirán en cada feature correspondiente).
