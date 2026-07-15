# =============================================================
# routes/usuarios.py — Endpoints REST para la entidad Usuario
# HelpDesk Web | Feature 006 · CRUD Usuarios
# =============================================================
# Responsabilidad: recibe las solicitudes HTTP, valida los datos
# con Pydantic y delega la lógica al servicio.
# =============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.schemas.response import RespuestaExito
from app.services.usuario_svc import (
    svc_crear_usuario,
    svc_listar_usuarios,
    svc_obtener_usuario,
    svc_actualizar_usuario,
    svc_desactivar_usuario
)

# -------------------------------------------------------------
# Router — agrupa todos los endpoints de usuarios bajo /api/v1/usuarios
# -------------------------------------------------------------

router = APIRouter(
    prefix="/api/v1/usuarios",
    tags=["Usuarios"]
)

# -------------------------------------------------------------
# POST /api/v1/usuarios — Crear un nuevo usuario
# Devuelve 201 Created con el usuario creado (sin password)
# -------------------------------------------------------------

@router.post("", status_code=status.HTTP_201_CREATED)
def crear_usuario(
    datos: UsuarioCreate,
    db: Session = Depends(get_db)
):
    usuario = svc_crear_usuario(db, datos)
    return RespuestaExito(
        datos=UsuarioResponse.model_validate(usuario),
        mensaje="Usuario creado correctamente"
    )

# -------------------------------------------------------------
# GET /api/v1/usuarios — Listar usuarios activos con paginación
# -------------------------------------------------------------

@router.get("", status_code=status.HTTP_200_OK)
def listar_usuarios(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    usuarios = svc_listar_usuarios(db, page, limit)
    return RespuestaExito(
        datos=[UsuarioResponse.model_validate(u) for u in usuarios],
        mensaje=f"{len(usuarios)} usuarios encontrados"
    )

# -------------------------------------------------------------
# GET /api/v1/usuarios/{id_usuario} — Obtener detalle
# Devuelve 200 OK si existe, 404 Not Found si no existe
# -------------------------------------------------------------

@router.get("/{id_usuario}", status_code=status.HTTP_200_OK)
def obtener_usuario(
    id_usuario: int,
    db: Session = Depends(get_db)
):
    usuario = svc_obtener_usuario(db, id_usuario)
    return RespuestaExito(
        datos=UsuarioResponse.model_validate(usuario),
        mensaje="Usuario encontrado"
    )

# -------------------------------------------------------------
# PATCH /api/v1/usuarios/{id_usuario} — Actualizar parcialmente
# Solo actualiza nombre e id_sucursal
# -------------------------------------------------------------

@router.patch("/{id_usuario}", status_code=status.HTTP_200_OK)
def actualizar_usuario(
    id_usuario: int,
    datos: UsuarioUpdate,
    db: Session = Depends(get_db)
):
    usuario = svc_actualizar_usuario(db, id_usuario, datos)
    return RespuestaExito(
        datos=UsuarioResponse.model_validate(usuario),
        mensaje="Usuario actualizado correctamente"
    )

# -------------------------------------------------------------
# DELETE /api/v1/usuarios/{id_usuario} — Soft delete
# Marca activo=FALSE — no elimina el registro (regla 4)
# -------------------------------------------------------------

@router.delete("/{id_usuario}", status_code=status.HTTP_200_OK)
def desactivar_usuario(
    id_usuario: int,
    db: Session = Depends(get_db)
):
    usuario = svc_desactivar_usuario(db, id_usuario)
    return RespuestaExito(
        datos=UsuarioResponse.model_validate(usuario),
        mensaje="Usuario desactivado correctamente"
    )