# =============================================================
# routes/comentarios.py — Endpoints de Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.comentario import ComentarioCreate, ComentarioResponse
from app.schemas.response import RespuestaExito
from app.services.comentario_svc import svc_crear_comentario, svc_listar_comentarios
from app.middleware.auth import get_current_user

router = APIRouter(
    prefix="/api/v1",
    tags=["Comentarios"]
)

# -------------------------------------------------------------
# POST /api/v1/tickets/{id}/comentarios
# Agrega un comentario al ticket
# El autor se obtiene del token JWT
# -------------------------------------------------------------

@router.post("/tickets/{id_ticket}/comentarios", status_code=status.HTTP_201_CREATED)
def crear_comentario(
    id_ticket   : int,
    datos       : ComentarioCreate,
    db          : Session   = Depends(get_db),
    current_user: dict      = Depends(get_current_user)
):
    comentario = svc_crear_comentario(db, id_ticket, datos.texto, current_user)
    return RespuestaExito(
        datos   = ComentarioResponse.model_validate(comentario),
        mensaje = "Comentario agregado correctamente"
    )

# -------------------------------------------------------------
# GET /api/v1/tickets/{id}/comentarios
# Lista comentarios del ticket ordenados por fecha ASC
# -------------------------------------------------------------

@router.get("/tickets/{id_ticket}/comentarios", status_code=status.HTTP_200_OK)
def listar_comentarios(
    id_ticket   : int,
    db          : Session = Depends(get_db),
    current_user: dict    = Depends(get_current_user)
):
    comentarios = svc_listar_comentarios(db, id_ticket, current_user)
    return RespuestaExito(
        datos   = [ComentarioResponse.model_validate(c) for c in comentarios],
        mensaje = f"{len(comentarios)} comentarios encontrados"
    )