# =============================================================
# repository/categoria_repo.py — Repositorio de Categorías
# HelpDesk Web | Feature 008 · Optimización del Backend
# =============================================================
# Responsabilidad: encapsula el acceso a la tabla categorias
# con caché cache-aside usando lru_cache.
# Las categorías son datos estáticos (Técnica, Redes, ERP)
# que casi nunca cambian — ideal para cachear.
# =============================================================

from sqlalchemy.orm import Session
from functools import lru_cache
from app.models.categorias import Categoria

# -------------------------------------------------------------
# TTL simulado: lru_cache no expira automáticamente.
# En producción se usará Redis con TTL real (feature 017).
# maxsize=1 porque solo hay una consulta posible: listar todas
# -------------------------------------------------------------

@lru_cache(maxsize=1)
def _cache_categorias():

    # ---------------------------------------------------------
    # Contenedor del caché — se llena en la primera llamada
    # y se reutiliza en las siguientes (cache hit)
    # ---------------------------------------------------------

    return []

def listar_categorias(db: Session) -> list[Categoria]:

    # ---------------------------------------------------------
    # Estrategia cache-aside:
    # 1. Busca en caché primero
    # 2. Si no hay datos (cache miss)   → consulta BD y guarda
    # 3. Si hay datos (cache hit)       → devuelve sin consultar BD
    # ---------------------------------------------------------

    cache = _cache_categorias()
    if cache:
        return cache                            # cache hit
    categorias = db.query(Categoria).all()      # cache miss → consulta BD
    cache.extend(categorias)                    # guarda en caché
    return categorias

def invalidar_cache_categorias():

    # ---------------------------------------------------------
    # Invalida el caché explícitamente
    # Se llama cuando se crea o modifica una categoría
    # para evitar que el cliente reciba datos desactualizados
    # ---------------------------------------------------------

    _cache_categorias.cache_clear()