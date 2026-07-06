# =============================================================
# models/categorias.py — Modelo SQLAlchemy para Categorías
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: define la estructura de la tabla 'categorias'
# en MySQL. Los valores posibles son: Técnica, Redes, ERP.
# La categoría determina a qué bandeja se enruta el ticket:
# Técnica y Redes → Técnico | ERP → Mesa de ayuda
# =============================================================

from sqlalchemy import Column, Integer, String      # tipos de columna SQLAlchemy
from app.database import Base                       # clase base declarativa

class Categoria(Base):
    __tablename__ = "categorias"  # Nombre de la tabla en MySQL

    # ---------------------------------------------------------
    # id_categoria: clave primaria entera, autoincremental
    # Cada categoría tiene un ID único generado automáticamente
    # ---------------------------------------------------------

    id_categoria = Column(Integer, primary_key=True, autoincrement=True)

    # ---------------------------------------------------------
    # nombre: nombre de la categoría (Técnica, Redes, ERP)
    # nullable=False → campo obligatorio
    # unique=True    → no pueden existir dos categorías con el mismo nombre
    # ---------------------------------------------------------

    nombre_categoria = Column(String(50), nullable=False, unique=True)