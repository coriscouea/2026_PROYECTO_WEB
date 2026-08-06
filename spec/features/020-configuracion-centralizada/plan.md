# 020 · Configuración Centralizada — Plan

## Enfoque

Instalar `pydantic-settings` y crear `core/config.py` con clase `Settings`.
Luego reemplazar todos los `os.getenv()` en el proyecto apuntando a
`settings.*` importado desde un solo lugar.

## Implementación

1. Instalar `pydantic-settings` y actualizar `requirements.txt`.
2. Crear `backend/app/core/config.py` con clase `Settings`.
3. Actualizar `database.py` — reemplazar `os.getenv()` con `settings.*`.
4. Actualizar `core/security.py` — reemplazar `os.getenv()` con `settings.*`.
5. Actualizar `main.py` — reemplazar `os.getenv()` con `settings.*`.
6. Verificar que el servidor arranca correctamente.

## Decisiones

- **`pydantic-settings`** — extiende Pydantic v2 para leer `.env` automáticamente.
- **Instancia global `settings`** — se importa desde cualquier módulo sin
  reinstanciar la clase en cada archivo.
