# 012 · Métricas Básicas — Plan

## Enfoque

4 endpoints de solo lectura bajo `/api/v1/metricas/`. Las consultas
usan `func.count`, `func.avg` y `func.timestampdiff` de SQLAlchemy
para calcular los indicadores directamente en MySQL — sin cargar
todos los registros en Python.

## Implementación

1. Crear `backend/app/repository/metricas_repo.py` con las 4 consultas.
2. Crear `backend/app/services/metricas_svc.py` — delega al repositorio.
3. Crear `backend/app/routes/metricas.py` — 4 endpoints protegidos con rol admin.
4. Registrar router en `main.py`.
5. Probar en Postman.

## Decisiones

- **Solo admin** — las métricas exponen información global del sistema
  que no debe estar disponible para roles estándar.
- **Cálculo en SQL** — más eficiente que cargar todos los tickets
  en Python y calcular ahí; MySQL hace el trabajo pesado.
- **Sin caché por ahora** — los datos cambian con cada ticket;
  caché con TTL corto se agrega en feature 017 con Redis.
