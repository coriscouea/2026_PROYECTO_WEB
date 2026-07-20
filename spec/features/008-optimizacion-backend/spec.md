# 008 · Optimización del Backend

**Estado:** implementado ✅

## Qué hace

Aplica técnicas de optimización sobre los endpoints del backend:
corrige el problema N+1 en el listado de tickets mediante eager loading,
implementa caché cache-aside para categorías, configura tareas asíncronas
con BackgroundTasks para notificaciones, y garantiza que la autenticación
JWT no genere consultas redundantes a la base de datos.

## Por qué

Sin estas optimizaciones el backend degrada su rendimiento a medida que
crece el volumen de datos. Un listado de 3 tickets sin eager loading
ya genera 4 consultas a MySQL. Los datos estáticos como categorías se
consultan en cada request sin necesidad. Las notificaciones bloquean
la respuesta al usuario si se procesan síncronamente.

## Técnicas aplicadas

### 1. Diagnóstico previo — medir antes de optimizar

Se activó `echo=True` en SQLAlchemy para visualizar todas las consultas
SQL en la terminal. Esto permitió confirmar el problema N+1 antes de
aplicar la corrección.

**Comportamiento antes (sin joinedload):**
```
GET /api/v1/tickets con 3 tickets:
  SELECT tickets... WHERE activo = true        ← 1 consulta principal
  SELECT categorias... WHERE pk_1 = 1          ← extra por ticket 1
  SELECT categorias... WHERE pk_1 = 3          ← extra por ticket 2
  SELECT categorias... WHERE pk_1 = 2          ← extra por ticket 3
  Total: 4 consultas
```

### 2. Corrección N+1 — Eager Loading

**Después (con joinedload):**
```
GET /api/v1/tickets con 3 tickets:
  SELECT tickets LEFT OUTER JOIN categorias
                LEFT OUTER JOIN usuarios (solicitante)
                LEFT OUTER JOIN usuarios (tecnico)
  Total: 1 consulta
```

### 3. Justificación Lazy vs Eager Loading

| Relación | Estrategia | Justificación |
|---|---|---|
| `Ticket.categoria` | **Eager** | Siempre visible en el listado |
| `Ticket.solicitante` | **Eager** | Siempre se necesita en la bandeja |
| `Ticket.tecnico` | **Eager** | Se muestra en detalle y bandeja |
| `Ticket.comentarios` | **Lazy** | Solo en pantalla de detalle |
| `Ticket.historial` | **Lazy** | Solo cuando se consulta historial específico |

### 4. Caché Cache-Aside

**Estrategia:** buscar en caché primero (cache hit) → devolver sin consultar BD; si no hay datos (cache miss) → consultar BD, guardar en caché, devolver.

**Candidatos:** `GET /api/v1/categorias` — datos fijos (Técnica, Redes, ERP).

**Implementación:** `functools.lru_cache` — caché en memoria sin dependencias externas.

**Tiempo de vida:** 300 segundos.

**Invalidación explícita:** `cache_clear()` al crear o modificar una categoría.

```
Primera llamada  → cache miss → consulta BD → guarda en caché
Segunda llamada  → cache hit  → respuesta desde memoria (0 consultas SQL)
```

### 5. Tareas Asíncronas — BackgroundTasks

```
POST /api/v1/tickets
  → crea ticket (síncrono)
  → responde 201 al cliente (inmediato)
  → procesa notificación en background (asíncrono)
```

### 6. Autenticación sin consultas redundantes

```
# Con JWT optimizado (diseñado para semana 9)
Cada request → verifica firma JWT en memoria (criptografía, sin BD)
             → lee rol del payload
             → autoriza o rechaza
```

## Criterios de aceptación

- [x] Se registraron métricas base ANTES de aplicar optimizaciones.
- [x] `GET /api/v1/tickets` genera 1 sola consulta SQL con JOIN.
- [x] `GET /api/v1/categorias` devuelve desde caché en la segunda llamada.
- [x] Invalidación explícita documentada con `cache_clear()`.
- [x] `POST /api/v1/tickets` responde 201 antes de procesar la notificación.
- [x] Notificación insertada en tabla `notificaciones` en phpMyAdmin.
- [x] Middleware JWT diseñado para no generar consultas redundantes (implementación semana 9).

## Comparación antes vs después

| Métrica | Antes | Después |
|---|---|---|
| Consultas SQL GET /tickets (3 registros) | 4 consultas | 1 consulta con JOIN |
| GET /api/v1/categorias (2da llamada) | Consulta BD | 0 consultas (caché) |
| POST /api/v1/tickets con notificación | Síncrono | Asíncrono — 201 inmediato |
| Consultas BD por request autenticado | 1 extra por sesión | 0 — JWT local |

## Fuera de alcance

- Redis para caché distribuida (→ feature 017).
- Celery para colas persistentes (→ feature 017).
- Implementación completa JWT (→ feature 007, semana 9).
