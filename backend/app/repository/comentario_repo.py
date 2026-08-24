# =============================================================
# repository/comentario_repo.py — Repositorio de Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================
# Responsabilidad: encapsula el acceso a la tabla comentarios.
# Los comentarios nunca se eliminan — solo se insertan y consultan.
# =============================================================

from sqlalchemy.orm import Session, joinedload
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
    db.flush()                           # prepara el INSERT sin confirmar — el commit lo hace el service padre
    db.refresh(comentario)               # actualiza el objeto para obtener el id y fecha generados por MySQL         
    return comentario

def listar_comentarios(db: Session, id_ticket: int) -> list[Comentario]:

    # ---------------------------------------------------------
    # Lista todos los comentarios de un ticket con el autor precargado
    # joinedload evita el problema N+1 al acceder a comentario.usuario.nombre
    # ---------------------------------------------------------
    
    return (
        db.query(Comentario)
        .options(joinedload(Comentario.usuario))
        .filter(Comentario.id_ticket == id_ticket)
        .order_by(Comentario.fecha.asc())
        .all()
    )