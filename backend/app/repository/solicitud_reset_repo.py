# =============================================================
# repository/solicitud_reset_repo.py — Repositorio Reset
# HelpDesk Web | Feature 021 · Reset de Contraseña
# =============================================================

from sqlalchemy.orm import Session, joinedload
from app.models.solicitudes_reset import SolicitudReset

def crear_solicitud(db: Session, id_usuario: int) -> SolicitudReset:
    solicitud = SolicitudReset(
        id_usuario = id_usuario,
        atendida   = False
    )
    db.add(solicitud)
    db.flush()
    return solicitud

def listar_solicitudes_pendientes(db: Session) -> list[SolicitudReset]:
    return (
        db.query(SolicitudReset)
        .options(joinedload(SolicitudReset.usuario))
        .filter(SolicitudReset.atendida == False)
        .order_by(SolicitudReset.fecha.desc())
        .all()
    )

def marcar_atendida(db: Session, id_solicitud: int) -> SolicitudReset | None:
    solicitud = db.query(SolicitudReset).filter(
        SolicitudReset.id_solicitud == id_solicitud
    ).first()
    if solicitud:
        solicitud.atendida = True
        db.commit()
    return solicitud