# 012 · Métricas Básicas

**Estado:** implementado ✅

## Qué hace

Expone endpoints que calculan indicadores clave del sistema directamente
desde la API. El frontend solo consume y muestra — nunca calcula.

## Por qué

Sin métricas el administrador no puede tomar decisiones informadas:
no sabe cuántos tickets están abiertos, cuál categoría tiene más carga
ni cuánto tarda en promedio resolver un requerimiento.

## Endpoints

| Método | Ruta | Qué devuelve | Quién |
|---|---|---|---|
| GET | `/api/v1/metricas/resumen` | Totales por estado (pendiente, en_proceso, finalizado) | admin |
| GET | `/api/v1/metricas/por-categoria` | Tickets agrupados por categoría | admin |
| GET | `/api/v1/metricas/por-tecnico` | Tickets agrupados por técnico asignado | admin |
| GET | `/api/v1/metricas/tiempo-resolucion` | Tiempo promedio de resolución en horas | admin |

## Criterios de aceptación

- [X] GET /metricas/resumen devuelve conteo de tickets por cada estado.
- [X] GET /metricas/por-categoria devuelve lista con nombre de categoría y total.
- [X] GET /metricas/por-tecnico devuelve lista con nombre del técnico y total asignado.
- [X] GET /metricas/tiempo-resolucion devuelve promedio en horas de tickets finalizados.
- [X] Todos los endpoints requieren rol admin.
- [X] Si no hay datos, devuelven estructuras vacías — no errores.

## Corrección aplicada en revisión

`metricas_repo.py` filtraba `Ticket.estado == True` en `total_por_estado`, `total_por_categoria` y `total_por_tecnico` (copiado por error del patrón `activo == True`). Al ser `estado` un ENUM de string, la comparación contra un booleano devolvía solo un subconjunto incorrecto de tickets. Corregido a `Ticket.activo == True` en los tres — ahora los tres criterios de conteo son correctos.

## Fuera de alcance

- Dashboard con gráficos — frontend (backlog futuro).
- Exportación PDF/Excel — backlog futuro.
- Filtros por fecha o sucursal — backlog futuro.
