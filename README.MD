# HelpDesk Web

Sistema de gestión de tickets de soporte técnico para empresas con múltiples sucursales en Ecuador. Reemplaza los canales informales (correo, WhatsApp, verbal) por un sistema centralizado accesible desde cualquier dispositivo móvil como PWA.

---

## Descripción del proyecto

HelpDesk Web permite a los empleados registrar requerimientos técnicos clasificados por categoría (Técnica, Redes, ERP), hacer seguimiento del estado de cada caso y garantizar trazabilidad completa. Los técnicos y mesa de ayuda atienden tickets desde una bandeja compartida por rol.

**Problema que resuelve:** requerimientos técnicos gestionados de forma informal — correos perdidos, WhatsApp sin seguimiento, solicitudes verbales olvidadas.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Ionic + Capacitor (PWA) |
| Backend | Python + FastAPI |
| ORM | SQLAlchemy 2.0 + Alembic |
| Base de datos | MySQL 8 (InnoDB) |
| Autenticación | JWT — python-jose (semana 9) |
| Patrón | MVVM |
| Metodología | SDD (Spec-Driven Development) |

---

## Metodología — Spec-Driven Development (SDD)

Este proyecto aplica **SDD**: toda feature se especifica completamente antes de escribir código.

```
spec/
├── constitution/
│   ├── mission.md         ← propósito, usuarios y principios
│   ├── tech-stack.md      ← tecnologías, convenciones y límites
│   └── roadmap.md         ← estado de todas las features
└── features/
    ├── 004-setup-backend/        ✅
    ├── 005-crud-tickets/         ✅
    ├── 006-crud-usuarios/        ✅
    ├── 007-autenticacion/        🔜 semana 9
    └── 008-optimizacion-backend/ ✅
```

Cada feature contiene `spec.md`, `plan.md` y `tasks.md`.

---

## Estructura del backend

```
backend/
├── app/
│   ├── models/        ← 8 entidades SQLAlchemy
│   ├── schemas/       ← validación Pydantic
│   ├── repository/    ← acceso a datos con joinedload y lru_cache
│   ├── services/      ← lógica de negocio
│   ├── routes/        ← endpoints FastAPI
│   ├── middleware/    ← autenticación JWT (semana 9)
│   ├── database.py
│   └── main.py
├── alembic/
└── requirements.txt
```

---

## Endpoints implementados

### Tickets (`/api/v1/tickets`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/tickets` | Crear ticket |
| GET | `/api/v1/tickets` | Listar con paginación |
| GET | `/api/v1/tickets/{id}` | Detalle |
| PATCH | `/api/v1/tickets/{id}` | Actualizar parcialmente |
| DELETE | `/api/v1/tickets/{id}` | Soft delete |

### Usuarios (`/api/v1/usuarios`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/usuarios` | Crear usuario |
| GET | `/api/v1/usuarios` | Listar con paginación |
| GET | `/api/v1/usuarios/{id}` | Detalle |
| PATCH | `/api/v1/usuarios/{id}` | Actualizar parcialmente |
| DELETE | `/api/v1/usuarios/{id}` | Soft delete |

### Catálogos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/categorias` | Listar categorías (con caché) |

Documentación interactiva: `http://localhost:8000/docs`

---

## Optimizaciones implementadas (Semana 8)

- **Eager loading** — `joinedload` previene N+1: de 4 consultas a 1 en el listado de tickets
- **Caché cache-aside** — `lru_cache` para categorías: 2da llamada = 0 consultas SQL
- **BackgroundTasks** — notificaciones asíncronas: respuesta 201 inmediata al cliente
- **JWT sin redundancia** — rol en payload del token: 0 consultas BD por request autenticado

---

## Reglas de negocio principales

1. Email único por usuario — 409 si ya existe
2. Cada ticket tiene una sola categoría (Técnica, Redes o ERP)
3. Tickets no se eliminan físicamente — solo `activo=FALSE`
4. Usuarios no se eliminan físicamente — solo `activo=FALSE`
5. Transición de estados estricta: `pendiente → en_proceso → finalizado`
6. Rol por defecto al registrarse: `usuario`
7. Solo técnico, mesa de ayuda o admin pueden cambiar estado de un ticket

---

## Instalación local

```bash
git clone https://github.com/coriscouea/2026_PROYECTO_WEB.git
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# Editar .env con credenciales MySQL
alembic upgrade head
uvicorn app.main:app --reload
```

---

## Autor

**Cesar Risco** — Universidad Estatal Amazónica (UEA)
Aplicaciones Móviles — 5to Semestre — 2026
