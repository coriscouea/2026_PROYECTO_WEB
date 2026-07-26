# =============================================================
# middleware/auth.py — Dependencias de autenticación y autorización
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Responsabilidad: verificar el token JWT en cada request
# protegido y validar el rol del usuario. Se usa como
# dependencia FastAPI (Depends) — no como middleware global.
# No genera consultas adicionales a la BD por request.
# =============================================================

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from app.core.security import decode_token

# -------------------------------------------------------------
# HTTPBearer extrae el token del encabezado Authorization
# Formato esperado: Authorization: Bearer <token>
# -------------------------------------------------------------

bearer_schema = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_schema)
) -> dict:

    # ---------------------------------------------------------
    # Extrae y verifica el token JWT del encabezado
    # Devuelve el payload del token si es válido
    # Devuelve 401 si el token es inválido o expirado
    # No consulta la base de datos — el rol viene en el payload
    # ---------------------------------------------------------

    try:
        token   = credentials.credentials
        payload = decode_token(token)
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido o expirado",
            headers={"WWW-Authenticate": "Bearer"}
        )

def require_roles(*roles: str):

    # ---------------------------------------------------------
    # Fábrica de dependencias para verificar roles
    # Uso: Depends(require_roles("admin", "tecnico"))
    # Devuelve 403 si el rol del token no está en la lista
    # ---------------------------------------------------------

    def verificar_rol(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        rol_usuario = current_user.get("rol")
        if rol_usuario not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere uno de estos roles:{','.join(roles)}"
            )
        return current_user
    return verificar_rol