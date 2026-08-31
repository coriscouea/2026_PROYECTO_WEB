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
        .filter(Ticket.activo == True)                              # Solo tickets activos
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
        .filter(Ticket.activo == True)                              # Solo tickets activos
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
        .filter(Ticket.activo == True)                              # Solo tickets activos
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

def resumen_global(db: Session) -> dict:

    # Cuenta todos los tickets sin importar estado activo/inactivo
    # Proporciona la vista completa del sistema para el dashboard
    total_global = db.query(func.count(Ticket.id_ticket)).scalar() or 0

    # Tickets activos por estado — carga de trabajo actual
    activos = (
        db.query(Ticket.estado, func.count(Ticket.id_ticket))
        .filter(Ticket.activo == True)
        .group_by(Ticket.estado)
        .all()
    )
    estados = {estado: total for estado, total in activos}

    # Tickets desactivados — historial de inactivos
    desactivados = (
        db.query(func.count(Ticket.id_ticket))
        .filter(Ticket.activo == False)
        .scalar() or 0
    )

    # Tickets finalizados históricos — activos e inactivos
    finalizados_historicos = (
        db.query(func.count(Ticket.id_ticket))
        .filter(Ticket.estado == "finalizado")
        .scalar() or 0
    )

    return {
        "total_global"          : total_global,
        "pendiente"             : estados.get("pendiente", 0),
        "en_proceso"            : estados.get("en_proceso", 0),
        "finalizado"            : estados.get("finalizado", 0),
        "desactivados"          : desactivados,
        "finalizados_historicos": finalizados_historicos,
        "total_activos"         : total_global - desactivados
    }
