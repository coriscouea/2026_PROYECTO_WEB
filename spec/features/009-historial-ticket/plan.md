# 009 · Historial de Eventos del Ticket — Plan

## Enfoque

Se crea una nueva tabla `historial_ticket` (renombrada de `historial_estado`)
con un campo `tipo_evento` ENUM para clasificar cada evento. El registro
se hace automáticamente desde los services existentes usando transacciones
ACID para garantizar consistencia.

## Implementación

1. Crear migración Alembic para renombrar `historial_estado` a `historial_ticket`
   y agregar columna `tipo_evento` y `descripcion`.
2. Actualizar `backend/app/models/historial_estado.py` → renombrar a `historial_ticket.py`.
3. Crear `backend/app/repository/historial_repo.py` con función `registrar_evento`.
4. Crear `backend/app/services/historial_svc.py` con lógica de registro.
5. Actualizar `ticket_svc.py` — llamar historial_svc en crear, actualizar, desactivar.
6. Crear `backend/app/routes/historial.py` con GET /api/v1/tickets/{id}/historial.
7. Registrar router en `main.py`.
8. Probar en Postman.

## Decisiones

- **Transacción ACID** — el registro del evento y la operación principal
  van en la misma transacción; si falla el evento, falla la operación completa.
- **ENUM para tipo_evento** — garantiza valores controlados y facilita filtros futuros.
- **descripcion legible** — texto generado automáticamente por el service,
  no por el cliente, para garantizar consistencia.
- **Renombrar tabla** — más descriptivo que historial_estado ya que ahora
  registra todos los eventos, no solo cambios de estado.

## Riesgos

- **Migración de datos existentes** — los registros actuales en historial_estado
  deben mapearse al nuevo formato. Mitigación: migración cuidadosa con Alembic.
