# =============================================================
# main.py — Punto de entrada de la aplicación FastAPI
# HelpDesk Web | Feature 004 · Setup Backend
# ============================================================= 
# Responsabilidad: inicializar la aplicación FastAPI, registrar
# los routers de cada entidad y exponer la documentación
# automática de Swagger UI en /docs.
# =============================================================

from fastapi import FastAPI                                 # clase principal del framework FastAPI 
from app.database import engine, Base                       # motor de conexión y clase base de modelos

# Importar todos los modelos para que SQLAlchemy los registre
from app.models.roles import Rol
from app.models.sucursales import Sucursal
from app.models.categorias import Categoria
from app.models.usuario import Usuario
from app.models.tickets import Ticket
from app.models.comentarios import Comentario
from app.models.historial_estado import HistorialEstado
from app.models.notificaciones import Notificacion

from app.routes.tickets import router as tickets_router     # Importar el router de tickets

# -------------------------------------------------------------
# Crea la instancia principal de la aplicación FastAPI
# title    → nombre que aparece en Swagger UI
# version  → versión de la API visible en la documentación
# -------------------------------------------------------------

app = FastAPI(
    TITLE="HelpDesk Web API",
    VERSION="1.0.0"
)

# -------------------------------------------------------------
# Crea todas las tablas en la base de datos al arrancar
# SQLAlchemy lee los modelos que heredan de Base y genera
# las tablas correspondientes en MySQL si no existen aún
# Nota: en producción esto se reemplaza por migraciones Alembic
# Registrar el router
# -------------------------------------------------------------

Base.metadata.create_all(bind=engine)
app.include_router(tickets_router)

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

