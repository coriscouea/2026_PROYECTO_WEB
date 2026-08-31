# =============================================================
# routes/metricas.py — Endpoints de Métricas
# HelpDesk Web | Feature 012 · Métricas Básicas
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.response import RespuestaExito
from app.middleware.auth import require_roles
from app.services.metricas_svc import (
    svc_resumen,
    svc_por_categoria,
    svc_por_tecnico,
    svc_tiempo_resolucion,
    svc_resumen_global
)

router = APIRouter(
    prefix="/api/v1/metricas",
    tags=["Métricas"]
)

# -------------------------------------------------------------
# GET /api/v1/metricas/resumen
# Totales por estado — solo admin
# -------------------------------------------------------------

@router.get("/resumen", status_code=status.HTTP_200_OK)
def resumen(
    db          : Session = Depends(get_db),
    _: dict    = Depends(require_roles("admin"))
):
    datos = svc_resumen(db)
    return RespuestaExito(
        datos   = datos,
        mensaje = "Resumen de tickets por estado"
    )

# -------------------------------------------------------------
# GET /api/v1/metricas/por-categoria
# Tickets agrupados por categoría — solo admin
# -------------------------------------------------------------
@router.get("/por-categoria", status_code=status.HTTP_200_OK)
def por_categoria(
    db          : Session = Depends(get_db),
    _: dict    = Depends(require_roles("admin"))
):
    datos = svc_por_categoria(db)
    return RespuestaExito(
        datos   = datos,
        mensaje = "Tickets por categoría"
    )

# -------------------------------------------------------------
# GET /api/v1/metricas/por-tecnico
# Tickets agrupados por técnico — solo admin
# -------------------------------------------------------------

@router.get("/por-tecnico", status_code=status.HTTP_200_OK)
def por_tecnico(
    db          : Session = Depends(get_db),
    _: dict    = Depends(require_roles("admin"))
):
    datos = svc_por_tecnico(db)
    return RespuestaExito(
        datos   = datos,
        mensaje = "Tickets por técnico asignado"
    )

# -------------------------------------------------------------
# GET /api/v1/metricas/tiempo-resolucion
# Tiempo promedio de resolución en horas — solo admin
# -------------------------------------------------------------

@router.get("/tiempo-resolucion", status_code=status.HTTP_200_OK)
def tiempo_resolucion(
    db          : Session = Depends(get_db),
    _: dict    = Depends(require_roles("admin"))
):
    datos = svc_tiempo_resolucion(db)
    return RespuestaExito(
        datos   = datos,
        mensaje = "Tiempo promedio de resolución"
    )

# -------------------------------------------------------------
# GET /api/v1/metricas/resumen-global
# Resumen completo — activos, inactivos, históricos — solo admin
# -------------------------------------------------------------

@router.get("/resumen-global", status_code=status.HTTP_200_OK)
def resumen_global(
    db: Session = Depends(get_db),
    _: dict    = Depends(require_roles("admin"))
):
    datos = svc_resumen_global(db)
    return RespuestaExito(
        datos   = datos,
        mensaje = "Resumen global del sistema"
    )