# 009 · Historial de Eventos del Ticket

**Estado:** implementado ✅

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

- [X] Al crear un ticket se registra evento `ticket_creado` automáticamente (`ticket_svc.svc_crear_ticket`).
- [X] Al asignar técnico se registra evento `tecnico_asignado` (`ticket_svc.svc_actualizar_ticket`).
- [X] Al cambiar estado se registra evento `estado_cambiado` con descripción del cambio.
- [X] Al cambiar prioridad se registra evento `prioridad_cambiada`.
- [X] Al agregar comentario se registra evento `comentario_agregado` (`comentario_svc.svc_crear_comentario`).
- [X] Al finalizar ticket se registra evento `ticket_cerrado` (también se registra al desactivar el ticket vía DELETE).
- [X] GET /api/v1/tickets/{id}/historial devuelve eventos ordenados por fecha ASC (`historial_repo.listar_historial`).
- [X] Solo usuarios con acceso al ticket pueden ver su historial (verificación por rol/categoría en `historial_svc.svc_listar_historial`).
- [X] Los eventos se registran dentro de una transacción ACID con la operación principal. `ticket_repo.crear_ticket`, `comentario_repo.crear_comentario`, `ticket_repo.actualizar_ticket` y `ticket_repo.desactivar_ticket` usan `flush()` en vez de `commit()` propio; `historial_repo.registrar_evento` también usa solo `flush()`. El `commit()` único queda a cargo del service que orquesta la operación (`ticket_svc`/`comentario_svc`), cubriendo registro principal + evento en la misma transacción — si algo falla entremedio, ninguno de los dos se persiste.

## Fuera de alcance

- Auditoría de acciones del sistema (login, cambio de roles) → backlog futuro.
- Editar o eliminar eventos del historial → nunca permitido.
