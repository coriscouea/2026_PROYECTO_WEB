# 010 · Comentarios

**Estado:** implementado ✅

## Qué hace

Permite agregar y consultar comentarios de seguimiento en cada ticket.
Los comentarios están ordenados por fecha ascendente para que el hilo
de conversación sea natural. Cada comentario registra el autor y timestamp.

## Por qué

Los tickets necesitan un canal de comunicación entre el solicitante y
el técnico. Sin comentarios, el seguimiento se haría fuera del sistema
(correo, WhatsApp) — exactamente el problema que HelpDesk Web resuelve.

## Endpoints

| Método | Ruta | Qué hace | Quién |
|---|---|---|---|
| POST | `/api/v1/tickets/{id}/comentarios` | Agrega un comentario al ticket | Cualquier rol autenticado |
| GET | `/api/v1/tickets/{id}/comentarios` | Lista comentarios ordenados por fecha ASC | Cualquier rol con acceso al ticket |

## Criterios de aceptación

- [X] POST crea comentario con autor (id_usuario del token) y fecha automática (`server_default=func.now()` en el modelo).
- [X] GET devuelve comentarios ordenados por fecha ASC.
- [X] Un usuario estándar solo puede comentar en sus propios tickets.
- [X] Técnico/mesa_ayuda solo puede comentar en tickets de su categoría.
- [X] Admin puede comentar en cualquier ticket.
- [X] Al crear un comentario se registra evento `comentario_agregado` en historial_ticket (con la misma observación de atomicidad de [[009]]).
- [X] Comentario vacío devuelve 422 (`ComentarioCreate.texto` con `min_length=1`). Nota: un texto de solo espacios pasa la validación de Pydantic y luego se guarda vacío tras el `.strip()` en el service — caso límite no cubierto.
- [X] Comentario en ticket inexistente devuelve 404.

## Pendiente detectado en revisión

- La sanitización de `texto` solo hace `.strip()` — no elimina etiquetas HTML. Mismo riesgo de XSS que en 005 y 006.

## Validaciones

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `texto` | str | Sí | min 1 char, max 1000, sin etiquetas HTML |

## Fuera de alcance

- Comentarios internos vs públicos (backlog futuro).
- Editar o eliminar comentarios (backlog futuro).
