# =============================================================
# services/comentario_svc.py — Servicio de Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================
# Responsabilidad: lógica de negocio para comentarios.
# Verifica acceso al ticket antes de permitir comentar.
# Registra evento en historial tras crear comentario.
# =============================================================

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repository.comentario_repo import crear_comentario, listar_comentarios
from app.repository.ticket_repo import obtener_ticket
from app.models.comentarios import Comentario
from app.services import historial_svc

def svc_crear_comentario(

    # ---------------------------------------------------------
    # Registra el evento de creación de un comentario en el historial del ticket
    # ---------------------------------------------------------

    db          : Session, 
    id_ticket   : int,  
    texto       : str,
    current_user: dict
) -> Comentario :

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol        = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # ---------------------------------------------------------
    # Verifica acceso según rol — misma lógica que en tickets
    # ---------------------------------------------------------

    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )

    # ---------------------------------------------------------
    # Sanitiza el texto — elimina espacios sobrantes
    # ---------------------------------------------------------

    texto = texto.strip()

    # ---------------------------------------------------------
    # Crea el comentario
    # ---------------------------------------------------------

    comentario = crear_comentario(db, id_ticket, id_usuario, texto)

    # ---------------------------------------------------------
    # Registra evento en historial
    # ---------------------------------------------------------

    historial_svc.registrar_comentario_agregado(
        db         = db,
        id_ticket  = id_ticket,
        id_usuario = id_usuario
    )

    return comentario

def svc_listar_comentarios(
    db          : Session,
    id_ticket   : int,
    current_user: dict
) -> list[Comentario]:

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol        = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # ---------------------------------------------------------
    # Verifica acceso según rol
    # ---------------------------------------------------------

    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )

    return listar_comentarios(db, id_ticket)