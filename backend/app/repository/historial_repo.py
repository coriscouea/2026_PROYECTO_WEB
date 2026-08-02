# =============================================================
# repository/historial_repo.py — Repositorio de Historial
# HelpDesk Web | Feature 009 · Historial de Eventos del Ticket
# =============================================================
# Responsabilidad: encapsula el acceso a la tabla historial_ticket.
# Solo inserta y consulta — nunca actualiza ni elimina registros
# de historial (la trazabilidad es permanente).
# =============================================================

from sqlalchemy.orm import Session
from app.models.historial_estado import HistorialTicket

def registrar_evento(
    db          : Session,
    id_ticket   : int,
    id_usuario  : int,
    tipo_evento : str,
    descripcion : str
) -> HistorialTicket:
    
    # ---------------------------------------------------------
    # Inserta un nuevo evento en el historial del ticket
    # Se llama desde los services — nunca desde el router
    # ---------------------------------------------------------
    
    evento = HistorialTicket(
        id_ticket   = id_ticket,
        id_usuario  = id_usuario,
        tipo_evento = tipo_evento,
        descripcion = descripcion
    )

    db.add(evento)
    db.commit()                  # hace commit para que se registre la fecha y hora del evento
    return evento

def listar_historial(db: Session, id_ticket: int) -> list[HistorialTicket]:

    # ---------------------------------------------------------
    # Lista todos los eventos de un ticket ordenados por fecha ASC
    # Devuelve la línea de tiempo completa del ticket
    # ---------------------------------------------------------

    return (
        db.query(HistorialTicket)
        .filter(HistorialTicket.id_ticket == id_ticket)
        .order_by(HistorialTicket.fecha.asc())
        .all()
    )