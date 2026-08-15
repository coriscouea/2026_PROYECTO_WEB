# =============================================================
# routes/auth.py — Endpoints de autenticación
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Responsabilidad: expone los endpoints públicos de registro,
# login y renovación de token. No requieren autenticación previa.
# =============================================================

from fastapi import APIRouter, Depends, status, Request, HTTPException
from app.core.limiter import limiter
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.schemas.response import RespuestaExito
from app.services.auth_svc import svc_registro, svc_login, svc_refresh
from app.middleware.auth import get_current_user
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

# -------------------------------------------------------------
# GET /auth/me — Perfil del usuario autenticado
# Accesible para cualquier rol autenticado
# Devuelve los datos del usuario sin exponer el password
# -------------------------------------------------------------

@router.get("/me", status_code=status.HTTP_200_OK)
def obtener_perfil(
    db          : Session = Depends(get_db),
    current_user: dict    = Depends(get_current_user)
):
    from app.repository.usuario_repo import obtener_usuario
    id_usuario = int(current_user.get("sub"))
    usuario    = obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return RespuestaExito(
        datos  = UsuarioResponse.model_validate(usuario),
        mensaje= "Perfil obtenido correctamente"
    )

# -------------------------------------------------------------
# POST /auth/solicitar-reset
# Solicitud de restablecimiento de contraseña — público
# Crea solicitud en tabla solicitudes_reset y notifica al admin
# -------------------------------------------------------------
@router.post("/solicitar-reset", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
def solicitar_reset(
    request : Request,
    datos   : dict,
    db      : Session = Depends(get_db)
):
    from app.models.usuario import Usuario
    from app.models.roles import Rol
    from app.repository.solicitud_reset_repo import crear_solicitud

    email = datos.get("email", "").strip()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email es requerido"
        )

    # Verificar que el usuario existe
    usuario = db.query(Usuario).filter(
        Usuario.email == email,
        Usuario.activo == True
    ).first()

    # Por seguridad siempre respondemos igual
    mensaje = "Si el correo existe, el administrador fue notificado. Recibirás tu nueva contraseña por WhatsApp de Mesa de Ayuda."

    if not usuario:
        return RespuestaExito(datos=None, mensaje=mensaje)

    # Crear solicitud de reset
    solicitud = crear_solicitud(db, usuario.id_usuario)

    # Notificar a todos los admins con notificación interna
    from app.models.notificaciones import Notificacion
    rol_admin = db.query(Rol).filter(Rol.nombre_rol == "admin").first()
    if rol_admin:
        admins = db.query(Usuario).filter(
            Usuario.id_rol == rol_admin.id_rol,
            Usuario.activo == True
        ).all()
        for admin in admins:
            # Usar el primer ticket disponible como referencia
            from app.models.tickets import Ticket
            ticket_ref = db.query(Ticket).filter(Ticket.activo == True).first()
            if ticket_ref:
                notif = Notificacion(
                    id_usuario = admin.id_usuario,
                    id_ticket  = ticket_ref.id_ticket,
                    mensaje    = f"🔑 {usuario.nombre} ({email}) solicita restablecer su contraseña — ID solicitud: #{solicitud.id_solicitud}",
                    leida      = False
                )
                db.add(notif)

    db.commit()

    return RespuestaExito(datos=None, mensaje=mensaje)