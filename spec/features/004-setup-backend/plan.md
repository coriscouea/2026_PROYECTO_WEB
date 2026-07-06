# 004 · Setup Backend — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Se crea la estructura base del backend en Python usando FastAPI como
framework y SQLAlchemy como ORM, siguiendo el patrón repositorio definido
en `constitution/tech-stack.md`. Las entidades se definen como clases
declarativas de SQLAlchemy y Alembic gestiona el esquema de la base de datos,
evitando SQL manual en todo momento.

## Implementación

1. Crear entorno virtual e instalar dependencias — `backend/requirements.txt`.
2. Configurar variables de entorno — `backend/.env` y `backend/.env.example`.
3. Crear la conexión a MySQL con SQLAlchemy — `backend/app/database.py`.
4. Definir las 8 entidades como clases SQLAlchemy — `backend/app/models/`.
5. Inicializar Alembic y configurarlo para leer los modelos — `backend/alembic/`.
6. Generar y aplicar la migración inicial — `alembic revision --autogenerate`.
7. Crear el punto de entrada de FastAPI con Swagger habilitado — `backend/app/main.py`.
8. Verificar que Swagger UI responde en `http://localhost:8000/docs`.

## Decisiones

- **SQLAlchemy declarativo** — se usa el estilo `DeclarativeBase` de SQLAlchemy 2.0
  en lugar del estilo clásico; es más limpio y compatible con FastAPI y Pydantic.
- **Alembic para migraciones** — descartado crear tablas con `Base.metadata.create_all()`
  porque no permite control de versiones del esquema ni rollback.
- **Variables de entorno con python-dotenv** — descartadas credenciales hardcodeadas
  por seguridad; `.env` nunca se sube al repositorio.
- **Motor InnoDB** — garantiza claves foráneas y transacciones ACID,
  requeridas por las reglas de negocio 3 y 4 (soft delete y trazabilidad).

## Riesgos

- **Versión de MySQL incompatible** — mitigación: documentar versión mínima
  requerida (MySQL 8.0) en el README.
- **Error de conexión en primer arranque** — mitigación: validar que el
  servidor MySQL esté activo y las credenciales en `.env` sean correctas
  antes de correr Alembic.
- **Conflicto de migraciones futuras** — mitigación: nunca editar una
  migración ya aplicada; siempre generar una nueva revisión.
