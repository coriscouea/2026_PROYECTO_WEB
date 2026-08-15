# =============================================================
# models/solicitudes_reset.py — Solicitudes de Reset de Contraseña
# HelpDesk Web | Feature 021 · Reset de Contraseña
# =============================================================
# Responsabilidad: registra las solicitudes de restablecimiento
# de contraseña. Tabla independiente para no mezclar con
# notificaciones que requieren id_ticket obligatorio.
# =============================================================

from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class SolicitudReset(Base):

    __tablename__ = "solicitudes_reset"

    # ---------------------------------------------------------
    # id_solicitud: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_solicitud = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # id_usuario: usuario que solicita el reset
    # FK → usuarios.id_usuario
    # ---------------------------------------------------------

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    # ---------------------------------------------------------
    # fecha: cuándo se hizo la solicitud
    # ---------------------------------------------------------

    fecha = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # atendida: si el admin ya atendió la solicitud
    # ---------------------------------------------------------

    atendida = Column(Boolean, default=False)

    # ---------------------------------------------------------
    # Relación con usuario
    # ---------------------------------------------------------

    usuario = relationship("Usuario")

    # ---------------------------------------------------------
    # Índice para buscar solicitudes pendientes rápidamente
    # ---------------------------------------------------------
    
    __table_args__ = (
        Index("ix_solicitudes_reset_usuario", "id_usuario"),
        Index("ix_solicitudes_reset_atendida", "atendida"),
    )