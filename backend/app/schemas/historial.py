# =============================================================
# schemas/historial.py — Schemas Pydantic para Historial
# HelpDesk Web | Feature 009 · Historial de Eventos del Ticket
# =============================================================

from pydantic import BaseModel
from datetime import datetime
from enum import Enum 
from typing import Optional

class TipoEventoEnum(str, Enum):
    ticket_creado       = "ticket_creado"
    tecnico_asignado    = "tecnico_asignado"
    estado_cambiado     = "estado_cambiado"
    prioridad_cambiada  = "prioridad_cambiada"
    comentario_agregado = "comentario_agregado"
    ticket_cerrado      = "ticket_cerrado"

class HistorialResponse(BaseModel):

    # ---------------------------------------------------------
    # Schema de salida para cada evento del historial
    # Define exactamente qué campos devuelve la API
    # ---------------------------------------------------------  
 
    id_historial    : int
    id_ticket       : int
    id_usuario      : int
    tipo_evento     : TipoEventoEnum
    descripcion     : str
    fecha           : Optional[datetime] = None  # Fecha y hora del evento, puede ser nula si no se registra

    model_config = {"from_attributes": True}  # Permite crear el schema desde un modelo SQLAlchemy