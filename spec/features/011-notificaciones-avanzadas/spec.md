# 011 · Notificaciones Avanzadas

**Estado:** propuesta

## Qué hace

Expande la funcionalidad de notificaciones existente con endpoints para
marcar como leída, contar no leídas y listar solo las pendientes.

## Por qué

Actualmente las notificaciones se insertan pero no hay forma de consultarlas
ni marcarlas como leídas desde la API. El frontend necesita estos endpoints
para mostrar el badge de notificaciones y la bandeja de avisos.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/v1/notificaciones` | Lista notificaciones del usuario autenticado |
| GET | `/api/v1/notificaciones/no-leidas` | Lista solo notificaciones no leídas |
| GET | `/api/v1/notificaciones/conteo` | Devuelve el conteo de no leídas |
| PATCH | `/api/v1/notificaciones/{id}/leer` | Marca una notificación como leída |
| PATCH | `/api/v1/notificaciones/leer-todas` | Marca todas como leídas |

## Criterios de aceptación

- [ ] GET /notificaciones devuelve solo las del usuario autenticado (del JWT).
- [ ] GET /notificaciones/no-leidas devuelve solo las con `leida=FALSE`.
- [ ] GET /notificaciones/conteo devuelve `{"total": N}`.
- [ ] PATCH /{id}/leer marca `leida=TRUE` — 404 si no existe o no pertenece al usuario.
- [ ] PATCH /leer-todas marca todas las notificaciones del usuario como leídas.
- [ ] Ningún usuario puede ver ni modificar notificaciones de otro usuario.

## Fuera de alcance

- Notificaciones push (PWA) — backlog futuro.
- Eliminar notificaciones antiguas automáticamente — backlog futuro.
