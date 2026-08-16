# =============================================================
# core/config.py — Configuración centralizada con Pydantic
# HelpDesk Web | Feature 020 · Configuración Centralizada
# =============================================================
# Responsabilidad: centraliza todas las variables de entorno
# en una clase Settings. Si falta una variable obligatoria,
# el servidor no arranca y muestra exactamente cuál falta.
# Reemplaza los os.getenv() dispersos en el proyecto.
# =============================================================

from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    # ---------------------------------------------------------
    # Base de datos
    # ---------------------------------------------------------

    DB_HOST: str
    DB_PORT: int = 3306
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    # ---------------------------------------------------------
    # JWT
    # ---------------------------------------------------------
 
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 1

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------
 
    CORS_ORIGINS: str = "http://localhost:8100"                         # Permitir todos los orígenes para desarrollo          

    class Config:
        env_file = ".env"                                               # Archivo de variables de entorno

# -------------------------------------------------------------
# Instancia global — importar desde cualquier módulo:
# from app.core.config import settings
# settings.DB_HOST, settings.JWT_SECRET_KEY, etc.
# -------------------------------------------------------------

settings = Settings()


