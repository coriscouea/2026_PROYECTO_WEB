# =============================================================
# models/tickets.py — Modelo SQLAlchemy para la entidad Tickets
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'tickets'
# en MySQL. Es la entidad principal del sistema — centraliza
# los requerimientos técnicos de los usuarios.
# Los tickets nunca se eliminan físicamente (regla de negocio 3).
# =============================================================

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Index      # tipos de columna SQLAlchemy
from sqlalchemy.orm import relationship                                                         # para relaciones entre tablas
from sqlalchemy.sql import func                                                                 # funciones SQL como CURRENT_TIMESTAMP
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_ticket: clave primaria entera, autoincremental
    # ---------------------------------------------------------

    id_ticket = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # titulo: título corto del requerimiento
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    titulo = Column(String(150), nullable=False)

    # ---------------------------------------------------------
    # descripcion: detalle completo del requerimiento
    # TEXT permite textos largos sin límite fijo de caracteres
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    descripcion = Column(String(1000), nullable=False)

    # ---------------------------------------------------------
    # id_categoria: categoría del ticket (Técnica, Redes, ERP)
    # FK → categorias.id_categoria
    # Determina a qué bandeja se enruta el ticket
    # nullable=False → todo ticket debe tener una categoría
    # ---------------------------------------------------------
 
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria"), nullable=False)       

    # ---------------------------------------------------------
    # prioridad: nivel de urgencia del ticket
    # ENUM limita los valores a exactamente estos tres
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    prioridad = Column(Enum("baja", "media", "alta"), nullable=False)

    # ---------------------------------------------------------
    # estado: ciclo de vida del ticket
    # Solo puede avanzar en orden: pendiente → en_proceso → finalizado
    # No se permiten saltos ni retrocesos (regla de negocio transición)
    # default="pendiente" → todo ticket nuevo inicia en pendiente
    # ---------------------------------------------------------

    estado = Column(Enum("pendiente","en_proceso", "finalizado"), nullable=False, default="pendiente")

    # ---------------------------------------------------------
    # id_usuario: quien reportó el requerimiento
    # FK → usuarios.id_usuario
    # nullable=False → todo ticket tiene un solicitante
    # ---------------------------------------------------------

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    # ---------------------------------------------------------
    # id_tecnico_asignado: quien atiende el requerimiento
    # FK → usuarios.id_usuario (misma tabla, rol diferente)
    # nullable=True → al crear el ticket aún no hay técnico asignado
    # El técnico se asigna manualmente desde la bandeja (regla 8)
    # ---------------------------------------------------------

    id_tecnico_asignado = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=True)    

    # ---------------------------------------------------------
    # fecha_creacion: cuándo se registró el ticket
    # server_default=func.now() → MySQL asigna la fecha automáticamente
    # ---------------------------------------------------------

    fecha_creacion = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # fecha_actualizacion: cuándo se modificó por última vez
    # nullable=True → al crear el ticket aún no hay actualización
    # ---------------------------------------------------------

    fecha_actualizacion = Column(DateTime, nullable=True)

    # ---------------------------------------------------------
    # fecha_cierre: cuándo se finalizó el ticket
    # nullable=True → se llena solo cuando estado = finalizado
    # ---------------------------------------------------------

    fecha_cierre = Column(DateTime, nullable=True)

    # ---------------------------------------------------------
    # activo: controla si el ticket está visible en el sistema
    # False → ticket desactivado (soft delete, regla 3)
    # default=True → todo ticket nuevo nace activo
    # ---------------------------------------------------------

    activo = Column(Boolean, default=True, nullable=False)

    # ---------------------------------------------------------
    # Relaciones con otras tablas
    # foreign_keys indica explícitamente cuál FK usar
    # cuando hay dos FK apuntando a la misma tabla (usuarios)
    # ---------------------------------------------------------

    categoria = relationship("Categoria")
    solicitante = relationship("Usuario", foreign_keys=[id_usuario])
    tecnico = relationship("Usuario", foreign_keys=[id_tecnico_asignado])
    comentarios = relationship("Comentario", back_populates="ticket")
    historial   = relationship("HistorialEstado", back_populates="ticket")

    # ---------------------------------------------------------
    # Índices estratégicos — aceleran las consultas más frecuentes
    # ix_tickets_estado     → filtro de bandeja por estado
    # ix_tickets_categoria  → enrutamiento por categoría al crear
    # ix_tickets_usuario    → listado de tickets por solicitante
    # ---------------------------------------------------------

    __table_args__ = (
        Index("ix_tickets_estado", "estado"),
        Index("ix_tickets_categoria", "id_categoria"),
        Index("ix_tickets_usuario", "id_usuario"),
    )