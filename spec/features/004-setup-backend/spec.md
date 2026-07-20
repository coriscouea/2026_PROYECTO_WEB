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
