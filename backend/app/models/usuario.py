# =============================================================
# models/usuario.py — Modelo SQLAlchemy para la entidad Usuario
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'usuarios'
# en MySQL. Cada usuario tiene un rol y pertenece a una sucursal.
# Los usuarios nunca se eliminan físicamente — solo se desactivan
# con activo=FALSE (regla de negocio 4).
# =============================================================

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index  # tipos de columna SQLAlchemy
from sqlalchemy.orm import relationship             # para definir relaciones entre tablas
from sqlalchemy.sql import func                     # para usar funciones SQL como CURRENT_TIMESTAMP
from app.database import Base                       # clase base declarativa

class Usuario(Base):
    __tablename__ = "usuarios" # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_usuario: clave primaria entera, autoincremental            
    # Cada usuario tiene un ID único generado automáticamente
    # ---------------------------------------------------------

    id_usuario = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # nombre: nombre completo del usuario
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    nombre = Column(String(100), nullable=False)

    # ---------------------------------------------------------
    # email: correo electrónico único del usuario
    # Se usa para iniciar sesión — nunca puede repetirse
    # nullable=False → campo obligatorio
    # unique=True    → garantiza unicidad a nivel de base de datos
    # ---------------------------------------------------------   

    email = Column(String(100), nullable=False, unique=True)

    # ---------------------------------------------------------
    # password: contraseña almacenada como hash bcrypt
    # NUNCA se almacena en texto plano (regla de seguridad)
    # nullable=False → campo obligatorio
    # ---------------------------------------------------------

    password = Column(String(255), nullable=False)

    # ---------------------------------------------------------
    # id_rol: clave foránea hacia la tabla roles
    # nullable=False → todo usuario debe tener un rol asignado
    # Por defecto se asigna el rol 'usuario' desde la capa service
    # ---------------------------------------------------------

    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)

    # ---------------------------------------------------------
    # id_sucursal: clave foránea hacia la tabla sucursales
    # nullable=True → un usuario puede no tener sucursal asignada
    # ---------------------------------------------------------

    id_sucursal = Column(Integer, ForeignKey("sucursales.id_sucursal"), nullable=True)    

    # ---------------------------------------------------------
    # fecha_registro: fecha y hora en que se creó el usuario
    # server_default=func.now() → MySQL asigna la fecha automáticamente
    # ---------------------------------------------------------

    fecha_registro = Column(DateTime, server_default=func.now())

    # ---------------------------------------------------------
    # activo: controla si el usuario está habilitado en el sistema
    # True  → usuario activo, puede iniciar sesión
    # False → usuario desactivado (soft delete, regla 4)
    # default=True → todo usuario nuevo nace activo
    # ---------------------------------------------------------

    activo = Column(Boolean, default=True, nullable=False)

    # ---------------------------------------------------------
    # Relaciones con otras tablas
    # relationship() permite navegar entre entidades en Python
    # sin escribir SQL manual
    # ---------------------------------------------------------

    rol = relationship("Rol")               # accede al rol del usuario
    sucursal = relationship("Sucursal")     # accede a la sucursal del usuario    

    # ---------------------------------------------------------
    # Índice estratégico sobre el campo email
    # Acelera la búsqueda por email en el proceso de login
    # Sin este índice, MySQL haría un full scan en cada autenticación
    # ---------------------------------------------------------

    __table_args__ = (
        Index("ix_usuario_email", "email"),  
    )