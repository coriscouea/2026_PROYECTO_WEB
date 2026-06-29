# roadmap.md — HelpDesk Web

> El orden de las features respeta la progresión académica del proyecto
> (semanas 6 a 16). Cada feature debe completar su spec antes de iniciar
> la implementación.

## Estado

| Símbolo | Significado       |
|---------|-------------------|
| ✅      | Completado        |
| 🔄      | En progreso       |
| ⬜      | Pendiente         |

---

## Fase 0 — Fundamentos (Semanas 3–5) ✅

| Entregable                        | Semana | Estado |
|-----------------------------------|--------|--------|
| Propuesta de aplicación           | 3      | ✅     |
| Diseño de base de datos (taller)  | 4      | ✅     |
| Selección de ORM (foro)           | 5      | ✅     |
| Estructura SDD (spec/)            | 5      | 🔄     |

---

## Fase 1 — Backend base (Semanas 6–8) ⬜

| Feature                          | Carpeta                        | Semana | Estado |
|----------------------------------|--------------------------------|--------|--------|
| Configuración FastAPI + SQLAlchemy | 001-setup-backend            | 6      | ⬜     |
| Autenticación y roles            | 002-autenticacion              | 6      | ⬜     |
| CRUD Usuarios                    | 003-crud-usuarios              | 7      | ⬜     |
| CRUD Tickets                     | 004-crud-tickets               | 7      | ⬜     |
| Bandeja por rol                  | 005-bandeja-rol                | 8      | ⬜     |

---

## Fase 2 — Lógica de negocio (Semanas 9–11) ⬜

| Feature                          | Carpeta                        | Semana | Estado |
|----------------------------------|--------------------------------|--------|--------|
| Historial de estados             | 006-historial-estado           | 9      | ⬜     |
| Comentarios en tickets           | 007-comentarios                | 9      | ⬜     |
| Notificaciones                   | 008-notificaciones             | 10     | ⬜     |
| Métricas básicas                 | 009-metricas                   | 11     | ⬜     |

---

## Fase 3 — Frontend Ionic (Semanas 12–14) ⬜

| Feature                          | Carpeta                        | Semana | Estado |
|----------------------------------|--------------------------------|--------|--------|
| Login y navegación base          | 010-frontend-login             | 12     | ⬜     |
| Pantalla crear ticket            | 011-frontend-crear-ticket      | 12     | ⬜     |
| Pantalla bandeja de tickets      | 012-frontend-bandeja           | 13     | ⬜     |
| Pantalla detalle y seguimiento   | 013-frontend-detalle           | 13     | ⬜     |
| Notificaciones PWA               | 014-frontend-notificaciones    | 14     | ⬜     |

---

## Fase 4 — Cierre (Semanas 15–16) ⬜

| Entregable                       | Semana | Estado |
|----------------------------------|--------|--------|
| Pruebas e integración            | 15     | ⬜     |
| Documentación final y despliegue | 16     | ⬜     |
