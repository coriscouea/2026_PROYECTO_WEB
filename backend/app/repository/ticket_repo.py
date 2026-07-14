# =============================================================
# repository/ticket_repo.py — Repositorio de Tickets
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: encapsula todo el acceso a la base de datos
# para la entidad Ticket. Solo ejecuta operaciones SQLAlchemy
# — nunca contiene lógica de negocio ni validaciones de dominio.
# La lógica de negocio vive en la capa service.
# =============================================================

from sqlalchemy.orm import Session                          # sesión de base de datos
from app.models.tickets import Ticket                       # sesión de base de datos
from app.schemas.ticket import TicketCreate, TicketUpdate   # schemas Pydantic
from datetime import datetime, timezone                               # para registrar fechas de actualización

def crear_ticket(db: Session, datos: TicketCreate) -> Ticket:

    # ---------------------------------------------------------
    # Crea un nuevo ticket en la base de datos
    # estado inicia en "pendiente" (regla de negocio 3)
    # id_tecnico_asignado inicia en None (regla de negocio 8)
    # ---------------------------------------------------------    

    nuevo_ticket = Ticket(
        titulo              = datos.titulo,
        descripcion         = datos.descripcion,
        prioridad           = datos.prioridad,
        id_categoria        = datos.id_categoria,
        id_usuario          = datos.id_usuario,
        estado              = "pendiente",
        id_tecnico_asignado = None,
        activo              = True
    )

    db.add(nuevo_ticket)
    db.commit()
    db.refresh(nuevo_ticket)     # actualiza el objeto con el id generado por MySQL   
    return nuevo_ticket

def listar_tickets(db: Session, page: int = 1, limit: int = 10) -> list[Ticket]:      

    # ---------------------------------------------------------
    # Busca un ticket por su ID
    # Devuelve None si no existe — el service maneja el 404
    # ---------------------------------------------------------

    offset = (page - 1) * limit
    return (
        db.query(Ticket)
        .filter(Ticket.activo == True)
        .offset(offset)
        .limit(limit)
        .all()
    )

def obtener_ticket(db: Session, id_ticket: int) -> Ticket | None:

    # ---------------------------------------------------------
    # Busca un ticket por su ID
    # Devuelve None si no existe — el service maneja el 404
    # ---------------------------------------------------------    

    return (
        db.query(Ticket)
        .filter(Ticket.id_ticket == id_ticket, Ticket.activo == True)
        .first()
    )

def actualizar_ticket(db: Session, ticket: Ticket, datos: TicketUpdate) -> Ticket:

    # ---------------------------------------------------------
    # Actualiza solo los campos enviados (PATCH)
    # exclude_unset=True ignora campos no enviados en la solicitud
    # ---------------------------------------------------------

    datos_dict = datos.model_dump(exclude_unset = True)
    for campo, valor in datos_dict.items():
        setattr(ticket, campo, valor)
    ticket.fecha_actualizacion = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(ticket)
    return ticket

def desactivar_ticket(db: Session, ticket: Ticket) -> Ticket:

    # ---------------------------------------------------------
    # Soft delete — marca el ticket como inactivo (regla 3)
    # El registro permanece en la BD para trazabilidad
    # ---------------------------------------------------------

    ticket.activo = False
    ticket.fecha_actualizacion = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ticket)
    return ticket
