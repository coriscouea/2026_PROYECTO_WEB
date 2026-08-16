# HelpDesk Web

Sistema de gestión de soporte técnico multiplataforma desarrollado como proyecto integrador de la materia Aplicaciones Móviles — 5to Semestre, Universidad Estatal Amazónica 2026.

**Estudiante:** César Risco  
**Materia:** Aplicaciones Móviles  
**Metodología:** SDD (Spec-Driven Development)

---

## ¿Qué es HelpDesk Web?

HelpDesk Web centraliza los requerimientos de soporte técnico de una empresa con múltiples sucursales, reemplazando canales informales (correo, WhatsApp) por un sistema estructurado de tickets con trazabilidad completa, accesible desde Android, iOS y navegador web (PWA).

### Servicios que gestiona

- 📊 ERP Dobra — instalación, errores, mejoras
- 🔧 Soporte técnico — equipos, impresoras, periféricos
- 🌐 Redes — conectividad, navegación, configuración
- 🔄 Actualizaciones de software

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Python + FastAPI | 3.11+ |
| ORM | SQLAlchemy | 2.0 |
| Migraciones | Alembic | 1.13+ |
| Base de datos | MySQL | 8.0 |
| Autenticación | JWT (python-jose HS256) | — |
| Frontend | Ionic + Capacitor + Angular | 8.8.17 / 8.5.0 / 20.x |
| CLI Ionic | Ionic CLI | 7.2.1 |
| HTTP Client | Axios | — |
| Almacenamiento | @capacitor/preferences | — |
| Node.js | — | v24.14.0 |
| npm | — | 11.9.0 |

---

## Estructura del proyecto

```
2026_PROYECTO_WEB/
├── backend/                    # API REST con FastAPI
│   ├── app/
│   │   ├── core/               # Config, security, logging, rate limiting
│   │   ├── models/             # 10 modelos SQLAlchemy
│   │   ├── schemas/            # Validación Pydantic
│   │   ├── repository/         # Acceso a datos
│   │   ├── services/           # Lógica de negocio
│   │   ├── routes/             # Endpoints REST
│   │   ├── middleware/         # Auth, RBAC
│   │   └── main.py             # Aplicación FastAPI
│   ├── alembic/                # Migraciones de BD
│   └── README.md               # Documentación backend
├── frontend/                   # PWA con Ionic + Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/          # 9 pantallas
│   │   │   ├── services/       # 5 servicios
│   │   │   └── guards/         # Guard de autenticación
│   │   └── environments/       # Variables por entorno
│   └── README.md               # Documentación frontend
├── spec/                       # Especificaciones SDD
│   ├── constitution/           # Misión, stack, roadmap
│   └── features/               # Spec de cada feature
├── iniciar_helpdesk.bat        # Arranque automático
└── README.md                   # Este archivo
```

---

## Instalación y configuración

### Requisitos previos

- Python 3.11+
- Node.js v24.14.0 LTS
- MySQL 8.0
- npm 11.9.0
- Ionic CLI 7.2.1

```bash
# Instalar Ionic CLI globalmente
npm install -g @ionic/cli
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Crea `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=helpdesk_web
DB_USER=root
DB_PASSWORD=tu_password
JWT_SECRET_KEY=tu_clave_secreta
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=1
CORS_ORIGINS=http://localhost:8100,http://localhost:8081,http://192.168.1.12:8081,http://10.0.2.2:8081
```

```bash
# Aplicar migraciones
alembic upgrade head

# Levantar servidor desarrollo
uvicorn app.main:app --reload

# Levantar servidor producción (acceso desde red local)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Desarrollo
ionic serve

# Verificar entorno
ionic info

# Build producción
ionic build --prod

# Servir PWA
npx serve www -s -p 8081
```

---

## Arranque rápido

Doble clic en `iniciar_helpdesk.bat` — levanta backend y frontend automáticamente.

---

## Destinos de ejecución

| Destino | URL | Notas |
|---|---|---|
| Navegador desarrollo | http://localhost:8100 | ionic serve |
| PC producción PWA | http://localhost:8081 | npx serve www |
| Android emulador | http://10.0.2.2:8081 | Chrome en emulador API 37.1 |
| Android físico | http://192.168.1.12:8081 | Misma red WiFi |
| iOS | Chrome DevTools iPhone 14 | Simulación responsive |

---

## Roles del sistema

| Rol | Acceso |
|---|---|
| usuario | Sus propios tickets, notificaciones |
| tecnico | Tickets de categoría Técnica y Redes |
| mesa_ayuda | Tickets de categoría ERP |
| admin | Todo el sistema + gestión usuarios + métricas |

---

## Features implementadas

| # | Feature | Estado |
|---|---|---|
| 004 | Setup backend FastAPI + SQLAlchemy + MySQL | ✅ |
| 005 | CRUD Tickets con filtros, IDOR, RBAC, soft delete | ✅ |
| 006 | CRUD Usuarios con bcrypt y cambio de contraseña | ✅ |
| 007 | Autenticación JWT con RBAC y rate limiting | ✅ |
| 008 | Optimización: eager loading, caché, BackgroundTasks | ✅ |
| 009 | Historial de eventos del ticket (6 tipos) | ✅ |
| 010 | Comentarios anidados bajo ticket | ✅ |
| 011 | Notificaciones avanzadas con badge | ✅ |
| 012 | Métricas por estado, categoría, técnico y tiempo | ✅ |
| 013 | Frontend login dividido + registro con validaciones | ✅ |
| 014 | Dashboard por rol, detalle, sidebar árbol, gestión | ✅ |
| 015 | PWA instalable en PC y Android | ✅ |
| 019 | Logging estructurado INFO/WARNING/ERROR | ✅ |
| 020 | Configuración centralizada pydantic-settings | ✅ |
| 021 | Reset contraseña con tabla solicitudes_reset | ✅ |

---

## Credenciales de prueba

| Email | Password | Rol |
|---|---|---|
| admin2@empresa.com | admin12345 | Admin |
| tecnico@empresa.com | 12345678 | Técnico |
| prueba@empresa.com | 12345678 | Mesa Ayuda |
| testfinal@empresa.com | 12345678 | Usuario |

---

## Verificación del entorno

```bash
# Diagnóstico Ionic
ionic info

# Verificar backend
curl http://localhost:8000/docs

# Verificar frontend
curl http://localhost:8100
```

---

## Limitaciones del entorno

### Limitación 1 — iOS requiere macOS
**Descripción:** Capacitor compila para iOS únicamente en macOS con Xcode instalado.  
**Estrategia:** Simulación con Chrome DevTools usando perfil iPhone 14 para verificar diseño responsive.

### Limitación 2 — Firewall en red local
**Descripción:** El firewall de Windows y el router bloquean tráfico entre la computadora y dispositivos Android en la misma red.  
**Estrategia:** Reglas específicas de firewall para puertos 8000 y 8081 sin desactivar la seguridad global.

### Limitación 3 — HTTP sin cifrar
**Descripción:** iOS y Android bloquean tráfico HTTP en producción real.  
**Estrategia:** Configuración acotada para desarrollo local. En producción real se requiere HTTPS con certificado SSL.

---

## Pruebas realizadas

Se realizaron 44 casos de prueba documentados en 3 reportes Word:

- `reporte_pruebas_auth.docx` — 8 pruebas de autenticación
- `reporte_pruebas_tickets_usuarios.docx` — 18 pruebas
- `reporte_pruebas_comentarios_historial_notificaciones_metricas.docx` — 18 pruebas

---

## Uso de Inteligencia Artificial

Se utilizó **Claude (Anthropic)** como asistente de programación.

**Rol del estudiante:**
- Definió la arquitectura, requerimientos y reglas de negocio
- Aprobó o rechazó cada sugerencia antes de implementarla
- Ejecutó, probó y validó cada fragmento de código
- Tomó todas las decisiones técnicas y de diseño
- Identificó bugs y propuso mejoras de UX/UIX

**Rol de Claude:**
- Generó fragmentos de código según las especificaciones del estudiante
- Explicó el razonamiento detrás de cada decisión técnica
- Propuso opciones — el estudiante eligió
- Asistió en la resolución de errores

Todas las decisiones técnicas fueron tomadas por el estudiante. Cada fragmento de código fue probado y validado manualmente.

---

## .gitignore

```
backend/venv/
backend/.env
__pycache__/
*.pyc
*.pyo
frontend/node_modules/
frontend/.angular/cache/
frontend/www/
frontend/dist/
.DS_Store
```
