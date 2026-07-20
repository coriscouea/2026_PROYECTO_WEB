# 008 · Optimización del Backend — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Cuatro optimizaciones sobre el backend existente sin agregar dependencias
externas nuevas — todo usa herramientas ya disponibles en FastAPI y Python.

## Implementación

1. Activar `echo=True` en `database.py` para diagnóstico previo.
2. Agregar `joinedload` en `ticket_repo.py` — listar_tickets y obtener_ticket.
3. Crear `backend/app/repository/categoria_repo.py` con `lru_cache`.
4. Crear `backend/app/routes/categorias.py` con GET /api/v1/categorias.
5. Crear `backend/app/services/notificacion_svc.py` con crear_notificacion.
6. Actualizar `routes/tickets.py` — agregar BackgroundTasks en POST.
7. Registrar router de categorías en `main.py`.
8. Documentar métricas antes/después.

## Decisiones

- **`lru_cache` sobre Redis** — suficiente para datos estáticos en esta etapa.
- **`BackgroundTasks` sobre Celery** — integrado en FastAPI, adecuado para tareas livianas.
- **`joinedload` sobre `selectinload`** — para relaciones muchos-a-uno es más eficiente con JOIN.
- **Diagnóstico con `echo=True`** — permite ver las consultas SQL reales antes de optimizar.

## Riesgos

- **`lru_cache` no se invalida automáticamente** — mitigación: `cache_clear()` explícito al modificar.
- **`BackgroundTasks` se pierde si el servidor cae** — aceptado; Celery lo resuelve en feature 017.
