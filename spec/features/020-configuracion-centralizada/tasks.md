# 020 · Configuración Centralizada — Tareas

- [X] Instalar `pydantic-settings` con `pip install pydantic-settings`.
- [X] Actualizar `requirements.txt` con `pip freeze > requirements.txt`.
- [X] Crear `backend/app/core/config.py` con clase `Settings` y `settings = Settings()`.
- [X] Actualizar `backend/app/database.py` — reemplazar `os.getenv()` con `settings.*`.
- [X] Actualizar `backend/app/core/security.py` — reemplazar `os.getenv()` con `settings.*`.
- [X] Actualizar `backend/app/main.py` — reemplazar `os.getenv()` con `settings.*`.
- [X] Verificar que el servidor arranca sin errores.
- [X] Verificar que si se elimina una variable del `.env` el error es claro.
- [X] Mover a "Hecho" en roadmap.
