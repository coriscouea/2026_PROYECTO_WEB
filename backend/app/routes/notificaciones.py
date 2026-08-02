# =============================================================
# routes/notificaciones.py — Endpoints de Notificaciones
# HelpDesk Web | Feature 011 · Notificaciones Avanzadas
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.response import RespuestaExito
from app.middleware.auth import get_current_user
from app.services.notificacion_svc import (
    svc_listar_notificaciones,
    svc_listar_no_leidas,
    svc_contar_no_leidas,
    svc_marcar_leida,
    svc_marcar_todas_leidas
)

from app.models.notificaciones import Notificacion
from pydantic import BaseModel
from datetime import datetime
from typing import List

class NotificacionResponse(BaseModel):
    id_notificacion : int
    id_usuario      : int
    id_ticket       : int
    mensaje         : str
    leida           : bool
    fecha           : datetime
    model_config = {"from_attributes": True}      # permite convertir un modelo SQLAlchemy a Pydantic

router = APIRouter(
    prefix="/api/v1/notificaciones",
    tags=["Notificaciones"]
)

# -------------------------------------------------------------
# GET /api/v1/notificaciones
# Lista todas las notificaciones del usuario autenticado
# -------------------------------------------------------------

@router.get("", status_code=status.HTTP_200_OK)
def listar_notificaciones(
    db          : Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    notificaciones = svc_listar_notificaciones(db, current_user)
    return RespuestaExito(
        datos   = [NotificacionResponse.model_validate(n) for n in notificaciones],
        mensaje = f"{len(notificaciones)} notificaciones encontradas"
    )

# -------------------------------------------------------------
# GET /api/v1/notificaciones/no-leidas
# Lista solo las notificaciones no leídas
# -------------------------------------------------------------

@router.get("/no-leidas", status_code=status.HTTP_200_OK)
def listar_no_leidas(
    db          : Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    notificaciones = svc_listar_no_leidas(db, current_user)
    return RespuestaExito(
        datos   = [NotificacionResponse.model_validate(n) for n in notificaciones],
        mensaje = f"{len(notificaciones)} notificaciones no leídas"
    )

# -------------------------------------------------------------
# GET /api/v1/notificaciones/conteo
# Devuelve el conteo de notificaciones no leídas
# -------------------------------------------------------------

@router.get("/conteo", status_code=status.HTTP_200_OK)
def contar_no_leidas(
    db          : Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    resultado = svc_contar_no_leidas(db, current_user)
    return RespuestaExito(
        datos   = resultado,
        mensaje = "Conteo de notificaciones no leídas"
    )

# -------------------------------------------------------------
# PATCH /api/v1/notificaciones/{id}/leer
# Marca una notificación específica como leída
# -------------------------------------------------------------

@router.patch("/{id_notificacion}/leer", status_code=status.HTTP_200_OK)
def marcar_leida(
    id_notificacion: int,
    db             : Session = Depends(get_db),
    current_user   : dict = Depends(get_current_user)
):
    notificacion = svc_marcar_leida(db, id_notificacion, current_user)
    return RespuestaExito(
        datos   = NotificacionResponse.model_validate(notificacion),
        mensaje = "Notificación marcada como leída"
    )

# -------------------------------------------------------------
# PATCH /api/v1/notificaciones/leer-todas
# Marca todas las notificaciones del usuario como leídas
# -------------------------------------------------------------

@router.patch("/leer-todas", status_code=status.HTTP_200_OK)
def marcar_todas_leidas(
    db          : Session = Depends(get_db),
    current_user: dict    = Depends(get_current_user)
):
    resultado = svc_marcar_todas_leidas(db, current_user)
    return RespuestaExito(
        datos   = resultado,
        mensaje = "Todas las notificaciones marcadas como leídas"
    )