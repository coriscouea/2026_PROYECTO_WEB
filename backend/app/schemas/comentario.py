# =============================================================
# schemas/comentario.py — Schemas Pydantic para Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ComentarioCreate(BaseModel):

    # ---------------------------------------------------------
    # texto: contenido del comentario
    # El autor se obtiene del token JWT — no del body
    # ---------------------------------------------------------

    texto: str = Field(
        ..., 
        min_length=1, 
        max_length=1000, 
        description="Contenido del comentario"
    )

class ComentarioResponse(BaseModel):

    # ---------------------------------------------------------
    # Schema de salida para cada comentario
    # Define exactamente qué campos devuelve la API
    # ---------------------------------------------------------  

    id_comentario   : int
    id_ticket       : int
    id_usuario      : int
    nombre_usuario  : Optional[str] = None                  # Nombre del autor del comentario
    texto           : str
    fecha           : Optional[datetime] = None             # Fecha y hora del comentario, puede ser nula si no se registra

    model_config = {"from_attributes": True}                # Permite crear el schema desde un modelo SQLAlchemy

