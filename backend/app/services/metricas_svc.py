# =============================================================
# services/metricas_svc.py — Servicio de Métricas
# HelpDesk Web | Feature 012 · Métricas Básicas
# =============================================================

from sqlalchemy.orm import Session
from app.repository.metricas_repo import (
    total_por_estado,
    total_por_categoria,
    total_por_tecnico,
    tiempo_promedio_resolucion,
    resumen_global
)

def svc_resumen(db: Session) -> dict:

    # ---------------------------------------------------------
    # Devuelve totales por estado con estructura completa
    # Garantiza que los 3 estados siempre aparecen aunque
    # no haya tickets — evita KeyError en el frontend
    # ---------------------------------------------------------

    datos = total_por_estado(db)
    return{
        "pendiente"     : datos.get("pendiente", 0),
        "en_proceso"    : datos.get("en_proceso", 0),
        "finalizado"    : datos.get("finalizado", 0),
        "total"         : sum(datos.values())   

    }

def svc_por_categoria(db: Session) ->list:

    # ---------------------------------------------------------
    # Devuelve totales por categoría
    # ---------------------------------------------------------

    return total_por_categoria(db)

def svc_por_tecnico(db: Session) -> list:

    # ---------------------------------------------------------
    # Devuelve totales por técnico asignado
    # ---------------------------------------------------------

    return total_por_tecnico(db)

def svc_tiempo_resolucion(db: Session) -> dict:

    # ---------------------------------------------------------
    # Devuelve el tiempo promedio de resolución de tickets
    # ---------------------------------------------------------

    return tiempo_promedio_resolucion(db)

def svc_resumen_global(db: Session) -> dict:

    # Devuelve el resumen completo del sistema
    # Distingue tickets activos, inactivos y finalizados históricos
    return resumen_global(db)