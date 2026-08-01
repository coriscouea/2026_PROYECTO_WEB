# =============================================================
# models/historial_ticket.py — Modelo SQLAlchemy para Historial
# HelpDesk Web | Feature 009 · Historial de Eventos del Ticket
# =============================================================
# Responsabilidad: registra todos los eventos importantes del
# ciclo de vida de un ticket — creación, asignación, cambios
# de estado, comentarios, cambios de prioridad y cierre.
# =============================================================

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class HistorialTicket(Base):

    # ---------------------------------------------------------
    # Nombre de la tabla en MySQL
    # ---------------------------------------------------------

    __tablename__ = "historial_ticket"

    # ---------------------------------------------------------
    # id_historial: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_historial = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # id_ticket: ticket al que pertenece el evento
    # FK → tickets.id_ticket
    # ---------------------------------------------------------

    id_ticket = Column(Integer, ForeignKey("tickets.id_ticket"), nullable=False)

    # ---------------------------------------------------------
    # id_usuario: quien ejecutó la acción
    # FK → usuarios.id_usuario
    # ---------------------------------------------------------

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    # ---------------------------------------------------------
    # tipo_evento: clasificación del evento ocurrido
    # ---------------------------------------------------------

    tipo_evento = Column(
        Enum(
            "ticket_creado",
            "tecnico_asignado",
            "estado_cambiado",
            "prioridad_cambiada",
            "comentario_agregado",
            "ticket_cerrado"
        ),
        nullable=False
    )

    # ---------------------------------------------------------
    # descripcion: texto legible del evento
    # Generado automáticamente por el service
    # Ej: "Estado cambiado de pendiente a en_proceso"
    # ---------------------------------------------------------

    descripcion = Column(String(255), nullable=False)

    # ---------------------------------------------------------
    # fecha: cuándo ocurrió el evento
    # ---------------------------------------------------------

    fecha = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # Relaciones
    # ---------------------------------------------------------

    ticket  = relationship("Ticket", back_populates="historial")
    usuario = relationship("Usuario")

    # ---------------------------------------------------------
    # Índice estratégico sobre id_ticket
    # ---------------------------------------------------------
    
    __table_args__ = (
        Index("ix_historial_ticket_id", "id_ticket"),
    )