# =============================================================
# models/roles.py — Modelo SQLAlchemy para la entidad Roles
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'roles'
# en MySQL. Los valores posibles son: usuario, tecnico,
# mesa_ayuda, admin.
# =============================================================

from sqlalchemy import Column, Integer, String   # tipos de columna SQLAlchemy
from app.database import Base                   # clase base declarativa

class Rol(Base): 
    __tablename__ = "roles"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_rol: clave primaria entera, autoincremental
    # Cada rol tiene un ID único generado automáticamente
    # ---------------------------------------------------------

    id_rol = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # nombre_rol: nombre del rol (usuario, tecnico, mesa_ayuda, admin)
    # nullable=False → campo obligatorio
    # unique=True    → no pueden existir dos roles con el mismo nombre
    # ---------------------------------------------------------

    nombre_rol = Column(String(50), nullable=False, unique=True)