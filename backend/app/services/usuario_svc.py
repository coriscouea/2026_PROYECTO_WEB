# =============================================================
# services/usuario_svc.py — Servicio de Usuarios
# HelpDesk Web | Feature 006 · CRUD Usuarios
# =============================================================
# Responsabilidad: contiene toda la lógica de negocio de usuarios.
# Verifica reglas de dominio antes de invocar al repositorio.
# =============================================================

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
from app.models.usuario import Usuario
from app.models.roles import Rol
from app.models.sucursales import Sucursal
from app.repository.usuario_repo import (
    crear_usuario,
    listar_usuarios,
    obtener_usuario,
    buscar_por_email,
    actualizar_usuario,
    desactivar_usuario
)

# -------------------------------------------------------------
# Configuración de bcrypt para hash de contraseñas
# -------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_password(password: str) -> str:

    # ---------------------------------------------------------
    # Convierte la contraseña en texto plano a hash bcrypt
    # El hash es irreversible — nunca se puede recuperar el original
    # ---------------------------------------------------------

    return pwd_context.hash(password)

def svc_crear_usuario(db: Session, datos: UsuarioCreate) -> Usuario:

    # ---------------------------------------------------------
    # Verifica unicidad del email (regla 1)
    # ---------------------------------------------------------

    if buscar_por_email(db, datos.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario registrado con ese correo electrónico"
        )

    # ---------------------------------------------------------
    # Asigna rol por defecto si no se envía (regla 7)
    # Busca el rol 'usuario' en la BD
    # ---------------------------------------------------------

    if not datos.id_rol:
        rol_default = (
            db.query(Rol)
            .filter(Rol.nombre_rol == "usuario")
            .first()
        )
        if not rol_default:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se encontró el rol por defecto en el sistema"
            )
        datos.id_rol = rol_default.id_rol

    # ---------------------------------------------------------
    # Verifica que el rol existe si se envió uno específico
    # ---------------------------------------------------------

    else:
        rol = db.query(Rol).filter(Rol.id_rol == datos.id_rol).first()
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El rol especificado no existe"
            )

    # ---------------------------------------------------------
    # Verifica que la sucursal existe si se envió
    # ---------------------------------------------------------

    if datos.id_sucursal:
        sucursal = (
            db.query(Sucursal)
            .filter(Sucursal.id_sucursal == datos.id_sucursal)
            .first()
        )
        if not sucursal:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La sucursal especificada no existe"
            )

    # ---------------------------------------------------------
    # Sanitiza el nombre — elimina espacios sobrantes
    # ---------------------------------------------------------

    datos.nombre = datos.nombre.strip()

    # ---------------------------------------------------------
    # Hashea la contraseña antes de persistir
    # Nunca se almacena en texto plano
    # ---------------------------------------------------------

    password_hash = hashear_password(datos.password)

    return crear_usuario(db, datos, password_hash)

def svc_listar_usuarios(db: Session, page: int, limit: int) -> list[Usuario]:
    return listar_usuarios(db, page, limit)

def svc_obtener_usuario(db: Session, id_usuario: int) -> Usuario:

    # ---------------------------------------------------------
    # Busca el usuario — devuelve 404 si no existe
    # ---------------------------------------------------------

    usuario = obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {id_usuario} no encontrado"
        )
    return usuario

def svc_actualizar_usuario(db: Session, id_usuario: int, datos: UsuarioUpdate) -> Usuario:

    # ---------------------------------------------------------
    # Verifica que el usuario existe
    # ---------------------------------------------------------

    usuario = obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {id_usuario} no encontrado"
        )
    return actualizar_usuario(db, usuario, datos)

def svc_desactivar_usuario(db: Session, id_usuario: int) -> Usuario:

    # ---------------------------------------------------------
    # Verifica que el usuario existe
    # ---------------------------------------------------------

    usuario = obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {id_usuario} no encontrado"
        )

    # ---------------------------------------------------------
    # Verifica que no esté ya inactivo
    # ---------------------------------------------------------
    
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya está inactivo"
        )

    return desactivar_usuario(db, usuario)