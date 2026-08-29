# =============================================================
# services/comentario_svc.py — Servicio de Comentarios
# HelpDesk Web | Feature 010 · Comentarios
# =============================================================
# Responsabilidad: lógica de negocio para comentarios.
# Verifica acceso al ticket antes de permitir comentar.
# Registra evento en historial tras crear comentario.
# =============================================================

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repository.comentario_repo import crear_comentario, listar_comentarios
from app.repository.ticket_repo import obtener_ticket
from app.models.comentarios import Comentario
from app.services import historial_svc
from app.repository.notificacion_repo import crear_notificacion
from app.repository.usuario_repo import obtener_admin

def svc_crear_comentario(

    # ---------------------------------------------------------
    # Registra el evento de creación de un comentario en el historial del ticket
    # ---------------------------------------------------------

    db          : Session, 
    id_ticket   : int,  
    texto       : str,
    current_user: dict
) -> Comentario :

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol        = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # ---------------------------------------------------------
    # Verifica acceso según rol — misma lógica que en tickets
    # ---------------------------------------------------------

    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en este ticket"
        )

    # ---------------------------------------------------------
    # Sanitiza el texto — elimina espacios sobrantes
    # ---------------------------------------------------------

    import bleach
    texto = bleach.clean(texto.strip(), tags=[], strip=True)

    # ---------------------------------------------------------
    # Crea el comentario
    # ---------------------------------------------------------

    comentario = crear_comentario(db, id_ticket, id_usuario, texto)

    # ---------------------------------------------------------
    # Registra evento en historial
    # ---------------------------------------------------------

    historial_svc.registrar_comentario_agregado(
        db         = db,
        id_ticket  = id_ticket,
        id_usuario = id_usuario
    )

    # ---------------------------------------------------------
    # Genera notificaciones según la lógica de roles
    # El comentador nunca se notifica a sí mismo
    # ---------------------------------------------------------

    ids_a_notificar = set()

    # Notificar al dueño del ticket si no es quien comentó
    if ticket.id_usuario and ticket.id_usuario != id_usuario:
        ids_a_notificar.add(ticket.id_usuario)

    # Notificar al técnico asignado si no es quien comentó
    if ticket.id_tecnico_asignado and ticket.id_tecnico_asignado != id_usuario:
        ids_a_notificar.add(ticket.id_tecnico_asignado)

    # Notificar al admin — obtiene el id del admin desde la BD

    admin = obtener_admin(db)
    if admin and admin.id_usuario != id_usuario:
        ids_a_notificar.add(admin.id_usuario)

    # Crea una notificación por cada destinatario identificado
    mensaje = f"Nuevo comentario en el ticket #{id_ticket}"
    for id_dest in ids_a_notificar:
        crear_notificacion(db, id_dest, id_ticket, mensaje)


    db.commit()                         # confirma el comentario y el evento de historial
    db.refresh(comentario)              # recarga el comentario con la relación usuario actualizada

    # Resuelve el nombre del autor desde la relación para incluirlo en la respuesta
    comentario.nombre_usuario = comentario.usuario.nombre if comentario.usuario else None

    return comentario

def svc_listar_comentarios(
    db          : Session,
    id_ticket   : int,
    current_user: dict
) -> list[Comentario]:

    # ---------------------------------------------------------
    # Verifica que el ticket existe
    # ---------------------------------------------------------

    ticket = obtener_ticket(db, id_ticket)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {id_ticket} no encontrado"
        )

    rol        = current_user.get("rol")
    id_usuario = int(current_user.get("sub"))

    # ---------------------------------------------------------
    # Verifica acceso según rol
    # ---------------------------------------------------------

    if rol == "usuario" and ticket.id_usuario != id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )
    elif rol == "tecnico" and ticket.id_categoria not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )
    elif rol == "mesa_ayuda" and ticket.id_categoria != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver los comentarios de este ticket"
        )
    comentarios = listar_comentarios(db, id_ticket)
    
    # Resuelve el nombre del autor en cada comentario desde la relación precargada
    for c in comentarios:
        c.nombre_usuario = c.usuario.nombre if c.usuario else None

    return comentarios