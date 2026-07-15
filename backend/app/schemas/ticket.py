# =============================================================
# schemas/ticket.py — Schemas Pydantic para la entidad Ticket
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: define y valida los datos que entran y salen
# de los endpoints de tickets. Pydantic valida automáticamente
# tipo, formato y longitud antes de que los datos lleguen
# a la capa de servicio o repositorio.
#
# TicketCreate      → datos que recibe POST /api/v1/tickets
# TicketUpdate      → datos que recibe PATCH /api/v1/tickets/{id}
# TicketResponse    → datos que devuelve la API al consultar
# =============================================================

from pydantic import BaseModel, Field   # clase base para schemas de validación
from typing import Optional             # tipos para campos opcionales
from datetime import datetime           # para validar fechas
from enum import Enum                   # para definir enumeraciones de estado y prioridad

# -------------------------------------------------------------
# Enumeraciones — limitan los valores permitidos
# Equivalen a los ENUM definidos en el modelo SQLAlchemy
# -------------------------------------------------------------

class PrioridadEnum(str, Enum): 
    baja    = "baja" 
    media   = "media" 
    alta    = "alta"

class EstadoEnum(str, Enum): 
    pendiente   = "pendiente" 
    en_proceso  = "en_proceso" 
    finalizado  = "finalizado"

# -------------------------------------------------------------
# TicketCreate — schema de entrada para crear un ticket
# Pydantic valida cada campo antes de persistir en la BD
# -------------------------------------------------------------

class TicketCreate(BaseModel):          # nombre de la clase que representa el esquema de creación de tickets

    titulo: str = Field(                # titulo: obligatorio, mínimo 5 chars, máximo 150
        ...,
        min_length  = 5, 
        max_length  = 150, 
        description = "Título del requerimiento"
    )

    descripcion: str = Field(           # descripcion: obligatorio, mínimo 10 chars
        ...,
        min_length   = 10, 
        description  = "Descripción detallada del requerimiento"
    )

    prioridad: PrioridadEnum = Field(   # prioridad: obligatorio, debe ser uno de los valores del enum 
        ..., 
        description = "Nivel de prioridad del ticket"
    )

    id_categoria: int = Field(          # id_categoria: FK hacia la tabla categorias
        ..., 
        gt = 0, 
        description = "ID de la categoría del requerimiento"
    )

    id_usuario: int = Field(            # id_usuario: FK hacia la tabla usuarios (solicitante)
        ..., 
        gt = 0, 
        description = "ID del usuario que reporta el requerimiento"
    )

# -------------------------------------------------------------
# TicketUpdate — schema de entrada para actualizar un ticket
# Todos los campos son opcionales - PATCH solo actualiza
# los campos que se envían, no reemplaza el ticket completo
# -------------------------------------------------------------

class TicketUpdate(BaseModel):                      # nombre de la clase que representa el esquema de actualización de tickets

    estado: Optional[EstadoEnum] = Field(           # estado: solo puede avanzar en orden (regla de transición)
        None, 
        description = "Nuevo estado del ticket!"
    )

    prioridad: Optional[PrioridadEnum] = Field(     # prioridad: puede cambiar en cualquier momento
        None, 
        description = "Nueva prioridad del ticket"
    )

    id_tecnico_asignado: Optional[int] = Field(     # id_tecnico_asignado: técnico que toma el ticket
        None,
        gt = 0,
        description = "ID del técnico asignado al ticket"
    )

# -------------------------------------------------------------
# TicketResponse — schema de salida al consultar tickets
# Define exactamente qué campos devuelve la API
# Los campos que no están aquí nunca salen en la respuesta
# -------------------------------------------------------------

class TicketResponse(BaseModel):                    # nombre de la clase que representa el esquema de respuesta de tickets

    id_ticket                   : int
    titulo                      : str
    descripcion                 : str
    prioridad                   : PrioridadEnum
    estado                      : EstadoEnum
    id_categoria                : int
    id_usuario                  : int
    id_tecnico_asignado         : Optional[int] = None
    fecha_creacion              : Optional[datetime] = None
    fecha_actualizacion         : Optional[datetime] = None
    fecha_cierre                : Optional[datetime] = None
    activo                      : bool

    # ---------------------------------------------------------
    # model_config: permite que Pydantic lea objetos SQLAlchemy
    # Sin esto, Pydantic no puede convertir el modelo de BD
    # a un schema de respuesta automáticamente
    # ---------------------------------------------------------

    model_config = {"from_attributes": True}