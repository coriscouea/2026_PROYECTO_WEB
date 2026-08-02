# 009 · Historial de Eventos del Ticket

**Estado:** propuesta

## Qué hace

Registra automáticamente todos los eventos importantes del ciclo de vida
de un ticket en una tabla `historial_ticket`. Cada evento incluye el tipo,
una descripción legible, el usuario responsable y la fecha. Esto permite
construir una línea de tiempo completa del ticket.

## Por qué

Actualmente el historial solo registraba cambios de estado. Pero la
trazabilidad completa requiere saber cuándo se creó el ticket, quién lo
asignó, cuándo se agregó un comentario o se cambió la prioridad. Esta
información es crítica para auditoría y para la interfaz de detalle del ticket.

## Eventos a registrar

| Tipo de evento | Cuándo se dispara |
|---|---|
| `ticket_creado` | Al crear el ticket |
| `tecnico_asignado` | Al asignar id_tecnico_asignado |
| `estado_cambiado` | Al cambiar el estado |
| `prioridad_cambiada` | Al cambiar la prioridad |
| `comentario_agregado` | Al crear un comentario |
| `ticket_cerrado` | Al pasar a estado finalizado |

## Modelo de la entidad

```
historial_ticket:
  id_historial    INT PK autoincremental
  id_ticket       INT FK → tickets
  id_usuario      INT FK → usuarios (quien ejecutó la acción)
  tipo_evento     ENUM(ticket_creado, tecnico_asignado, estado_cambiado,
                       prioridad_cambiada, comentario_agregado, ticket_cerrado)
  descripcion     VARCHAR(255) — texto legible del evento
  fecha           DATETIME DEFAULT now()
```

## Arquitectura

```
[services/ticket_svc.py]      ← llama a registrar_evento después de cada operación
[services/comentario_svc.py]  ← llama a registrar_evento al crear comentario
        ↓
[services/historial_svc.py]   ← lógica de registro de eventos
        ↓
[repository/historial_repo.py] ← INSERT en historial_ticket
```

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/v1/tickets/{id}/historial` | Lista todos los eventos del ticket ordenados por fecha ASC |

## Criterios de aceptación

- [ ] Al crear un ticket se registra evento `ticket_creado` automáticamente.
- [ ] Al asignar técnico se registra evento `tecnico_asignado`.
- [ ] Al cambiar estado se registra evento `estado_cambiado` con descripción del cambio.
- [ ] Al cambiar prioridad se registra evento `prioridad_cambiada`.
- [ ] Al agregar comentario se registra evento `comentario_agregado`.
- [ ] Al finalizar ticket se registra evento `ticket_cerrado`.
- [ ] GET /api/v1/tickets/{id}/historial devuelve eventos ordenados por fecha ASC.
- [ ] Solo usuarios con acceso al ticket pueden ver su historial.
- [ ] Los eventos se registran dentro de una transacción ACID con la operación principal.

## Fuera de alcance

- Auditoría de acciones del sistema (login, cambio de roles) → backlog futuro.
- Editar o eliminar eventos del historial → nunca permitido.
