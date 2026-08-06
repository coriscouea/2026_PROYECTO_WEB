# 019 · Logging Estructurado — Plan

## Enfoque

Configuración centralizada de logging en `core/logging_config.py`.
Un logger raíz llamado "helpdesk" del que heredan todos los módulos.
Reemplaza los `print()` dispersos sin cambiar la lógica de negocio.

## Implementación

1. Crear `backend/app/core/logging_config.py` con `setup_logging()` y logger global.
2. Importar `logger` en `main.py` y registrar arranque del servidor.
3. Agregar logging en `middleware/auth.py` — intentos fallidos de autenticación.
4. Agregar logging en exception handlers de `main.py` — errores 4xx y 5xx.
5. Verificar que `echo=True` de SQLAlchemy está desactivado en producción.

## Decisiones

- **Logger nombrado** — `logging.getLogger("helpdesk")` en lugar del root logger,
  para no interferir con los logs de FastAPI y SQLAlchemy.
- **Solo stdout** — suficiente para desarrollo; FileHandler se agrega en producción.
- **Nunca loguear** passwords, tokens completos ni datos personales.
