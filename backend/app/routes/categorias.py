# =============================================================
# routes/categorias.py — Endpoints REST para Categorías
# HelpDesk Web | Feature 008 · Optimización del Backend
# =============================================================
# Responsabilidad: expone el endpoint de listado de categorías
# con caché cache-aside — demuestra la optimización de caché
# para datos estáticos que casi nunca cambian.
# =============================================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.response import RespuestaExito
from app.repository.categoria_repo import listar_categorias

# -------------------------------------------------------------
# Router — agrupa todos los endpoints de categorias bajo /api/v1/tickets
# -------------------------------------------------------------

router = APIRouter(
    prefix="/api/v1/categorias",
    tags=["Categorías"]
)

# -------------------------------------------------------------
# GET /api/v1/categorias — Lista todas las categorías
# Primera llamada: cache miss       → consulta BD
# Siguientes llamadas: cache hit    → respuesta instantánea
# -------------------------------------------------------------.

@router.get("", status_code=200)
def obtener_categorias(db: Session = Depends(get_db)):
    categorias = listar_categorias(db)
    return RespuestaExito(
        datos=[{"id_categoria": c.id_categoria, "nombre": c.nombre} for c in categorias],
        mensaje=f"{len(categorias)} categorías encontradas"
    )