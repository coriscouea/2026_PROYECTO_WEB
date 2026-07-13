# =============================================================
# services/ticket_svc.py — Servicio de Tickets
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: contiene toda la lógica de negocio de tickets.
# Verifica reglas de dominio antes de invocar al repositorio.
# El router nunca accede al repositorio directamente — siempre
# pasa por esta capa de servicio.
# =============================================================

from sqlalchemy.orm import Session # 
from fastapi import HTTPException, status
from app.schemas.ticket import TicketCreate, TicketUpdate
from app.models.tickets import Ticket
from app.models.categorias import Categoria
from app.models.usuario import Usuario
from app import repository
from app.repository.ticket_repo import (
    crear_ticket,
    listar_tickets,
    obtener_ticket,
    actualizar_ticket,
    desactivar_ticket
)

# -------------------------------------------------------------
# Mapa de transiciones válidas de estado
# Un ticket solo puede avanzar en este orden:
# pendiente → en_proceso → finalizado
# No se permiten saltos ni retrocesos (regla de transición)
# -------------------------------------------------------------

TRANSICIONES_VALIDAS = {
    "pendiente"     : ["en_proceso"],
    "en_proceso"    : ["finalizado"],
    "finalizado"    : []
}

def svc_crear_ticket(db: Session, datos: TicketCreate) -> Ticket:

    # ---------------------------------------------------------
    # Verifica que la categoría existe en la BD
    # Si no existe devuelve 400 Bad Request
    # ---------------------------------------------------------

    categoria = db.query(Categoria)
    .filter(Categoria.id_categoria == datos.id_categoria)
    .first()

    if not categoria:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "La categoría especificada no existe"
        )

    # ---------------------------------------------------------
    # Verifica que el usuario solicitante existe y está activo
    # ---------------------------------------------------------

    usuario = db.query(Usuario)
    .filter(Usuario.id_usuario == datos.id_usuario, Usuario.activo == True)
    .first()

    if not usuario:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "El usuario especificado no existe o esta inactivo"
        )

    # ---------------------------------------------------------
    # Sanitiza los campos de texto — elimina espacios sobrantes
    # La sanitización completa (XSS) se implementará con bleach
    # en una fase posterior
    # ---------------------------------------------------------

    datos.titulo = datos.titulo.strip()
    datos.descripcion = datos.descripcion.strip()

    return crear_ticket(db, datos)

def svc_listar_tickets(db: Session, page: int, limit: int) -> list[Ticket]:
    return listar_tickets(db, page, limit)

def svc_obtener_ticket(db: Session, id_ticket: int) -> Ticket:

    # ---------------------------------------------------------
    # Busca el ticket — devuelve 404 si no existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND
        )
    return ticket

def svc_actualizar_ticket(db: Session, id_ticket: int, datos: TicketUpdate) -> Ticket:

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Ticket con ID {id_ticket} no enocntrado"
        )  

    # ---------------------------------------------------------
    # Valida la transición de estado si se envía un nuevo estado
    # Solo permite: pendiente → en_proceso → finalizado
    # ---------------------------------------------------------

    if datos.estado:
        estado_actual = ticket.estado
        estados_permitidos = TRANSICIONES_VALIDAS.get(estado_actual,[])
        if datos.estado not in estados_permitidos:
            raise HTTPException(
                status_code = status.HTTP_422_UNPROCESSABLE_CONTENT_ENTITY,
                detail = f"No se puede cambiar el estado de '{estado_actual}' a '{datos.estado}'"
            )   
    return actualizar_ticket(db, ticket, datos)

def svc_desactivar_ticket(db: Session, id_ticket: int) -> Ticket:

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    # ---------------------------------------------------------
    # Verifica que el ticket no esté ya inactivo
    # ---------------------------------------------------------
    
    if not ticket.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ticket ya está inactivo"
        )

    return desactivar_ticket(db, ticket)