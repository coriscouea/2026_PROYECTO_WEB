# =============================================================
# routes/auth.py — Endpoints de autenticación
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Responsabilidad: expone los endpoints públicos de registro,
# login y renovación de token. No requieren autenticación previa.
# =============================================================

from fastapi import APIRouter, Depends, status, Request
from app.core.limiter import limiter
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.schemas.response import RespuestaExito
from app.services.auth_svc import svc_registro, svc_login, svc_refresh
from pydantic import BaseModel
# -------------------------------------------------------------
# Router — agrupa todos los endpoints de auth bajo /api/v1/auth
# -------------------------------------------------------------

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# -------------------------------------------------------------
# Schema para el login — email y password
# -------------------------------------------------------------

class LoginRequest(BaseModel):
    email    : str
    password : str

# -------------------------------------------------------------
# Schema para el refresh — solo el refresh token
# -------------------------------------------------------------

class RefreshRequest(BaseModel):
    refresh_token: str

# -------------------------------------------------------------
# POST /auth/registro — Crear cuenta nueva
# Endpoint público — no requiere token
# Devuelve 201 Created con el usuario creado (sin password)
# -------------------------------------------------------------  

@router.post("/registro", status_code=status.HTTP_201_CREATED)
def usuario(
    datos: UsuarioCreate,
    db: Session = Depends(get_db)
):
    usuario = svc_registro(db, datos)
    return RespuestaExito(
        datos=UsuarioResponse.model_validate(usuario),
        mensaje="Usuario registrado correctamente"
    )

# -------------------------------------------------------------
# POST /auth/login — Iniciar sesión
# Endpoint público — no requiere token
# Devuelve access_token, refresh_token y expira_en (segundos)
# -------------------------------------------------------------

@router.post("/login", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def login(
    request: Request,
    datos: LoginRequest,
    db: Session = Depends(get_db)
):
    resultado = svc_login(db, datos.email, datos.password)
    return RespuestaExito(
        datos=resultado,
        mensaje="Inicio de sesión exitoso"
    )

# -------------------------------------------------------------
# POST /auth/refresh — Renovar access token
# Requiere refresh token válido en el body
# Devuelve nuevo access_token sin requerir login
# -------------------------------------------------------------

@router.post("/refresh", status_code=status.HTTP_200_OK)
def refresh(
    datos: RefreshRequest,
    db: Session = Depends(get_db)
):
    resultado = svc_refresh(db, datos.refresh_token)
    return RespuestaExito(
        datos=resultado,
        mensaje="Token renovado correctamente"
    )
