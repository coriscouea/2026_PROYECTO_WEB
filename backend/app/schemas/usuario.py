# =============================================================
# schemas/usuario.py — Schemas Pydantic para la entidad Usuario
# HelpDesk Web | Feature 006 · CRUD Usuarios
# =============================================================
# Responsabilidad: define y valida los datos que entran y salen
# de los endpoints de usuarios.
#
# UsuarioCreate   → datos que recibe POST /api/v1/usuarios
# UsuarioUpdate   → datos que recibe PATCH /api/v1/usuarios/{id}
# UsuarioResponse → datos que devuelve la API (sin password)
# =============================================================

from pydantic import BaseModel, Field  # 
from typing import Optional
from datetime import datetime

# -------------------------------------------------------------
# UsuarioCreate — schema de entrada para crear un usuario
# -------------------------------------------------------------

class UsuarioCreate(BaseModel):         # nombre de la clase que representa el esquema de creación de Usuario

    nombre : str = Field(               # nombre: obligatorio, mínimo 3 chars, máximo 100
        ...,
        min_length  = 3,
        max_length  = 100,
        description = "Nombre completo del Usuario"    
    ) 

    email : str = Field(           # email: obligatorio, formato válido de correo electrónico
        ...,
        description = "Correo electrócnico - usado para iniciar sesión"
    )

    password: str = Field(               # password: obligatorio, mínimo 8 caracteres
        ...,
        min_length  = 8,
        description = "Contraseña - se almacenará como hash bcrypt"
    )

    id_rol: Optional[int] = Field(       # id_rol: opcional — si no se envía, el service asigna rol usuario
        None,
        gt  = 0,
        description = "ID del rol asignado"   
    )

    id_sucursal: Optional[int] = Field(   # id_sucursal: opcional
        None,
        gt  = 0,
        description = "ID de la sucursal del usario"
    )

# -------------------------------------------------------------
# UsuarioUpdate — schema de entrada para actualizar un usuario
# Solo nombre e id_sucursal son modificables mediante PATCH
# email y password tienen sus propios flujos
# -------------------------------------------------------------

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = Field(
        None,
        min_length  = 3,
        max_length  = 100,
        description = "Nuevo nombre del usuario"
    )

    id_sucursal: Optional[int] = Field(
        None,
        gt  = 0,
        description = "Nueva sucursal del usuario"
    )

# -------------------------------------------------------------
# UsuarioResponse — schema de salida al consultar usuarios
# NUNCA incluye el campo password
# -------------------------------------------------------------

class UsuarioResponse(BaseModel):
    
    id_usuario          : int
    nombre              : str
    email               : str
    id_rol              : int
    id_sucursal         : Optional[int] = None
    fecha_registro      : Optional[datetime] = None
    activo              : bool

    model_config = {"from_attributes": True}

