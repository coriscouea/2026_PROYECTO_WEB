# =============================================================
# services/notificacion_svc.py — Servicio de Notificaciones
# HelpDesk Web | Feature 008 · Optimización del Backend
# =============================================================
# Responsabilidad: crea notificaciones en la BD de forma
# asíncrona mediante BackgroundTasks de FastAPI.
# Se ejecuta DESPUÉS de que el endpoint responde al cliente
# — no bloquea la respuesta al usuario.
# =============================================================

from sqlalchemy.orm import Session
from app.database import Sessionlocal
from app.models.notificaciones import Notificacion

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