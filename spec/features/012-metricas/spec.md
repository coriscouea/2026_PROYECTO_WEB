# 012 · Métricas Básicas

**Estado:** propuesta

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

- [ ] GET /metricas/resumen devuelve conteo de tickets por cada estado.
- [ ] GET /metricas/por-categoria devuelve lista con nombre de categoría y total.
- [ ] GET /metricas/por-tecnico devuelve lista con nombre del técnico y total asignado.
- [ ] GET /metricas/tiempo-resolucion devuelve promedio en horas de tickets finalizados.
- [ ] Todos los endpoints requieren rol admin.
- [ ] Si no hay datos, devuelven estructuras vacías — no errores.

## Fuera de alcance

- Dashboard con gráficos — frontend (backlog futuro).
- Exportación PDF/Excel — backlog futuro.
- Filtros por fecha o sucursal — backlog futuro.
