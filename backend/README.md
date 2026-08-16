# HelpDesk Web — Backend

Sistema de gestión de soporte técnico. API REST construida con FastAPI y Python.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Python | 3.11+ | Lenguaje |
| FastAPI | 0.115+ | Framework web async |
| SQLAlchemy | 2.0 | ORM con eager loading |
| Alembic | 1.13+ | Migraciones de BD |
| MySQL | 8.0 | Base de datos |
| python-jose | — | JWT HS256 |
| passlib + bcrypt | — | Hash de contraseñas |
| slowapi | — | Rate limiting por IP |
| pydantic-settings | — | Config centralizada |
| uvicorn | — | Servidor ASGI |

---

## Estructura

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Configuración centralizada (pydantic-settings)
│   │   ├── security.py        # Hash bcrypt, verificación
│   │   ├── limiter.py         # Rate limiting con slowapi
│   │   └── logging_config.py  # Configuración de logging
│   ├── models/
│   │   ├── roles.py
│   │   ├── sucursales.py
│   │   ├── categorias.py
│   │   ├── usuario.py
│   │   ├── tickets.py
│   │   ├── comentarios.py
│   │   ├── historial_ticket.py
│   │   ├── notificaciones.py
│   │   └── solicitudes_reset.py
│   ├── schemas/
│   │   ├── ticket.py
│   │   ├── usuario.py
│   │   ├── historial.py
│   │   ├── comentario.py
│   │   └── response.py
│   ├── repository/
│   │   ├── ticket_repo.py
│   │   ├── usuario_repo.py
│   │   ├── historial_repo.py
│   │   ├── comentario_repo.py
│   │   ├── notificacion_repo.py
│   │   ├── categoria_repo.py
│   │   ├── metricas_repo.py
│   │   └── solicitud_reset_repo.py
│   ├── services/
│   │   ├── ticket_svc.py
│   │   ├── usuario_svc.py
│   │   ├── auth_svc.py
│   │   ├── historial_svc.py
│   │   ├── comentario_svc.py
│   │   ├── notificacion_svc.py
│   │   └── metricas_svc.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── tickets.py
│   │   ├── usuarios.py
│   │   ├── historial.py
│   │   ├── comentarios.py
│   │   ├── notificaciones.py
│   │   ├── metricas.py
│   │   ├── categorias.py
│   │   └── solicitudes.py
│   ├── middleware/
│   │   └── auth.py            # get_current_user, require_roles
│   ├── database.py            # SessionLocal, get_db
│   └── main.py                # FastAPI app, CORS, lifespan, routers
├── alembic/                   # Migraciones
├── requirements.txt
└── .env                       # Variables de entorno (no se sube a Git)
```

---

## Instalación

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

---

## Variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=helpdesk_web
DB_USER=root
DB_PASSWORD=tu_password

JWT_SECRET_KEY=tu_clave_secreta_muy_larga
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=1

CORS_ORIGINS=http://localhost:8100,http://localhost:8080,http://localhost:8081,http://192.168.1.12:8080,http://192.168.1.12:8081,http://10.0.2.2:8081
```

---

## Base de datos

```bash
# Aplicar migraciones
alembic upgrade head

# Crear nueva migración
alembic revision --autogenerate -m "descripcion"

# Revertir última migración
alembic downgrade -1
```

### Tablas

| Tabla | Descripción |
|---|---|
| roles | 4 roles: usuario, tecnico, mesa_ayuda, admin |
| sucursales | Sucursales de la empresa |
| categorias | Técnica, Redes, ERP |
| usuarios | Empleados con rol y sucursal |
| tickets | Requerimientos de soporte |
| comentarios | Comentarios anidados bajo ticket |
| historial_ticket | 6 tipos de evento por ticket |
| notificaciones | Avisos por usuario y ticket |
| solicitudes_reset | Solicitudes de restablecimiento de contraseña |

---

## Ejecutar el servidor

```bash
# Desarrollo con recarga automática
uvicorn app.main:app --reload

# Producción / acceso desde red local (Android, otros dispositivos)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Endpoints

### Autenticación (públicos)

| Método | Ruta | Descripción |
|---|---|---|
| POST | /auth/registro | Registrar usuario (rol usuario por defecto) |
| POST | /auth/login | Iniciar sesión — devuelve access + refresh token |
| POST | /auth/refresh | Renovar access token |
| GET | /auth/me | Perfil del usuario autenticado (cualquier rol) |
| POST | /auth/solicitar-reset | Solicitar reset de contraseña (rate limit 3/min) |

### Tickets (autenticados)

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/v1/tickets | Crear ticket |
| GET | /api/v1/tickets?filtro=activos | Listar tickets (filtro por rol) |
| GET | /api/v1/tickets/{id} | Obtener ticket |
| PATCH | /api/v1/tickets/{id} | Actualizar ticket |
| DELETE | /api/v1/tickets/{id} | Soft delete (activo=false) |
| GET | /api/v1/tickets/{id}/historial | Historial de eventos |
| POST | /api/v1/tickets/{id}/comentarios | Agregar comentario |
| GET | /api/v1/tickets/{id}/comentarios | Listar comentarios |

### Usuarios (solo admin)

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/v1/usuarios | Crear usuario |
| GET | /api/v1/usuarios | Listar usuarios activos |
| GET | /api/v1/usuarios/{id} | Obtener usuario |
| PATCH | /api/v1/usuarios/{id} | Actualizar (nombre, rol, password) |
| DELETE | /api/v1/usuarios/{id} | Soft delete |

### Notificaciones (autenticados)

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/v1/notificaciones | Listar notificaciones del usuario |
| GET | /api/v1/notificaciones/no-leidas | Solo no leídas |
| GET | /api/v1/notificaciones/conteo | Conteo de no leídas |
| PATCH | /api/v1/notificaciones/{id}/leer | Marcar una como leída |
| PATCH | /api/v1/notificaciones/leer-todas | Marcar todas como leídas |

### Métricas (solo admin)

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/v1/metricas/resumen | Tickets por estado |
| GET | /api/v1/metricas/por-categoria | Tickets por categoría |
| GET | /api/v1/metricas/por-tecnico | Tickets por técnico |
| GET | /api/v1/metricas/tiempo-resolucion | Tiempo promedio de resolución |

### Solicitudes de reset (solo admin)

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/v1/solicitudes | Listar solicitudes pendientes |
| PATCH | /api/v1/solicitudes/{id}/atender | Marcar como atendida |

---

## RBAC — Control de acceso por roles

| Rol | Acceso |
|---|---|
| usuario | Sus propios tickets, notificaciones |
| tecnico | Tickets de categoría Técnica y Redes |
| mesa_ayuda | Tickets de categoría ERP |
| admin | Todo el sistema + gestión usuarios + métricas |

---

## Credenciales de prueba

| Email | Password | Rol |
|---|---|---|
| admin2@empresa.com | admin12345 | admin |
| tecnico@empresa.com | 12345678 | tecnico |
| prueba@empresa.com | 12345678 | mesa_ayuda |
| testfinal@empresa.com | 12345678 | usuario |

---

## Bugs corregidos

1. Escalada de privilegios en `/auth/registro` — siempre fuerza `id_rol = usuario`
2. IDOR en tickets — filtro por rol en SQL antes de paginar
3. RBAC en PATCH — técnico solo modifica tickets de su categoría
4. Sanitización XSS con bleach en ticket_svc, usuario_svc, comentario_svc
5. Atomicidad historial: `db.flush()` en repos + `db.commit()` único en service
6. Rate limiting en `/auth/solicitar-reset` — `@limiter.limit("3/minute")`
7. Tabla `solicitudes_reset` separada para evitar FK NOT NULL de `id_ticket`
