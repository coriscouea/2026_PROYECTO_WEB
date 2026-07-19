# HelpDesk Web

Sistema de gestión de soporte técnico para empresas con múltiples sucursales en Ecuador. Reemplaza los canales informales de comunicación (correo, WhatsApp, verbal) por un sistema centralizado de tickets accesible desde cualquier dispositivo móvil como PWA.

---

## Descripción del proyecto

HelpDesk Web permite a los empleados registrar requerimientos técnicos clasificados por categoría (Técnica, Redes, ERP), hacer seguimiento del estado de cada caso y garantizar trazabilidad completa del historial de atención. Los técnicos y el personal de mesa de ayuda atienden los tickets desde una bandeja compartida por rol.

**Problema que resuelve:** los requerimientos técnicos se gestionaban de forma informal y sin trazabilidad — correos perdidos, mensajes de WhatsApp sin seguimiento, solicitudes verbales olvidadas.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Ionic + Capacitor (PWA) |
| Backend | Python + FastAPI |
| ORM | SQLAlchemy 2.0 + Alembic |
| Base de datos | MySQL 8 (InnoDB) |
| Autenticación | JWT (python) |
| Patrón | MVVM |
| Metodología | SDD (Spec-Driven Development) |

---

## Metodología — Spec-Driven Development (SDD)

Este proyecto aplica **SDD**: toda feature se especifica completamente antes de escribir código. La carpeta `spec/` contiene la fuente de verdad del proyecto.

```
spec/
├── constitution/          ← reglas estables del proyecto
│   ├── mission.md         ← propósito, usuarios y principios
│   ├── tech-stack.md      ← tecnologías, convenciones y límites
│   └── roadmap.md         ← estado de todas las features
└── features/              ← una carpeta por feature
    ├── 004-setup-backend/
    ├── 005-crud-tickets/
    ├── 006-crud-usuarios/
    ├── 007-autenticacion/
    └── 008-optimizacion-backend/
```

Cada feature contiene:
- `spec.md`     — qué hace y criterios de aceptación
- `plan.md`     — cómo se implementa y decisiones técnicas
- `tasks.md`    — checklist accionable de implementación

---

## Estructura del backend

```
backend/
├── app/
│   ├── models/             ← 8 entidades SQLAlchemy
│   ├── schemas/            ← validación Pydantic (entrada/salida)
│   ├── repository/         ← acceso a datos (solo SQLAlchemy)
│   ├── services/           ← lógica de negocio y reglas de dominio
│   ├── routes/             ← endpoints FastAPI
│   ├── middleware/         ← autenticación JWT
│   ├── core/               ← seguridad (hash, tokens)
│   ├── database.py         ← conexión SQLAlchemy
│   └── main.py             ← punto de entrada FastAPI
├── alembic/                ← migraciones de base de datos
├── requirements.txt
└── .env.
```

---

## Modelo de datos

8 entidades normalizadas con índices estratégicos:

| Entidad | Descripción |
|---|---|
| Usuario | Empleados del sistema con rol asignado |
| Roles | usuario, tecnico, mesa_ayuda, admin |
| Sucursales | Sedes de la empresa |
| Categorías | Técnica, Redes, ERP |
| Tickets | Requerimientos técnicos (entidad principal) |
| Comentarios | Seguimiento de cada ticket |
| Historial_Estado | Trazabilidad de cambios de estado |
| Notificaciones | Avisos automáticos por cambio o asignación |

---

## Endpoints implementados

### Tickets
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/tickets` | Crear ticket |
| GET | `/api/v1/tickets` | Listar con paginación |
| GET | `/api/v1/tickets/{id}` | Detalle de un ticket |
| PATCH | `/api/v1/tickets/{id}` | Actualizar parcialmente |
| DELETE | `/api/v1/tickets/{id}` | Soft delete |

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/usuarios` | Crear usuario |
| GET | `/api/v1/usuarios` | Listar con paginación |
| GET | `/api/v1/usuarios/{id}` | Detalle de un usuario |
| PATCH | `/api/v1/usuarios/{id}` | Actualizar parcialmente |
| DELETE | `/api/v1/usuarios/{id}` | Soft delete |

### Catálogos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/categorias` | Listar categorías (con caché) |

Documentación interactiva disponible en: `http://localhost:8000/docs`

---

## Optimizaciones implementadas (Semana 8)

- **Eager loading** — `joinedload` en SQLAlchemy para prevenir el problema N+1 en el listado de tickets
- **Caché cache-aside** — `functools.lru_cache` para datos estáticos (categorías) con invalidación explícita
- **BackgroundTasks** — notificaciones procesadas en segundo plano sin bloquear la respuesta al cliente
- **JWT sin consultas redundantes** — el rol del usuario viaja en el payload del token; el middleware no consulta la BD en cada request

---

## Reglas de negocio principales

1. El email de cada usuario debe ser único en el sistema
2. Cada ticket se clasifica en una única categoría (Técnica, Redes o ERP)
3. Los tickets no se eliminan físicamente — solo cambian de estado o se desactivan
4. Los usuarios no se eliminan físicamente — solo se desactivan con `activo=FALSE`
5. La transición de estados es estricta: `pendiente → en_proceso → finalizado`
6. El rol por defecto al registrarse es siempre `usuario`
7. Solo técnico, mesa de ayuda o admin pueden cambiar el estado de un ticket

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/coriscouea/2026_PROYECTO_WEB.git

# 2. Crear entorno virtual
cd backend
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env
# Editar .env con tus credenciales de MySQL

# 5. Aplicar migraciones
alembic upgrade head

# 6. Levantar el servidor
uvicorn app.main:app --reload
```

---

## Autor

**Cesar Risco** — Universidad Estatal Amazónica (UEA)  
Aplicaciones Móviles — 5to Semestre — 2026