# =============================================================
# models/historial_estado.py — Modelo SQLAlchemy para Historial
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla
# 'historial_estado' en MySQL. Registra cada cambio de estado
# de un ticket — quién lo hizo, cuándo y desde qué estado.
# Es la entidad que garantiza la trazabilidad completa del
# ciclo de vida de cada requerimiento (regla de negocio 3).
# =============================================================

from sqlalchemy import Column, Integer,Enum, DateTime, ForeignKey, Index  # tipos de columna SQLAlchemy
from sqlalchemy.orm import relationship             # para definir relaciones entre tablas
from sqlalchemy.sql import func                     # para usar funciones SQL como CURRENT_TIMESTAMP
from app.database import Base                       # clase base declarativa

class HistorialEstado(Base):  
    __tablename__ = "historial_estado"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_historial: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_historial = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # id_ticket: ticket cuyo estado cambió
    # FK → tickets.id_ticket
    # nullable=False → todo registro de historial pertenece a un ticket
    # ---------------------------------------------------------

    id_ticket = Column(Integer, ForeignKey("tickets.id_ticket"), nullable=False)

    # ---------------------------------------------------------
    # estado_anterior: estado del ticket antes del cambio
    # nullable=True → al crear el ticket no hay estado anterior
    # ------------------------------------------------------

    estado_anterior = Column(Enum("pendiente", "en_proceso", "finalizado"), nullable=True)

    # ---------------------------------------------------------
    # estado_nuevo: estado al que transitó el ticket
    # nullable=False → siempre debe registrarse el estado nuevo
    # ---------------------------------------------------------

    estado_nuevo = Column(Enum("pendiente","en_proceso","finalizado"))    

    # ---------------------------------------------------------
    # id_usuario: quien realizó el cambio de estado
    # FK → usuarios.id_usuario
    # nullable=False → siempre debe registrarse el responsable
    # ---------------------------------------------------------

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable= False)

    # ---------------------------------------------------------
    # fecha: cuándo ocurrió el cambio de estado
    # server_default=func.now() → MySQL asigna la fecha automáticamente
    # ---------------------------------------------------------

    fecha = Column(DateTime, server_default=func.now())        

    # ---------------------------------------------------------
    # Relaciones con otras tablas
    # ---------------------------------------------------------

    ticket = relationship("Ticket", back_populates="historial")
    usuario = relationship("Usuario")

    # ---------------------------------------------------------
    # Índice estratégico sobre id_ticket
    # Acelera la consulta del historial completo de un ticket
    # ---------------------------------------------------------

    __table_args__ = (
        Index("ix_historial_ticket", "id_ticket"),  # índice sobre id_ticket    
    )        
