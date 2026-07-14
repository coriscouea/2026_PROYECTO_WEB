# 008 · Optimización del Backend — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Se aplican cuatro optimizaciones sobre el backend existente sin agregar
dependencias externas nuevas — todo usa herramientas ya disponibles en
FastAPI y Python estándar. Redis y Celery quedan para la feature 017.

## Implementación

1. **Eager loading en ticket_repo.py**
   Agregar `joinedload` en `listar_tickets` y `obtener_ticket`
   para cargar `categoria`, `solicitante` y `tecnico` en una sola consulta.

2. **Caché cache-aside en repository/categoria_repo.py**
   Crear repositorio de categorías con `functools.lru_cache`
   para cachear resultados por 300 segundos.

3. **BackgroundTasks en routes/tickets.py**
   Al crear un ticket, pasar la notificación como tarea en segundo
   plano usando `BackgroundTasks` de FastAPI.

4. **Servicio de notificación en services/notificacion_svc.py**
   Función que inserta la notificación en la BD — se ejecuta
   en background después de responder al cliente.

5. **Middleware JWT sin consulta BD**
   Verificar que `middleware/auth.py` lee el rol directamente
   del payload JWT — sin `db.query(Usuario)` por request.

6. **Documentar métricas en Postman**
   Capturar tiempo de respuesta antes y después de cada optimización.

## Decisiones

- **`lru_cache` sobre Redis** — suficiente para datos estáticos en
  esta etapa; Redis se agrega en feature 017 cuando el sistema
  escale a múltiples instancias.
- **`BackgroundTasks` sobre Celery** — integrado en FastAPI sin
  dependencias adicionales; adecuado para tareas livianas como
  insertar una notificación en BD.
- **`joinedload` sobre `selectinload`** — para relaciones simples
  (muchos-a-uno) como categoria y usuario, `joinedload` es más
  eficiente porque usa un solo JOIN en lugar de consultas separadas.

## Riesgos

- **`lru_cache` no se invalida automáticamente** — si se agrega una
  categoría nueva, el caché no se actualiza hasta que expire o se
  reinicie el servidor. Mitigación: llamar `cache_clear()` en el
  endpoint de creación de categorías.
- **`BackgroundTasks` se pierde si el servidor cae** — las tareas
  en cola no son persistentes. Mitigación: aceptado en esta etapa;
  Celery con Redis lo resuelve en feature 017.
