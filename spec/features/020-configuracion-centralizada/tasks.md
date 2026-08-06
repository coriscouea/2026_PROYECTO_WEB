# 020 · Configuración Centralizada — Tareas

- [ ] Instalar `pydantic-settings` con `pip install pydantic-settings`.
- [ ] Actualizar `requirements.txt` con `pip freeze > requirements.txt`.
- [ ] Crear `backend/app/core/config.py` con clase `Settings` y `settings = Settings()`.
- [ ] Actualizar `backend/app/database.py` — reemplazar `os.getenv()` con `settings.*`.
- [ ] Actualizar `backend/app/core/security.py` — reemplazar `os.getenv()` con `settings.*`.
- [ ] Actualizar `backend/app/main.py` — reemplazar `os.getenv()` con `settings.*`.
- [ ] Verificar que el servidor arranca sin errores.
- [ ] Verificar que si se elimina una variable del `.env` el error es claro.
- [ ] Mover a "Hecho" en roadmap.
