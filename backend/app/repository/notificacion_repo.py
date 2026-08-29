# =============================================================
# repository/notificacion_repo.py — Repositorio de Notificaciones
# HelpDesk Web | Feature 011 · Notificaciones Avanzadas
# =============================================================

from sqlalchemy.orm import Session
from app.models.notificaciones import Notificacion

def listar_notificaciones(db: Session, id_usuario: int) -> list[Notificacion]:

    # ---------------------------------------------------------
    # Lista todas las notificaciones del usuario autenticado
    # ordenadas por fecha DESC (más recientes primero)
    # ---------------------------------------------------------

    return (
        db.query(Notificacion)
        .filter(Notificacion.id_usuario == id_usuario)
        .order_by(Notificacion.fecha.desc())
        .all()
    )

def listar_no_leidas(db: Session, id_usuario: int) -> list[Notificacion]:

    # ---------------------------------------------------------
    # Lista solo las notificaciones no leídas del usuario
    # ---------------------------------------------------------

    return (
        db.query(Notificacion)
        .filter(
            Notificacion.id_usuario == id_usuario,
            Notificacion.leida == False
        )
        .order_by(Notificacion.fecha.desc())
        .all()
    )

def contar_no_leidas(db: Session, id_usuario: int) -> int:

    # ---------------------------------------------------------
    # Cuenta las notificaciones no leídas del usuario
    # Usado para el badge de notificaciones en el frontend
    # ---------------------------------------------------------
    
    return (
        db.query(Notificacion)
        .filter(
            Notificacion.id_usuario == id_usuario,
            Notificacion.leida == False
        )
        .count()
    )

def marcar_leida(db: Session, id_notificacion: int, id_usuario: int) -> Notificacion | None:

    # ---------------------------------------------------------
    # Marca una notificación específica como leída
    # Verifica que pertenezca al usuario autenticado
    # ---------------------------------------------------------
    
    notificacion = (
        db.query(Notificacion)
        .filter(
            Notificacion.id_notificacion == id_notificacion,
            Notificacion.id_usuario == id_usuario
        )
        .first()
    )

    if not notificacion:
        return None
    notificacion.leida = True
    db.commit()
    db.refresh(notificacion)
    return notificacion

def marcar_todas_leidas(db:Session, id_usuario: int) -> int:

    # ---------------------------------------------------------
    # Marca todas las notificaciones del usuario como leídas
    # Devuelve el número de notificaciones actualizadas
    # ---------------------------------------------------------

    resultado = (
        db.query(Notificacion)
        .filter(
            Notificacion.id_usuario == id_usuario,
            Notificacion.leida == False
        )
        .update({"leida": True})
    )
    db.commit()
    return resultado

def crear_notificacion(
    db          : Session,
    id_usuario  : int,
    id_ticket   : int,
    mensaje     : str
) -> Notificacion:
    
    # Crea una notificación para un usuario sobre un evento del ticket
    
    notificacion = Notificacion(
        id_usuario  = id_usuario,
        id_ticket   = id_ticket,
        mensaje     = mensaje,
        leida       = False
    )

    db.add(notificacion)
    db.flush()                              # prepara el INSERT sin confirmar — el commit lo hace el service padre
    return notificacion

