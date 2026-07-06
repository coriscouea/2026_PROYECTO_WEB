# 005 · CRUD Tickets

**Estado:** propuesta

## Qué hace

Expone los endpoints REST que permiten crear, consultar, actualizar y
desactivar tickets técnicos desde la aplicación móvil. El usuario crea
un ticket eligiendo categoría y prioridad; el técnico o mesa de ayuda
lo consulta desde su bandeja y actualiza su estado. Ningún ticket se
elimina físicamente del sistema.

## Por qué

Los tickets son la entidad principal de HelpDesk Web. Sin estos endpoints
no existe la funcionalidad central del sistema: registrar requerimientos,
darles seguimiento y cerrarlos con trazabilidad. Toda feature posterior
(historial, notificaciones, métricas) depende de que el CRUD de tickets
esté funcionando correctamente.

## Arquitectura por capas

Cada operación CRUD recorre las siguientes capas en orden:

```
[routes/tickets.py]       ← recibe la solicitud HTTP, valida Pydantic, devuelve respuesta
        ↓
[services/ticket_svc.py]  ← aplica reglas de negocio antes de tocar datos
        ↓
[repository/ticket_repo.py] ← ejecuta operaciones SQLAlchemy contra MySQL
        ↓
[models/ticket.py]        ← define la entidad y sus restricciones
```

Ninguna regla de negocio vive en `routes/` ni en `repository/`.
Ninguna consulta SQL vive fuera de `repository/`.

## Endpoints

| Método | Ruta                   | Qué hace                                      | Pantalla móvil                |
|--------|------------------------|-----------------------------------------------|-------------------------------|
| POST   | `/api/v1/tickets`      | Crea un nuevo ticket                          | Pantalla "Nuevo requerimiento" |
| GET    | `/api/v1/tickets`      | Lista tickets con paginación y filtro por rol | Pantalla "Bandeja"            |
| GET    | `/api/v1/tickets/{id}` | Consulta el detalle de un ticket específico   | Pantalla "Detalle del ticket" |
| PATCH  | `/api/v1/tickets/{id}` | Actualiza estado, técnico asignado o prioridad | Pantalla "Gestionar ticket"  |
| DELETE | `/api/v1/tickets/{id}` | Soft delete — marca `activo=FALSE` (regla 3)  | Opción admin "Anular ticket" |
| DELETE | `/api/v1/tickets/{id}` | Soft delete — marca el ticket como inactivo   | Opción admin "Anular ticket"  |

## Criterios de aceptación

**Create**
- [ ] `POST /api/v1/tickets` crea un ticket con estado `pendiente` por defecto.
- [ ] El campo `id_tecnico_asignado` inicia en `None` al crear el ticket.
- [ ] La respuesta exitosa devuelve **201 Created** con el ticket completo en `{exito, datos, mensaje}`.
- [ ] Si el `titulo` o `descripcion` contienen etiquetas HTML, se sanitizan antes de persistir.

**Read**
- [ ] `GET /api/v1/tickets` devuelve solo los tickets visibles al rol del usuario autenticado.
- [ ] `GET /api/v1/tickets` soporta paginación con parámetros `page` y `limit`; la respuesta incluye metadatos de paginación.
- [ ] `GET /api/v1/tickets/{id}` devuelve **404 Not Found** si el ticket no existe.
- [ ] `GET /api/v1/tickets/{id}` devuelve **403 Forbidden** si el ticket no pertenece al rol del usuario.

**Update**
- [ ] `PATCH /api/v1/tickets/{id}` actualiza solo los campos enviados (no reemplaza el ticket completo).
- [ ] Solo técnico, mesa de ayuda o admin pueden ejecutar PATCH; un usuario estándar recibe **403**.
- [ ] Un ticket en estado `pendiente` no puede pasar directamente a `finalizado`; debe pasar antes por `en_proceso`; si se intenta la transición no permitida, devuelve **422 Unprocessable Entity**.
- [ ] Los campos `id_ticket` y `fecha_creacion` no pueden modificarse; si se envían, se ignoran.

**Delete**
- [ ] `DELETE /api/v1/tickets/{id}` no elimina el registro — marca `activo = FALSE` y registra `deleted_at = NOW()` (soft delete con fecha para limpieza futura).
- [ ] Si el ticket ya está inactivo, devuelve **400 Bad Request** con mensaje descriptivo.
- [ ] Solo admin puede ejecutar DELETE; cualquier otro rol recibe **403**.

**General**
- [ ] Todos los endpoints devuelven respuestas JSON con la estructura `{exito, datos, mensaje}` en éxito y `{exito, errores, mensaje}` en error.
- [ ] Ninguna respuesta expone trazas de pila, consultas SQL ni mensajes internos del servidor.
- [ ] Cada endpoint es probado en Postman con: caso exitoso, datos inválidos, recurso inexistente y rol no autorizado.

## Validaciones y sanitización

El orden de procesamiento es: **sanitizar → validar → transformar** (FastAPI/Pydantic, capa service).

| Campo          | Tipo        | Obligatorio | Reglas                                               | Código de error |
|----------------|-------------|-------------|------------------------------------------------------|-----------------|
| `titulo`       | str         | Sí          | min 5 chars, max 150, sin etiquetas HTML             | 422             |
| `descripcion`  | str         | Sí          | min 10 chars, sin etiquetas HTML                     | 422             |
| `prioridad`    | ENUM        | Sí          | solo `baja`, `media`, `alta`                         | 422             |
| `id_categoria` | int         | Sí          | debe existir en tabla Categorías                     | 400             |
| `id_usuario`   | int         | Sí          | debe existir y estar activo en tabla Usuario         | 400             |
| `estado`       | ENUM        | No (PATCH)  | solo `pendiente`, `en_proceso`, `finalizado`         | 422             |

> **400** = FK inexistente o dato malformado.
> **422** = formato correcto pero valor que viola una regla de validación o de negocio.

## Reglas de negocio aplicadas (capa service)

- **Regla 3** — los tickets no se eliminan físicamente; solo cambian de estado o se desactivan con `activo = FALSE`.
- **Regla 5** — solo técnico, mesa de ayuda o admin pueden cambiar el estado o asignarse el ticket.
- **Regla 8** — al crear el ticket, `id_tecnico_asignado` es `None`; el responsable lo toma manualmente desde su bandeja.
- **Regla de transición de estados** — el estado solo puede avanzar en orden:
  `pendiente → en_proceso → finalizado`. No se permiten saltos ni retrocesos.
  Violación → **422 Unprocessable Entity**.

## Códigos HTTP utilizados

| Código | Cuándo                                                    |
|--------|-----------------------------------------------------------|
| 201    | Ticket creado exitosamente (POST)                         |
| 200    | Consulta o actualización exitosa (GET, PATCH)             |
| 400    | FK inexistente, JSON malformado, ticket ya inactivo       |
| 403    | Rol sin permiso para la operación                         |
| 404    | Ticket no encontrado por ID                               |
| 422    | Valor viola reglas de validación o transición de estados  |

## Riesgos de seguridad

- **Acceso sin autenticación** — cualquier endpoint sin token válido devuelve **401 Unauthorized**.
- **Escalada de privilegios** — un usuario estándar no puede ejecutar PATCH ni DELETE; el rol se valida en la capa service, no en el frontend.
- **Inyección de contenido** — `titulo` y `descripcion` se sanitizan eliminando etiquetas HTML antes de persistir, previniendo ataques XSS cuando el contenido se muestre a otros usuarios.

## Fuera de alcance

- Autenticación JWT (→ feature 006-autenticacion).
- Registro automático en Historial_Estado al cambiar estado (→ feature 007-historial-estado).
- Notificaciones al asignar ticket (→ feature 008-notificaciones).
- Adjuntar archivos o imágenes al ticket (→ backlog futuro).
