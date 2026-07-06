# 004 · Setup Backend — Tareas

_Checklist accionable derivada del `plan.md`. Tareas pequeñas y concretas; marca `[x]` al completarlas._

- [ ] Crear carpeta `backend/` y el entorno virtual de Python (`python -m venv venv`).
- [ ] Crear `backend/requirements.txt` con: fastapi, uvicorn, sqlalchemy, alembic, pymysql, python-dotenv, pydantic.
- [ ] Instalar dependencias (`pip install -r requirements.txt`).
- [ ] Crear `backend/.env.example` con las variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- [ ] Crear `backend/app/database.py` con la conexión SQLAlchemy a MySQL.
- [ ] Crear los modelos en `backend/app/models/`:
  - [ ] `usuario.py` — entidad Usuario con 8 atributos y FKs a Roles y Sucursales.
  - [ ] `roles.py` — entidad Roles.
  - [ ] `sucursales.py` — entidad Sucursales.
  - [ ] `categorias.py` — entidad Categorías.
  - [ ] `tickets.py` — entidad Tickets con dos FKs hacia Usuario.
  - [ ] `comentarios.py` — entidad Comentarios.
  - [ ] `historial_estado.py` — entidad Historial_Estado.
  - [ ] `notificaciones.py` — entidad Notificaciones.
- [ ] Inicializar Alembic (`alembic init alembic`) y configurar `alembic.ini` y `env.py`.
- [ ] Generar migración inicial (`alembic revision --autogenerate -m "initial_schema"`).
- [ ] Aplicar migración (`alembic upgrade head`) y verificar tablas en MySQL.
- [ ] Crear `backend/app/main.py` con FastAPI y Swagger habilitado.
- [ ] Verificar que `http://localhost:8000/docs` responde correctamente.
- [ ] Validar contra los criterios de aceptación de `spec.md`.
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.

## Mantenimiento (checklist recurrente)

- [ ] Cada vez que se agregue o modifique un modelo, generar nueva migración con Alembic.
- [ ] Verificar que `.env` nunca aparezca en commits (`git status` antes de cada push).
