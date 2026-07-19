# =============================================================
# routes/tickets.py — Endpoints REST para la entidad Ticket
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: recibe las solicitudes HTTP, valida los datos
# con Pydantic y delega la lógica al servicio. No contiene
# lógica de negocio ni acceso directo a la base de datos.
# =============================================================

from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse
from app.schemas.response import RespuestaExito
from app.services.ticket_svc import (
    svc_crear_ticket,
    svc_listar_tickets,
    svc_obtener_ticket,
    svc_actualizar_ticket,
    svc_desactivar_ticket
)
from app.services.notificacion_svc import crear_notificacion

# -------------------------------------------------------------
# Router — agrupa todos los endpoints de tickets bajo /api/v1/tickets
# -------------------------------------------------------------

router = APIRouter(
    prefix="/api/v1/tickets",
    tags=["Tickets"]
)

# -------------------------------------------------------------
# POST /api/v1/tickets — Crear un nuevo ticket
# Recibe los datos del ticket, los valida con Pydantic
# y delega la creación al servicio
# Devuelve 201 Created con el ticket creado
# -------------------------------------------------------------

@router.post("", status_code=status.HTTP_201_CREATED)
def crear_ticket(
    datos: TicketCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    ticket = svc_crear_ticket(db, datos)

    # ---------------------------------------------------------
    # Agrega la notificación como tarea en segundo plano
    # El cliente recibe 201 inmediatamente
    # La notificación se procesa después (asíncrono)
    # ---------------------------------------------------------

    background_tasks.add_task(
        crear_notificacion,
        id_usuario  = datos.id_usuario,
        id_ticket   = ticket.id_ticket,
        mensaje     = f"Tu ticket #{ticket.id_ticket} '{ticket.titulo}' fue creado correctamente"
    )
    return RespuestaExito(
        datos=TicketResponse.model_validate(ticket),
        mensaje="Ticket creado correctamente"
    )

# -------------------------------------------------------------
# GET /api/v1/tickets — Listar tickets con paginación
# Parámetros opcionales: page y limit para paginar resultados
# Devuelve 200 OK con la lista de tickets activos
# -------------------------------------------------------------

@router.get("", status_code=status.HTTP_200_OK)
def listar_tickets(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    tickets = svc_listar_tickets(db, page, limit)
    return RespuestaExito(
        datos=[{
            **TicketResponse.model_validate(t).model_dump(),
            "nombre_categoria": t.categoria.nombre if t.categoria else None
        } for t in tickets],
        mensaje=f"{len(tickets)} tickets encontrados"
    )

# -------------------------------------------------------------
# GET /api/v1/tickets/{id_ticket} — Obtener detalle de un ticket
# Devuelve 200 OK si existe, 404 Not Found si no existe
# -------------------------------------------------------------

@router.get("/{id_ticket}", status_code=status.HTTP_200_OK)
def obtener_ticket(
    id_ticket: int,
    db: Session = Depends(get_db)
):
    ticket = svc_obtener_ticket(db, id_ticket)
    return RespuestaExito(
        datos=TicketResponse.model_validate(ticket),
        mensaje="Ticket encontrado"
    )

# -------------------------------------------------------------
# PATCH /api/v1/tickets/{id_ticket} — Actualizar parcialmente
# Solo actualiza los campos enviados en el cuerpo
# Valida la transición de estados en la capa de servicio
# Devuelve 200 OK con el ticket actualizado
# -------------------------------------------------------------

@router.patch("/{id_ticket}", status_code=status.HTTP_200_OK)
def actualizar_ticket(
    id_ticket: int,
    datos: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = svc_actualizar_ticket(db, id_ticket, datos)
    return RespuestaExito(
        datos=TicketResponse.model_validate(ticket),
        mensaje="Ticket actualizado correctamente"
    )

# -------------------------------------------------------------
# DELETE /api/v1/tickets/{id_ticket} — Soft delete
# No elimina el registro — solo marca activo=FALSE (regla 3)
# Devuelve 200 OK confirmando la desactivación
# -------------------------------------------------------------

@router.delete("/{id_ticket}", status_code=status.HTTP_200_OK)
def desactivar_ticket(
    id_ticket: int,
    db: Session = Depends(get_db)
):
    ticket = svc_desactivar_ticket(db, id_ticket)
    return RespuestaExito(
        datos=TicketResponse.model_validate(ticket),
        mensaje="Ticket desactivado correctamente"
    )