# 019 · Logging Estructurado

**Estado:** implementado ✅

## Qué hace

Reemplaza los `print()` dispersos en el código por un sistema de logging
estructurado con niveles INFO/WARNING/ERROR usando el módulo `logging`
de Python. Permite diagnosticar problemas sin modificar el código.

## Por qué

Actualmente el único registro de eventos es el `echo=True` de SQLAlchemy
que usamos para diagnóstico. En producción necesitamos logs organizados
que registren eventos importantes sin exponer información sensible.

## Niveles de logging

- **INFO** — operaciones normales: ticket creado, usuario autenticado
- **WARNING** — situaciones anómalas no críticas: intento de acceso denegado, rate limit alcanzado
- **ERROR** — errores inesperados: fallo de BD, excepción no controlada

## Criterios de aceptación

- [X] Configuración centralizada de logging en `backend/app/core/logging_config.py`.
- [X] Formato: `[LEVEL] FECHA HORA - módulo - mensaje`.
- [X] No registrar passwords, tokens ni datos sensibles en logs.
- [X] Los exception handlers globales en `main.py` registran errores con ERROR.
- [X] El middleware de auth registra intentos fallidos con WARNING.
- [X] `echo=True` de SQLAlchemy desactivado en producción — nunca se activó en `database.py`.

## Fuera de alcance

- Logs a archivo o servicio externo (ELK, CloudWatch) — backlog futuro.
