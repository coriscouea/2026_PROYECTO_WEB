# 004 · Setup Backend — Tareas

_Checklist accionable derivada del `plan.md`. Tareas pequeñas y concretas; marca `[x]` al completarlas._

- [X] Crear carpeta `backend/` y el entorno virtual de Python (`python -m venv venv`).
- [X] Crear `backend/requirements.txt` con: fastapi, uvicorn, sqlalchemy, alembic, pymysql, python-dotenv, pydantic.
- [X] Instalar dependencias (`pip install -r requirements.txt`).
- [X] Crear `backend/.env.example` con las variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- [X] Crear `backend/app/database.py` con la conexión SQLAlchemy a MySQL.
- [X] Crear los modelos en `backend/app/models/`:
  - [X] `usuario.py` — entidad Usuario con 8 atributos y FKs a Roles y Sucursales.
  - [X] `roles.py` — entidad Roles.
  - [X] `sucursales.py` — entidad Sucursales.
  - [X] `categorias.py` — entidad Categorías.
  - [X] `tickets.py` — entidad Tickets con dos FKs hacia Usuario.
  - [X] `comentarios.py` — entidad Comentarios.
  - [X] `historial_estado.py` — entidad Historial_Estado.
  - [X] `notificaciones.py` — entidad Notificaciones.
- [X] Inicializar Alembic (`alembic init alembic`) y configurar `alembic.ini` y `env.py`.
- [X] Generar migración inicial (`alembic revision --autogenerate -m "initial_schema"`).
- [X] Aplicar migración (`alembic upgrade head`) y verificar tablas en MySQL.
- [X] Crear `backend/app/main.py` con FastAPI y Swagger habilitado.
- [X] Verificar que `http://localhost:8000/docs` responde correctamente.
- [X] Validar contra los criterios de aceptación de `spec.md`.
- [X] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.✅

## Mantenimiento (checklist recurrente)

- [X] Cada vez que se agregue o modifique un modelo, generar nueva migración con Alembic.
- [X] Verificar que `.env` nunca aparezca en commits (`git status` antes de cada push).
