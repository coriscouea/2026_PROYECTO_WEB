# =============================================================
# services/ticket_svc.py — Servicio de Tickets
# HelpDesk Web | Feature 005 · CRUD Tickets
# =============================================================
# Responsabilidad: contiene toda la lógica de negocio de tickets.
# Verifica reglas de dominio antes de invocar al repositorio.
# El router nunca accede al repositorio directamente — siempre
# pasa por esta capa de servicio.
# =============================================================

from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload  
from fastapi import HTTPException, status
from app.schemas.ticket import TicketCreate, TicketUpdate
from app.models.tickets import Ticket
from app.models.categorias import Categoria
from app.models.usuario import Usuario
from app.services import historial_svc
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

    categoria = db.query(Categoria).filter(
        Categoria.id_categoria == datos.id_categoria
    ).first()

    if not categoria:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "La categoría especificada no existe"
        )

    # ---------------------------------------------------------
    # Verifica que el usuario solicitante existe y está activo
    # ---------------------------------------------------------

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == datos.id_usuario, 
        Usuario.activo == True
    ).first()

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

    import bleach
    datos.titulo = bleach.clean(datos.titulo.strip(), tags=[], strip=True)
    datos.descripcion = bleach.clean(datos.descripcion.strip(), tags=[], strip=True)

    # ... código existente ...
    ticket = crear_ticket(db, datos)
    
    # Registrar evento de creación
    historial_svc.registrar_ticket_creado(
        db         = db,
        id_ticket  = ticket.id_ticket,
        id_usuario = ticket.id_usuario,
        titulo     = ticket.titulo
    )
    db.commit()
    return ticket


def svc_listar_tickets(db: Session, page: int, limit: int, current_user: dict, filtro: str = "activos") -> list[Ticket]:

    # ---------------------------------------------------------
    # Filtra tickets según el rol del usuario autenticado:
    # - usuario → solo sus propios tickets
    # - tecnico → tickets de categoría Técnica (1) y Redes (2)
    # - mesa_ayuda → tickets de categoría ERP (3)
    # - admin → todos los tickets
    # ---------------------------------------------------------
    
    rol = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    tickets = listar_tickets(db, page, limit, rol, id_usuario, filtro)

    # Resuelve los nombres desde las relaciones precargadas
    for ticket in tickets:
        ticket.nombre_usuario = ticket.solicitante.nombre if ticket.solicitante else None
        ticket.nombre_tecnico = ticket.tecnico.nombre     if ticket.tecnico      else None

    return tickets

def svc_obtener_ticket(db: Session, id_ticket: int, current_user: dict) -> Ticket:

    # ---------------------------------------------------------
    # Busca el ticket — devuelve 404 si no existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # Verifica pertenencia según rol
    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este ticket"
        )
    
    # Resuelve los nombres desde las relaciones precargadas
    ticket.nombre_usuario  = ticket.solicitante.nombre if ticket.solicitante else None
    ticket.nombre_tecnico  = ticket.tecnico.nombre     if ticket.tecnico      else None

    return ticket

def svc_actualizar_ticket(
    db          : Session,
    id_ticket   : int,
    datos       : TicketUpdate,
    current_user: dict 
) -> Ticket:

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Ticket con ID {id_ticket} no enocntrado"
        )  
    
    rol = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    if rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo puedes modificar tickets de categoría Técnica o Redes"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo puedes modificar tickets de categoría ERP"
        )

    if datos.estado:
        estado_actual = ticket.estado
        estados_permitidos = TRANSICIONES_VALIDAS.get(estado_actual, [])
        if datos.estado not in estados_permitidos:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"No se puede cambiar el estado de '{estado_actual}' a '{datos.estado.value}'"
            )
        
        # Registrar cambio de estado

        historial_svc.registrar_estado_cambiado(
            db              = db,
            id_ticket       = id_ticket,
            id_usuario      = id_usuario,
            estado_anterior = estado_actual,
            estado_nuevo    = datos.estado.value
        )
        if datos.estado == "finalizado":
            historial_svc.registrar_ticket_cerrado(
                db         = db,
                id_ticket  = id_ticket,
                id_usuario = id_usuario
            )

    if datos.prioridad and datos.prioridad != ticket.prioridad:
        historial_svc.registrar_prioridad_cambiada(
            db                 = db,
            id_ticket          = id_ticket,
            id_usuario         = id_usuario,
            prioridad_anterior = ticket.prioridad,
            prioridad_nueva    = datos.prioridad.value
        )

    if datos.id_tecnico_asignado and datos.id_tecnico_asignado != ticket.id_tecnico_asignado:
        from app.repository.usuario_repo import obtener_usuario
        tecnico = obtener_usuario(db, datos.id_tecnico_asignado)
        historial_svc.registrar_tecnico_asignado(
            db             = db,
            id_ticket      = id_ticket,
            id_usuario     = id_usuario,
            nombre_tecnico = tecnico.nombre if tecnico else "Técnico"
        )

    # Notifica al dueño del ticket que un técnico fue asignado
    from app.repository.notificacion_repo import crear_notificacion
    from app.repository.usuario_repo import obtener_admin

    ids_a_notificar = set()
    mensaje = f"Un técnico fue asignado al ticket #{id_ticket}"

    # Notificar al dueño del ticket si no es quien tomó el ticket
    if ticket.id_usuario and ticket.id_usuario != id_usuario:
        ids_a_notificar.add(ticket.id_usuario)

    # Notificar al admin si no es quien tomó el ticket
    admin = obtener_admin(db)
    if admin and admin.id_usuario != id_usuario:
        ids_a_notificar.add(admin.id_usuario)

    # Crea una notificación por cada destinatario identificado
    for id_dest in ids_a_notificar:
        crear_notificacion(db, id_dest, id_ticket, mensaje)

    # ---------------------------------------------------------
    # Genera notificaciones al cambiar estado del ticket
    # El que cambia el estado no se notifica a sí mismo
    # ---------------------------------------------------------

    if datos.estado:
        from app.repository.notificacion_repo import crear_notificacion
        from app.repository.usuario_repo import obtener_admin

        ids_a_notificar = set()
        mensaje = f"El ticket #{id_ticket} cambió de estado a '{datos.estado.value}'"

        # Notificar al dueño del ticket si no es quien cambió el estado
        if ticket.id_usuario and ticket.id_usuario != id_usuario:
            ids_a_notificar.add(ticket.id_usuario)

        # Notificar al técnico asignado si no es quien cambió el estado
        if ticket.id_tecnico_asignado and ticket.id_tecnico_asignado != id_usuario:
            ids_a_notificar.add(ticket.id_tecnico_asignado)

        # Notificar al admin — siempre, si no es quien cambió el estado
        admin = obtener_admin(db)
        if admin and admin.id_usuario != id_usuario:
            ids_a_notificar.add(admin.id_usuario)

        # Crea una notificación por cada destinatario identificado
        for id_dest in ids_a_notificar:
            crear_notificacion(db, id_dest, id_ticket, mensaje)

    return actualizar_ticket(db, ticket, datos)

def svc_desactivar_ticket(db: Session, id_ticket: int, current_user: dict) -> Ticket:

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

    id_usuario = int(current_user.get("sub"))
    historial_svc.registrar_ticket_cerrado(
        db         = db,
        id_ticket  = id_ticket,
        id_usuario = id_usuario
    )

    # Notifica a los involucrados que el ticket fue desactivado
    from app.repository.notificacion_repo import crear_notificacion
    from app.repository.usuario_repo import obtener_admin

    ids_a_notificar = set()
    mensaje = f"El ticket #{id_ticket} fue desactivado"

    # Notificar al dueño del ticket si no es quien desactivó
    if ticket.id_usuario and ticket.id_usuario != id_usuario:
        ids_a_notificar.add(ticket.id_usuario)

    # Notificar al técnico asignado si no es quien desactivó
    if ticket.id_tecnico_asignado and ticket.id_tecnico_asignado != id_usuario:
        ids_a_notificar.add(ticket.id_tecnico_asignado)

    # Notificar al admin si no es quien desactivó
    admin = obtener_admin(db)
    if admin and admin.id_usuario != id_usuario:
        ids_a_notificar.add(admin.id_usuario)

    # Crea una notificación por cada destinatario identificado
    for id_dest in ids_a_notificar:
        crear_notificacion(db, id_dest, id_ticket, mensaje)

    return desactivar_ticket(db, ticket)

    return desactivar_ticket(db, ticket)