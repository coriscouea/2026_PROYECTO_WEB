# =============================================================
# main.py — Punto de entrada de la aplicación FastAPI
# HelpDesk Web | Feature 004 · Setup Backend
# HelpDesk Web | Feature 007 · Autenticación JWT
# ============================================================= 
# Responsabilidad: inicializar la aplicación FastAPI, registrar
# los routers de cada entidad y exponer la documentación
# automática de Swagger UI en /docs.
# =============================================================

from fastapi import FastAPI, HTTPException                                 # clase principal del framework FastAPI 
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv
import os

from app.database import engine, Base                       # motor de conexión y clase base de modelos

# Importar todos los modelos para que SQLAlchemy los registre
from app.models.roles import Rol
from app.models.sucursales import Sucursal
from app.models.categorias import Categoria
from app.models.usuario import Usuario
from app.models.tickets import Ticket
from app.models.comentarios import Comentario
from app.models.historial_estado import HistorialTicket
from app.models.notificaciones import Notificacion

from app.routes.tickets import router as tickets_router         # Importar el router de tickets
from app.routes.usuarios import router as usuarios_router       # Importar el router de usuarios
from app.routes.categorias import router as categorias_router   # Importar el router de categorias
from app.routes.auth import router as auth_router               # Importar el router de auth
from app.routes.historial import router as historial_router     # Importar el router de historial
from app.routes.comentarios import router as comentarios_router # Importar el router de comentarios

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter

# -------------------------------------------------------------
# Crea la instancia principal de la aplicación FastAPI
# title    → nombre que aparece en Swagger UI
# version  → versión de la API visible en la documentación
# -------------------------------------------------------------

load_dotenv()

app = FastAPI(
    title="HelpDesk Web API",
    version="1.0.0"
)

# -------------------------------------------------------------
# Rate limiting — previene ataques de fuerza bruta
# -------------------------------------------------------------


app.state.limiter = limiter

# -------------------------------------------------------------
# Exception handlers globales
# Estandariza todos los errores al formato {exito, errores, mensaje}
# -------------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "exito": False,
            "errores": None,
            "mensaje": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "exito": False,
            "errores": [
                {"campo": e["loc"][-1], "mensaje": e["msg"]}
                for e in exc.errors()
            ],
            "mensaje": "Los datos enviados no son válidos"
        }
    )
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={
            "exito": False,
            "errores": None,
            "mensaje": "Demasiados intentos. Espera 1 minuto antes de intentar de nuevo."
        }
    )

# -------------------------------------------------------------
# CORS — permite solicitudes desde el frontend Ionic
# Los orígenes se leen desde .env
# -------------------------------------------------------------

origins = os.getenv("CORS_ORIGINS", "http://localhost:8100").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Crea todas las tablas en la base de datos al arrancar
# SQLAlchemy lee los modelos que heredan de Base y genera
# las tablas correspondientes en MySQL si no existen aún
# Nota: en producción esto se reemplaza por migraciones Alembic
# Registrar el router
# -------------------------------------------------------------

Base.metadata.create_all(bind = engine)

app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(usuarios_router)
app.include_router(categorias_router)
app.include_router(historial_router)
app.include_router(comentarios_router)

# -------------------------------------------------------------
# Endpoint raíz de verificación
# GET / → confirma que el servidor está corriendo
# Útil para probar que FastAPI responde antes de ir a Swagger
# -------------------------------------------------------------

@app.get("/")
def root():
    return {
        "exito": True,
        "mensaje": "HelpDesk Web API corriendo correctamente",
        "docs": "/docs"
    }

