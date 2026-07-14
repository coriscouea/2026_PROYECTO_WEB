# 008 · Optimización del Backend

**Estado:** propuesta

## Qué hace

Aplica técnicas de optimización sobre los endpoints del backend:
corrige el problema N+1 en el listado de tickets mediante eager loading,
implementa caché cache-aside para datos estáticos (categorías, roles),
configura tareas asíncronas con BackgroundTasks de FastAPI para el
procesamiento de notificaciones, y garantiza que la autenticación JWT
no genere consultas redundantes a la base de datos.

## Por qué

Sin estas optimizaciones, el backend degrada su rendimiento a medida
que crece el volumen de datos. Un listado de 50 tickets sin eager loading
genera más de 150 consultas a MySQL. Los datos estáticos como categorías
y roles se consultan en cada request sin necesidad. Las notificaciones
bloquean la respuesta al usuario si se procesan de forma síncrona.

## Arquitectura por capas

```
[routes/]          ← BackgroundTasks para notificaciones asíncronas
        ↓
[services/]        ← lógica de negocio sin cambios
        ↓
[repository/]      ← joinedload para eager loading, lru_cache para caché
        ↓
[middleware/auth]  ← JWT sin consulta adicional a BD por request
```

## Técnicas aplicadas

### 1. Corrección N+1 — Eager Loading

**Problema:** `listar_tickets` sin eager loading genera una consulta
por cada relación accedida (categoria, solicitante, tecnico).

```
# Sin optimización — 50 tickets = ~150 consultas
GET /api/v1/tickets → 1 consulta tickets
                    + 50 consultas categoria
                    + 50 consultas solicitante
                    + 50 consultas tecnico
                    = 151 consultas
```

**Solución:** `joinedload` carga todas las relaciones en una sola
consulta con JOIN.

```
# Con eager loading — 50 tickets = 1 consulta
GET /api/v1/tickets → 1 consulta con JOIN
```

### 2. Justificación Lazy vs Eager Loading

| Relación | Estrategia | Justificación |
|---|---|---|
| `Ticket.categoria` | **Eager** | Siempre visible en el listado — cargarla aparte sería N+1 |
| `Ticket.solicitante` | **Eager** | Siempre se necesita el nombre en la bandeja |
| `Ticket.tecnico` | **Eager** | Se muestra en el detalle y bandeja |
| `Ticket.comentarios` | **Lazy** | Solo se cargan en pantalla de detalle, no en listado |
| `Ticket.historial` | **Lazy** | Solo cuando el usuario consulta el historial específico |

Regla aplicada: **eager** cuando la relación siempre se necesita;
**lazy** cuando solo se necesita en casos específicos.

### 3. Caché Cache-Aside

**Estrategia:** el backend primero busca en caché; si no encuentra
(cache miss), consulta la BD y guarda el resultado en caché.
Si encuentra (cache hit), devuelve el resultado sin tocar la BD.

**Candidatos:**
- `GET /api/v1/categorias` — datos fijos (Técnica, Redes, ERP)
- `GET /api/v1/roles` — datos fijos (usuario, tecnico, mesa_ayuda, admin)
- `GET /api/v1/tickets/{id}` — detalle de un ticket específico

**Implementación:** `functools.lru_cache` en Python — caché en memoria
sin dependencias externas (Redis queda para versión futura).

**Tiempo de vida:** 300 segundos (5 minutos).

**Invalidación explícita:** al actualizar o desactivar un recurso,
se llama `cache_clear()` para eliminar el caché inmediatamente.
Sin invalidación explícita, el cliente podría recibir datos desactualizados
hasta que expire el TTL.

```
# Flujo cache-aside completo
GET /api/v1/categorias
  → busca en caché → cache hit → devuelve sin consultar BD
  → busca en caché → cache miss → consulta BD → guarda en caché → devuelve

# Invalidación al actualizar
PATCH /api/v1/tickets/{id}
  → actualiza en BD
  → llama cache_clear() para eliminar el caché del ticket
  → próxima consulta hará cache miss y cargará datos frescos
```

### 4. Tareas Asíncronas — BackgroundTasks

**Problema:** procesar notificaciones de forma síncrona bloquea la
respuesta al usuario mientras se inserta en la BD.

**Solución:** `BackgroundTasks` de FastAPI ejecuta la notificación
en segundo plano — el endpoint responde inmediatamente al cliente
y la notificación se procesa después.

```
POST /api/v1/tickets
  → crea ticket (síncrono)
  → responde 201 al cliente (inmediato)
  → procesa notificación en background (asíncrono)
```

### 5. Autenticación sin consultas redundantes

El rol del usuario viaja en el payload del JWT — el middleware de
autorización lo lee directamente del token sin consultar la base
de datos en cada solicitud protegida.

```
# Sin optimización (sesiones de servidor)
Cada request → consulta BD para verificar sesión

# Con JWT optimizado
Cada request → verifica firma JWT (criptografía, sin BD)
             → lee rol del payload
             → autoriza o rechaza
```

Adicionalmente, el objeto usuario autenticado se reutiliza durante
todo el ciclo de la solicitud — no se recarga desde la BD en cada
capa del backend. Como indica la presentación del profesor (1.4.18):
*"Una autenticación mal diseñada puede ser, por sí sola, el principal
cuello de botella del backend."*

### 6. Diagnóstico previo — medir antes de optimizar

Antes de aplicar cualquier optimización se registran métricas base:

- Tiempo de respuesta de `GET /api/v1/tickets` sin eager loading
- Número de consultas SQL generadas por el listado
- Tiempo de respuesta de `GET /api/v1/categorias` sin caché
- Tiempo de respuesta de `POST /api/v1/tickets` con notificación síncrona

Estas métricas se capturan en Postman y sirven como línea base para
la comparación antes/después que exige el taller.

## Criterios de aceptación

- [ ] Se registran métricas base ANTES de aplicar optimizaciones (tiempos en Postman).
- [ ] `GET /api/v1/tickets` usa `joinedload` para categoria, solicitante y tecnico.
- [ ] El número de consultas SQL en el listado es 1 independientemente del número de tickets.
- [ ] `GET /api/v1/categorias` devuelve resultado desde caché en la segunda llamada.
- [ ] Al actualizar un ticket, el caché se invalida explícitamente con `cache_clear()`.
- [ ] `GET /api/v1/tickets/{id}` usa caché con invalidación explícita al actualizar.
- [ ] `POST /api/v1/tickets` responde 201 antes de que la notificación se procese.
- [ ] La notificación se inserta en BD después de que el cliente recibe la respuesta.
- [ ] El middleware JWT no genera ninguna consulta adicional a la BD por request.
- [ ] El usuario autenticado se reutiliza en todo el ciclo de la solicitud sin recargarse.
- [ ] Se documentan métricas antes y después con capturas de Postman.

## Comparación antes vs después

| Métrica | Antes | Después |
|---|---|---|
| Consultas SQL en `GET /tickets` (50 registros) | ~151 | 1 |
| Tiempo de respuesta `GET /categorias` (2da llamada) | ~50ms | <1ms |
| Tiempo de respuesta `POST /tickets` con notificación | ~200ms | ~50ms |
| Consultas BD por request autenticado | 1 extra (sesión) | 0 (JWT) |

## Fuera de alcance

- Redis para caché distribuida (→ feature 017).
- Celery para colas de trabajo persistentes (→ feature 017).
- Compresión gzip de respuestas (→ feature 017).
- Profiling avanzado con herramientas externas (→ backlog futuro).
