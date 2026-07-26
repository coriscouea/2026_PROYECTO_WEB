# =============================================================
# services/auth_svc.py — Servicio de Autenticación
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Responsabilidad: lógica de negocio para registro, login
# y renovación de tokens. Verifica credenciales, genera tokens
# y aplica reglas de seguridad.
# =============================================================

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

from app.repository.usuario_repo import (
    buscar_por_email,
    crear_usuario,
    obtener_usuario
)

from app.models.roles import Rol
from app.schemas.usuario import UsuarioCreate
from jose import JWTError

def svc_registro(db: Session, datos: UsuarioCreate) -> dict:

    # ---------------------------------------------------------
    # Verifica que el email no esté registrado
    # ---------------------------------------------------------

    if buscar_por_email(db, datos.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario registrado con ese correo"
        )
        
    # ---------------------------------------------------------
    # Asigna rol por defecto si no se envía (regla 7)
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
                detail="No se encontró el rol por defecto"
            )
        datos.id_rol = rol_default.id_rol

    # ---------------------------------------------------------
    # Hashea la contraseña y crea el usuario
    # ---------------------------------------------------------

    password_hash = hash_password(datos.password)
    usuario = crear_usuario(db, datos, password_hash)
    return usuario

def svc_login(db: Session, email:str, password:str) -> dict:

    # ---------------------------------------------------------
    # Busca el usuario por email
    # ---------------------------------------------------------

    usuario = buscar_por_email(db, email)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )

    # ---------------------------------------------------------
    # Verifica que el usuario esté activo
    # ---------------------------------------------------------

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo - contacte al administrador"
        )

    # ---------------------------------------------------------
    # Verifica la contraseña contra el hash almacenado
    # ---------------------------------------------------------
     
    if not verify_password(password, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )   

    # ---------------------------------------------------------
    # Genera access token y refresh token
    # El rol viaja en el payload — sin consultas adicionales a BD
    # ---------------------------------------------------------

    payload = {
        "sub"   : str(usuario.id_usuario),
        "email" : usuario.email,
        "rol"   : usuario.rol.nombre_rol
    }
    access_token    = create_access_token(payload)
    refresh_token   = create_refresh_token({"sub": str(usuario.id_usuario)})

    return {
        "access_token"  : access_token,
        "refresh_token" : refresh_token,
        "expira_en"     : 1800
    }

def svc_refresh(db: Session, refresh_token: str) -> dict:

    # ---------------------------------------------------------
    # Verifica el refresh token
    # ---------------------------------------------------------

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de actualización inválido"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de actualización inválido o expirado"
        )
    # ---------------------------------------------------------
    # Busca el usuario y genera nuevo access token
    # ---------------------------------------------------------

    id_usuario = int(payload.get("sub"))
    usuario = obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    nuevo_payload= {
        "sub"   : str(usuario.id_usuario),
        "email" : usuario.email,
        "rol"   : usuario.rol.nombre_rol
    }

    access_token = create_access_token(nuevo_payload)

    return {
        "access_token"  : access_token,
        "expira_en"     : 1800
    }