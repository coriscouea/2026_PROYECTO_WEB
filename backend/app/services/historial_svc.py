# =============================================================
# services/historial_svc.py — Servicio de Historial
# HelpDesk Web | Feature 009 · Historial de Eventos del Ticket
# =============================================================
# Responsabilidad: genera automáticamente los eventos del
# historial con descripciones legibles. Es llamado desde
# ticket_svc y comentario_svc — nunca desde el router.
# =============================================================

from sqlalchemy.orm import Session
from app.repository.historial_repo import registrar_evento, listar_historial
from app.models.historial_estado import HistorialTicket
from fastapi import HTTPException, status

def registrar_ticket_creado(db: Session, id_ticket: int, id_usuario: int, titulo: str):

    # ---------------------------------------------------------
    # Registra el evento de creación del ticket
    # ---------------------------------------------------------

    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "ticket_creado",
        descripcion = f"Ticket '{titulo}' creado correctamente."
    )

def registrar_tecnico_asignado(db: Session, id_ticket: int, id_usuario: int, nombre_tecnico: str):

    # ---------------------------------------------------------
    # Registra el evento de asignación de técnico
    # ---------------------------------------------------------

    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "tecnico_asignado",
        descripcion = f"Técnico '{nombre_tecnico}' asignado al ticket."
    )

def registrar_estado_cambiado(db: Session, id_ticket: int, id_usuario: int, estado_anterior: str, estado_nuevo: str):

    # ---------------------------------------------------------
    # Registra el evento de cambio de estado
    # ---------------------------------------------------------
    
    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "estado_cambiado",
        descripcion = f"Estado cambiado de '{estado_anterior}' a '{estado_nuevo}'"
    )

def registrar_prioridad_cambiada(db: Session, id_ticket: int, id_usuario: int, prioridad_anterior: str, prioridad_nueva: str):

    # ---------------------------------------------------------
    # Registra el evento de cambio de prioridad
    # ---------------------------------------------------------
    
    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "prioridad_cambiada",
        descripcion = f"Prioridad cambiada de '{prioridad_anterior}' a '{prioridad_nueva}'"
    )

def registrar_comentario_agregado(db: Session, id_ticket: int, id_usuario: int):

    # ---------------------------------------------------------
    # Registra el evento de nuevo comentario
    # ---------------------------------------------------------
    
    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "comentario_agregado",
        descripcion = "Comentario agregado al ticket"
    )

def registrar_ticket_cerrado(db: Session, id_ticket: int, id_usuario: int):

    # ---------------------------------------------------------
    # Registra el evento de cierre del ticket
    # ---------------------------------------------------------
    
    registrar_evento(
        db          = db,
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = "ticket_cerrado",
        descripcion = "Ticket cerrado y marcado como inactivo"
    )

def svc_listar_historial(db: Session, id_ticket: int, current_user: dict) -> list[HistorialTicket]:

    # ---------------------------------------------------------
    # Lista el historial de un ticket verificando acceso
    # ---------------------------------------------------------
    
    from app.repository.ticket_repo import obtener_ticket
    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol        = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # Verifica acceso según rol
    
    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver el historial de este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver el historial de este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver el historial de este ticket"
        )

    return listar_historial(db, id_ticket)