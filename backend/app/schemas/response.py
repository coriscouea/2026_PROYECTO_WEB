# =============================================================
# schemas/response.py — Formato estándar de respuesta JSON
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: define la estructura unificada de respuesta
# que todos los endpoints devuelven, tanto en casos exitosos
# como en casos de error. Garantiza que el frontend Ionic
# siempre reciba el mismo formato JSON sin importar el endpoint.
#
# Éxito:  { "exito": true,  "datos": {...}, "mensaje": "..." }
# Error:  { "exito": false, "errores": [...], "mensaje": "..." }
# =============================================================

from pydantic import BaseModel          # clase base para schemas de validación
from typing import Any, List, Optional  # tipos para campos opcionales y listas

class RespuestaExito(BaseModel):

    # ---------------------------------------------------------
    # exito: indica que la operación fue exitosa
    # Siempre True en respuestas de éxito
    # ---------------------------------------------------------  

    exito: bool = True

    # ---------------------------------------------------------
    # datos: contenido de la respuesta (ticket, usuario, lista, etc.)
    # Any permite cualquier tipo de dato
    # Optional porque algunas operaciones no devuelven datos (ej. delete)
    # ---------------------------------------------------------    

    datos: Optional[Any] = None

    # ---------------------------------------------------------
    # mensaje: descripción legible de lo que ocurrió
    # Ej: "Ticket creado correctamente"
    # ---------------------------------------------------------

    mensaje: str

class ErrorDetalle(BaseModel): 

    # ---------------------------------------------------------
    # campo: nombre del campo que causó el error
    # Ej: "titulo", "prioridad", "id_categoria"
    # ---------------------------------------------------------

    campo: str

    # ---------------------------------------------------------
    # mensaje: descripción del error en ese campo
    # Ej: "El título debe tener al menos 5 caracteres"
    # ---------------------------------------------------------

    mensaje: str    

class RepuestaError(BaseModel): 

    # ---------------------------------------------------------
    # exito: indica que la operación falló
    # Siempre False en respuestas de error
    # ---------------------------------------------------------

    exito: bool = False

    # ---------------------------------------------------------
    # errores: lista de errores por campo
    # Permite identificar exactamente qué campo falló
    # ---------------------------------------------------------

    errores: Optional[List[ErrorDetalle]] = None   

    # ---------------------------------------------------------
    # mensaje: descripción general del error
    # Ej: "Los datos enviados no son válidos"
    # ---------------------------------------------------------

    mensaje: str