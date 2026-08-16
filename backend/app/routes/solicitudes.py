# =============================================================
# routes/solicitudes.py — Endpoints de Solicitudes de Reset
# HelpDesk Web | Feature 021 · Reset de Contraseña
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.response import RespuestaExito
from app.middleware.auth import require_roles
from app.repository.solicitud_reset_repo import (
    listar_solicitudes_pendientes,
    marcar_atendida
)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SolicitudResponse(BaseModel):
    id_solicitud: int
    id_usuario  : int
    fecha       : Optional[datetime] = None
    atendida    : bool
    nombre      : Optional[str] = None
    email       : Optional[str] = None

    model_config = {"from_attributes": True}

router = APIRouter(
    prefix="/api/v1/solicitudes",
    tags=["Solicitudes Reset"]
)

# -------------------------------------------------------------
# GET /api/v1/solicitudes
# Lista solicitudes de reset pendientes — solo admin
# -------------------------------------------------------------
@router.get("", status_code=status.HTTP_200_OK)
def listar_solicitudes(
    db: Session = Depends(get_db),
    _ : dict    = Depends(require_roles("admin"))
):
    solicitudes = listar_solicitudes_pendientes(db)
    datos = []
    for s in solicitudes:
        datos.append({
            "id_solicitud": s.id_solicitud,
            "id_usuario"  : s.id_usuario,
            "fecha"       : s.fecha,
            "atendida"    : s.atendida,
            "nombre"      : s.usuario.nombre if s.usuario else None,
            "email"       : s.usuario.email  if s.usuario else None
        })
    return RespuestaExito(
        datos   = datos,
        mensaje = f"{len(datos)} solicitudes pendientes"
    )

# -------------------------------------------------------------
# PATCH /api/v1/solicitudes/{id}/atender
# Marca una solicitud como atendida — solo admin
# -------------------------------------------------------------
@router.patch("/{id_solicitud}/atender", status_code=status.HTTP_200_OK)
def atender_solicitud(
    id_solicitud: int,
    db          : Session = Depends(get_db),
    _           : dict    = Depends(require_roles("admin"))
):
    solicitud = marcar_atendida(db, id_solicitud)
    if not solicitud:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    return RespuestaExito(
        datos   = None,
        mensaje = "Solicitud marcada como atendida. Recuerda comunicar la nueva contraseña al usuario por WhatsApp de Mesa de Ayuda."
    )