# =============================================================
# middleware/auth.py — Dependencias de autenticación y autorización
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError
from app.core.security import decode_token
from app.core.logging_config import logger
from app.database import get_db
from app.models.usuario import Usuario

bearer_schema = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_schema),
    db         : Session = Depends(get_db)
) -> dict:

    # ---------------------------------------------------------
    # Extrae y verifica la firma y expiración del JWT
    # ---------------------------------------------------------
    
    try:
        token   = credentials.credentials
        payload = decode_token(token)
    except JWTError:
        logger.warning("Token inválido o expirado — acceso denegado")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Token invalido o expirado",
            headers     = {"WWW-Authenticate": "Bearer"}
        )

    # ---------------------------------------------------------
    # Verifica que el usuario existe y está activo en la BD
    # Previene acceso con tokens válidos de usuarios desactivados
    # o con rol cambiado desde que se emitió el token
    # ---------------------------------------------------------

    id_usuario = int(payload.get("sub", 0))
    usuario    = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if not usuario:
        logger.warning(f"Token válido pero usuario {id_usuario} no encontrado en BD")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Usuario no encontrado",
            headers     = {"WWW-Authenticate": "Bearer"}
        )

    if not usuario.activo:
        logger.warning(f"Token válido pero usuario {id_usuario} está desactivado")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Usuario desactivado",
            headers     = {"WWW-Authenticate": "Bearer"}
        )

    # ---------------------------------------------------------
    # Actualiza el rol desde la BD — no desde el token
    # Si el admin cambió el rol, el nuevo rol aplica de inmediato
    # ---------------------------------------------------------

    rol_actual = usuario.rol.nombre_rol if usuario.rol else payload.get("rol")

    return {
        "sub"  : str(id_usuario),
        "email": usuario.email,
        "rol"  : rol_actual
    }

def require_roles(*roles: str):

    # ---------------------------------------------------------
    # Fábrica de dependencias para verificar roles
    # Uso: Depends(require_roles("admin", "tecnico"))
    # ---------------------------------------------------------

    def verificar_rol(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        rol_usuario = current_user.get("rol")
        if rol_usuario not in roles:
            raise HTTPException(
                status_code = status.HTTP_403_FORBIDDEN,
                detail      = f"Acceso denegado. Se requiere uno de estos roles:{','.join(roles)}"
            )
        return current_user
    return verificar_rol