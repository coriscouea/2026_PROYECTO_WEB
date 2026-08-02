# =============================================================
# repository/comentario_repo.py — Repositorio de Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================
# Responsabilidad: encapsula el acceso a la tabla comentarios.
# Los comentarios nunca se eliminan — solo se insertan y consultan.
# =============================================================

from sqlalchemy.orm import Session
from app.models.comentarios import Comentario

def crear_comentario(
    db          : Session, 
    id_ticket   : int, 
    id_usuario  : int, 
    texto       : str
) -> Comentario :

    # ---------------------------------------------------------
    # Inserta un nuevo comentario en la BD
    # El autor viene del JWT — nunca del body del request
    # ---------------------------------------------------------
    
    comentario = Comentario(
        id_ticket  = id_ticket,
        id_usuario = id_usuario,
        texto        = texto
    )
    db.add(comentario)
    db.commit()                                         # hace commit para que se registre la fecha y hora del comentario
    db.refresh(comentario)                  
    return comentario

def listar_comentarios(db: Session, id_ticket: int) -> list[Comentario]:

    # ---------------------------------------------------------
    # Lista todos los comentarios de un ticket
    # Ordenados por fecha ASC para hilo natural de conversación
    # ---------------------------------------------------------
    
    return (
        db.query(Comentario)
        .filter(Comentario.id_ticket == id_ticket)
        .order_by(Comentario.fecha.asc())
        .all()
    )