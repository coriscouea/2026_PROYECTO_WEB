# 010 · Comentarios

**Estado:** propuesta

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

- [ ] POST crea comentario con autor (id_usuario del token) y fecha automática.
- [ ] GET devuelve comentarios ordenados por fecha ASC.
- [ ] Un usuario estándar solo puede comentar en sus propios tickets.
- [ ] Técnico/mesa_ayuda solo puede comentar en tickets de su categoría.
- [ ] Admin puede comentar en cualquier ticket.
- [ ] Al crear un comentario se registra evento `comentario_agregado` en historial_ticket.
- [ ] Comentario vacío devuelve 422.
- [ ] Comentario en ticket inexistente devuelve 404.

## Validaciones

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `texto` | str | Sí | min 1 char, max 1000, sin etiquetas HTML |

## Fuera de alcance

- Comentarios internos vs públicos (backlog futuro).
- Editar o eliminar comentarios (backlog futuro).
