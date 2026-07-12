# =============================================================
# models/comentarios.py — Modelo SQLAlchemy para Comentarios
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'comentarios'
# en MySQL. Cada comentario pertenece a un ticket y fue escrito
# por un usuario. Se usan para dar seguimiento al avance de
# un requerimiento técnico.
# =============================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index  # tipos de columna SQLAlchemy
from sqlalchemy.orm import relationship             # para definir relaciones entre tablas
from sqlalchemy.sql import func                     # para usar funciones SQL como CURRENT_TIMESTAMP
from app.database import Base                       # clase base declarativa    

class Comentario(Base): 
    __tablename__ = "comentarios"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_comentario: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_comentario = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # id_ticket: ticket al que pertenece el comentario
    # FK → tickets.id_ticket
    # nullable=False → todo comentario debe pertenecer a un ticket
    # ---------------------------------------------------------

    id_ticket = Column(Integer, ForeignKey("tickets.id_ticket"), nullable=False)

    # ---------------------------------------------------------
    # id_usuario: quien escribió el comentario
    # FK → usuarios.id_usuario
    # nullable=False → todo comentario tiene un autor
    # ---------------------------------------------------------
    
    id_usuario =Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    # ---------------------------------------------------------
    # texto: contenido del comentario
    # nullable=False → no se permiten comentarios vacíos
    # ---------------------------------------------------------

    texto = Column(String(1000), nullable=False)

    # ---------------------------------------------------------
    # fecha: cuándo se escribió el comentario
    # server_default=func.now() → MySQL asigna la fecha automáticamente
    # ---------------------------------------------------------

    fecha = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # Relaciones con otras tablas
    # ---------------------------------------------------------

    ticket = relationship("Ticket", back_populates="comentarios")  
    usuario = relationship("Usuario")

    # ---------------------------------------------------------
    # Índice estratégico sobre id_ticket
    # Acelera la carga de todos los comentarios de un ticket
    # Sin este índice MySQL haría un full scan en cada consulta
    # ---------------------------------------------------------

    __table_args__ =(
        Index("ix_comentarios_ticket", "id_ticket"),  # índice sobre id_ticket
    )       