# =============================================================
# models/sucursales.py — Modelo SQLAlchemy para Sucursales
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'sucursales'
# en MySQL. Cada sucursal representa una sede física de la
# empresa donde trabajan los usuarios del sistema.
# =============================================================

from sqlalchemy import Column, Integer, String      # tipos de columna SQLAlchemy
from app.database import Base                       # clase base declarativa

class Sucursal(Base):
    __tablename__ = "sucursales"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_sucursal: clave primaria entera, autoincremental
    # Cada sucursal tiene un ID único generado automáticamente
    # ---------------------------------------------------------

    id_sucursal = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # nombre_sucursal: nombre de la sucursal (ej. "Sucursal Central")
    # nullable=False → campo obligatorio
    # unique=True    → no pueden existir dos sucursales con el mismo nombre
    # ---------------------------------------------------------

    nombre = Column(String(100), nullable=False, unique=True)

    # ---------------------------------------------------------
    # ciudad: ciudad donde está ubicada la sucursal
    # nullable=True → campo opcional, puede quedar vacío
    # ---------------------------------------------------------

    ciudad = Column(String(100), nullable=True)