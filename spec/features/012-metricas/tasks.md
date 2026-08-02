# 012 · Métricas Básicas — Tareas

## Repositorio
- [ ] Crear `backend/app/repository/metricas_repo.py` con:
  - [ ] `total_por_estado(db)` — cuenta tickets por estado
  - [ ] `total_por_categoria(db)` — cuenta tickets por categoría
  - [ ] `total_por_tecnico(db)` — cuenta tickets por técnico asignado
  - [ ] `tiempo_promedio_resolucion(db)` — promedio en horas de tickets finalizados

## Servicio
- [ ] Crear `backend/app/services/metricas_svc.py` con las 4 funciones.

## Endpoints
- [ ] Crear `backend/app/routes/metricas.py` con:
  - [ ] GET /api/v1/metricas/resumen
  - [ ] GET /api/v1/metricas/por-categoria
  - [ ] GET /api/v1/metricas/por-tecnico
  - [ ] GET /api/v1/metricas/tiempo-resolucion
- [ ] Registrar router en `main.py`.

## Pruebas en Postman
- [ ] GET /metricas/resumen con token admin → conteo por estado.
- [ ] GET /metricas/por-categoria con token admin → lista por categoría.
- [ ] GET /metricas/por-tecnico con token admin → lista por técnico.
- [ ] GET /metricas/tiempo-resolucion con token admin → promedio en horas.
- [ ] Cualquier endpoint con rol usuario → 403.

## Cierre
- [ ] Mover a "Hecho" en roadmap.
