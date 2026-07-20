# 005 · CRUD Tickets — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Se implementan los 5 endpoints REST de Tickets en FastAPI usando el patrón
repositorio: la capa `routes/` recibe la petición, la capa `repository/`
ejecuta la consulta SQLAlchemy y la capa `schemas/` valida los datos con
Pydantic. Ningún endpoint escribe SQL manual — todo pasa por SQLAlchemy
conforme a `constitution/tech-stack.md`.

## Implementación

1. Definir los schemas Pydantic — `backend/app/schemas/ticket.py`
   (TicketCreate, TicketUpdate, TicketResponse).
2. Definir el formato estándar de respuesta JSON — `backend/app/schemas/response.py`
   con estructura `{exito, datos, mensaje}` para éxito y `{exito, errores, mensaje}` para error.
3. Crear el repositorio de tickets — `backend/app/repository/ticket_repo.py`
   con las operaciones: crear, listar, obtener por id, actualizar, desactivar.
   Solo acceso a datos — ninguna regla de negocio aquí.
4. Crear la capa de servicio — `backend/app/services/ticket_svc.py`
   con la lógica de negocio: validar transición de estados, verificar rol,
   sanitizar campos de texto, verificar existencia de FKs.
5. Crear el router de tickets — `backend/app/routes/tickets.py`
   con los 5 endpoints; solo recibe, valida con Pydantic e invoca el servicio.
6. Registrar el router en FastAPI — `backend/app/main.py`.
7. Probar en Swagger.

## Decisiones

- **PATCH en lugar de PUT** — se usa PATCH porque el frontend solo enviará
  los campos que cambian (estado, técnico asignado), no el ticket completo.
  PUT obligaría a enviar todos los campos en cada actualización.
- **Soft delete en lugar de DELETE físico** — aplicando la regla de negocio 3;
  el endpoint DELETE solo marca `activo = FALSE` sin borrar el registro.
- **Paginación con `page` y `limit`** — el GET de listado soporta paginación
  para no retornar todos los tickets en una sola respuesta, protegiendo
  el rendimiento cuando el volumen crezca.
- **joinedload** — carga categoria, solicitante y tecnico en una sola consulta (previene N+1).
- **422 para transición inválida** — formato correcto pero valor viola regla de negocio.
- **Respuesta JSON estandarizada** — todos los endpoints devuelven
  `{status, message, data}` para facilitar el consumo desde Ionic.

## Riesgos

- **Validación de FK inexistente** — si `id_categoria` o `id_usuario` no
  existen en la BD, SQLAlchemy lanzará un error de integridad; mitigación:
  verificar existencia antes del INSERT y devolver 400 con mensaje claro.
- **Acceso sin rol autorizado** — mitigación: validar el rol del usuario
  autenticado en los endpoints PATCH y DELETE antes de ejecutar la operación;
  devolver 403 si no tiene permiso.
