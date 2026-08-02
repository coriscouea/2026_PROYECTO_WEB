# =============================================================
# routes/historial.py — Endpoints de Historial del Ticket
# HelpDesk Web | Feature 009 · Historial de Eventos del Ticket
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.historial import HistorialResponse
from app.schemas.response import RespuestaExito
from app.services.historial_svc import svc_listar_historial
from app.middleware.auth import get_current_user


router = APIRouter(
    prefix="/api/v1",
    tags=["Historial"]
)

# -------------------------------------------------------------
# GET /api/v1/tickets/{id}/historial
# Lista todos los eventos del ticket ordenados por fecha ASC
# Solo accesible para usuarios con acceso al ticket
# -------------------------------------------------------------

@router.get("/tickets/{id_ticket}/historial", status_code=status.HTTP_200_OK)
def obtener_historial(
    id_ticket   : int,
    db          : Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    historial = svc_listar_historial(db, id_ticket, current_user)
    return RespuestaExito(
        datos   = [HistorialResponse.model_validate(h) for h in historial],
        mensaje = f"{len(historial)} eventos encontrados"
    )