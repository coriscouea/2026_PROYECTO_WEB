# =============================================================
# models/notificaciones.py — Modelo SQLAlchemy para Notificaciones
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla
# 'notificaciones' en MySQL. Registra los avisos generados
# automáticamente cuando un ticket cambia de estado o es
# asignado a un técnico. Cada notificación tiene un único
# destinatario y se marca como leída cuando el usuario la ve.
# =============================================================

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index # tipos de columna SQLAlchemy
from sqlalchemy.orm import relationship             # para definir relaciones entre tablas
from sqlalchemy.sql import func                     # para usar funciones SQL como CURRENT_TIMESTAMP
from app.database import Base                       # clase base declarativa

class Notificacion(Base):
    __tablename__ = "notificaciones"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_notificacion: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_notificacion = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # id_usuario: destinatario de la notificación
    # FK → usuarios.id_usuario
    # nullable=False → toda notificación tiene un destinatario
    # ---------------------------------------------------------

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    # ---------------------------------------------------------
    # id_ticket: ticket que generó la notificación
    # FK → tickets.id_ticket
    # nullable=False → toda notificación está vinculada a un ticket
    # ---------------------------------------------------------

    id_ticket = Column(Integer, ForeignKey("tickets.id_ticket"), nullable=False)

    # ---------------------------------------------------------
    # mensaje: texto descriptivo de la notificación
    # Ej: "Tu ticket #12 fue asignado a María Torres"
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    mensaje = Column(String(255), nullable=False)

    # ---------------------------------------------------------
    # leida: indica si el usuario ya vio la notificación
    # False → notificación nueva, pendiente de leer
    # True  → notificación vista por el destinatario
    # default=False → toda notificación nueva nace sin leer
    # ---------------------------------------------------------

    leida = Column(Boolean, default=False, nullable=False)   

    # ---------------------------------------------------------
    # fecha: cuándo se generó la notificación
    # server_default=func.now() → MySQL asigna la fecha automáticamente
    # ---------------------------------------------------------

    fecha = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # Relaciones con otras tablas
    # ---------------------------------------------------------

    usuario = relationship("Usuario")
    ticket = relationship("Ticket")

    # ---------------------------------------------------------
    # Índices estratégicos
    # ix_notificaciones_usuario_leida → bandeja de notificaciones
    # no leídas de un usuario (la consulta más frecuente)
    # ---------------------------------------------------------

    __table_args__ = (
        Index("ix_notificaciones_usuario_leida", "id_usuario", "leida"),  # índice sobre id_usuario y leida
    )

