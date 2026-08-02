# =============================================================
# services/notificacion_svc.py — Servicio de Notificaciones
# HelpDesk Web | Feature 008 · Optimización + Feature 011 · Notificaciones Avanzadas
# =============================================================

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.database import Sessionlocal
from app.models.notificaciones import Notificacion
from app.repository.notificacion_repo import (
    listar_notificaciones,
    listar_no_leidas,
    contar_no_leidas,
    marcar_leida,
    marcar_todas_leidas
)

# -------------------------------------------------------------
# Feature 008 — BackgroundTasks
# Crea notificaciones en segundo plano con su propia sesión
# -------------------------------------------------------------

def crear_notificacion(id_usuario: int, id_ticket: int, mensaje: str):

    # ---------------------------------------------------------
    # Esta función se ejecuta en segundo plano
    # Crea su propia sesión de BD porque la sesión del request
    # ya se cerró cuando esta función se ejecuta
    # ---------------------------------------------------------

    db: Session = Sessionlocal()
    try:
        notificacion = Notificacion(
            id_usuario = id_usuario,
            id_ticket  = id_ticket,
            mensaje    = mensaje,
            leida      = False
        )
        db.add(notificacion)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error al crear notificación: {e}")
    finally:
        db.close()

# -------------------------------------------------------------
# Feature 011 — Notificaciones Avanzadas
# El id_usuario siempre viene del JWT — nunca del body
# -------------------------------------------------------------

def svc_listar_notificaciones(db: Session, current_user: dict) -> list[Notificacion]:
    id_usuario = int(current_user.get("sub"))
    return listar_notificaciones(db, id_usuario)

def svc_listar_no_leidas(db: Session, current_user: dict) -> list[Notificacion]:
    id_usuario = int(current_user.get("sub"))
    return listar_no_leidas(db, id_usuario)

def svc_contar_no_leidas(db: Session, current_user: dict) -> dict:
    id_usuario = int(current_user.get("sub"))
    total = contar_no_leidas(db, id_usuario)
    return {"total": total}

def svc_marcar_leida(db: Session, id_notificacion: int, current_user: dict) -> Notificacion:
    id_usuario = int(current_user.get("sub"))
    notificacion = marcar_leida(db, id_notificacion, id_usuario)
    if not notificacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notificación no encontrada o no te pertenece"
        )
    return notificacion

def svc_marcar_todas_leidas(db: Session, current_user: dict) -> dict:
    id_usuario = int(current_user.get("sub"))
    total = marcar_todas_leidas(db, id_usuario)
    return {"actualizadas": total}