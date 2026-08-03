# 011 · Notificaciones Avanzadas

**Estado:** implementado ✅

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

- [X] GET /notificaciones devuelve solo las del usuario autenticado (del JWT).
- [X] GET /notificaciones/no-leidas devuelve solo las con `leida=FALSE`.
- [X] GET /notificaciones/conteo devuelve `{"total": N}`.
- [X] PATCH /{id}/leer marca `leida=TRUE` — 404 si no existe o no pertenece al usuario.
- [X] PATCH /leer-todas marca todas las notificaciones del usuario como leídas.
- [X] Ningún usuario puede ver ni modificar notificaciones de otro usuario — todas las queries de `notificacion_repo` filtran por `id_usuario` del JWT.

## Fuera de alcance

- Notificaciones push (PWA) — backlog futuro.
- Eliminar notificaciones antiguas automáticamente — backlog futuro.
