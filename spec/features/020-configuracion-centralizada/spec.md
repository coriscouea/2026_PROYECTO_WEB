# 020 · Configuración Centralizada

**Estado:** implementado ✅

## Qué hace

Centraliza todas las variables de entorno en una clase `Settings` basada
en `pydantic-settings`, reemplazando los `os.getenv()` dispersos en
`security.py`, `database.py` y `main.py`.

## Por qué

Actualmente las variables se leen en múltiples archivos. Si falta una
variable obligatoria el servidor arranca igual y falla más tarde con
un error confuso. Con `pydantic-settings`, si falta una variable el
servidor no arranca y muestra exactamente cuál falta.

## Implementación sugerida

```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int = 3306
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 1
    CORS_ORIGINS: str = "http://localhost:8100"

    class Config:
        env_file = ".env"

settings = Settings()
```

## Criterios de aceptación

- [X] Crear `backend/app/core/config.py` con clase Settings.
- [X] Instalar `pydantic-settings` y agregar a requirements.txt.
- [X] Reemplazar `os.getenv()` en `security.py` con `settings.*`.
- [X] Reemplazar `os.getenv()` en `database.py` con `settings.*`.
- [X] Reemplazar `os.getenv()` en `main.py` con `settings.*`.
- [X] Si falta variable obligatoria el servidor no arranca y muestra error claro — `pydantic-settings` lo garantiza al no tener default en los campos obligatorios.

## Fuera de alcance

- Múltiples entornos dev/staging/prod — backlog futuro.
