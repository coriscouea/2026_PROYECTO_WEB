# =============================================================
# repository/usuario_repo.py — Repositorio de Usuarios
# HelpDesk Web | Feature 006 · CRUD Usuarios
# =============================================================
# Responsabilidad: encapsula todo el acceso a la base de datos
# para la entidad Usuario. Solo ejecuta operaciones SQLAlchemy
# — nunca contiene lógica de negocio ni validaciones de dominio.
# =============================================================

from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
from datetime import datetime, timezone

def crear_usuario(db: Session, datos: UsuarioCreate, password_hash:str) -> Usuario:

    # ---------------------------------------------------------
    # Crea un nuevo usuario en la base de datos
    # El password_hash viene ya procesado desde la capa service
    # activo=True por defecto — todo usuario nuevo nace activo
    # ---------------------------------------------------------

    nuevo_usuario = Usuario(
        nombre          = datos.nombre,
        email           = datos.email.lower(),      # transforma a minúsculas
        password        = password_hash,
        id_rol          = datos.id_rol,
        id_sucursal     = datos.id_sucursal,
        activo          = True
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def listar_usuarios(db: Session, page: int = 1, limit: int = 10) -> list[Usuario]:
    
    # ---------------------------------------------------------
    # Lista usuarios activos con paginación
    # ---------------------------------------------------------
    
    offset = (page - 1) * limit
    return (
        db.query(Usuario)
        .filter(Usuario.activo == True)
        .offset(offset)
        .limit(limit)
        .all()
    )

def obtener_usuario(db: Session, id_usuario: int) -> Usuario | None:
    
    # ---------------------------------------------------------
    # Busca un usuario por su ID
    # Devuelve None si no existe — el service maneja el 404
    # ---------------------------------------------------------
    
    return (
        db.query(Usuario)
        .filter(Usuario.id_usuario == id_usuario, Usuario.activo == True)
        .first()
    )

def buscar_por_email(db: Session, email: str) -> Usuario | None:
    
    # ---------------------------------------------------------
    # Busca un usuario por email (para verificar unicidad)
    # Busca en todos los usuarios — activos e inactivos
    # para evitar duplicar emails de cuentas desactivadas
    # ---------------------------------------------------------
   
    return (
        db.query(Usuario)
        .filter(Usuario.email == email.lower()) 
        .first()
    )

def actualizar_usuario(db: Session, usuario: Usuario, datos: UsuarioUpdate) -> Usuario:
    
    # ---------------------------------------------------------
    # Actualiza solo los campos enviados (PATCH)
    # exclude_unset=True ignora campos no enviados
    # ---------------------------------------------------------
    
    datos_dict = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_dict.items():
        setattr(usuario, campo, valor)
    db.commit()
    db.refresh(usuario)
    return usuario

def desactivar_usuario(db: Session, usuario: Usuario) -> Usuario:

    # ---------------------------------------------------------
    # Soft delete — marca el usuario como inactivo (regla 4)
    # El registro permanece en la BD para trazabilidad
    # ---------------------------------------------------------
    
    usuario.activo = False
    db.commit()
    db.refresh(usuario)
    return usuario
  
