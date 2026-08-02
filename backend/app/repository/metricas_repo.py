# =============================================================
# repository/metricas_repo.py — Repositorio de Métricas
# HelpDesk Web | Feature 012 · Métricas Básicas
# =============================================================
# Responsabilidad: ejecuta consultas SQL para calcular
# indicadores del sistema. El cálculo ocurre en MySQL —
# no se cargan todos los registros en Python.
# =============================================================

from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.models.tickets import Ticket
from app.models.usuario import Usuario
from app.models.categorias import Categoria

def total_por_estado(db: Session) -> dict:

    # ---------------------------------------------------------
    # Cuenta tickets activos agrupados por estado
    # ---------------------------------------------------------

    resultados = (
        db.query(Ticket.estado, func.count(Ticket.id_ticket))
        .filter(Ticket.estado == True)                              # Solo tickets activos
        .group_by(Ticket.estado)
        .all()
    )   
    return {estado: total for estado, total in resultados}

def total_por_categoria(db: Session) -> dict:

    # ---------------------------------------------------------
    # Cuenta tickets activos agrupados por categoría
    # Usa JOIN con Categorias para obtener el nombre
    # ---------------------------------------------------------

    resultados = (
        db.query(Categoria.nombre, func.count(Ticket.id_ticket))
        .join(Ticket, Ticket.id_categoria == Categoria.id_categoria)
        .filter(Ticket.estado == True)                              # Solo tickets activos
        .group_by(Categoria.nombre)
        .all()
    )
    return [{"categoria": nombre, "total": total} for nombre, total in resultados]

def total_por_tecnico(db: Session) -> dict:

    # ---------------------------------------------------------
    # Cuenta tickets activos agrupados por técnico asignado
    # Solo incluye tickets que tienen técnico asignado
    # ---------------------------------------------------------

    resultados = (
        db.query(Usuario.nombre, func.count(Ticket.id_ticket))
        .join(Ticket, Ticket.id_tecnico_asignado == Usuario.id_usuario)
        .filter(Ticket.estado == True)                              # Solo tickets activos
        .group_by(Usuario.nombre)
        .all()
    )
    return [{"tecnico": nombre, "total": total} for nombre, total in resultados]

def tiempo_promedio_resolucion(db: Session) -> dict:

    # ---------------------------------------------------------
    # Calcula el tiempo promedio de resolución en horas
    # Solo tickets finalizados con fecha_actualizacion registrada
    # TIMESTAMPDIFF es una función nativa de MySQL
    # ---------------------------------------------------------

    resultado = (
        db.query(
            func.avg(
                func.timestampdiff(
                    text('HOUR'),
                    Ticket.fecha_creacion,
                    Ticket.fecha_actualizacion
                )
            )   
        )   
        .filter(
            Ticket.estado == "finalizado",
            Ticket.fecha_actualizacion != None
        )
        .scalar()
    )
    promedio = round(float(resultado), 2) if resultado else 0
    return {"promedio_horas": promedio}