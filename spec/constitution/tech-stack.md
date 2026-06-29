# tech-stack.md — HelpDesk Web

## Stack definido

| Capa           | Tecnología                        | Rol                                          |
|----------------|-----------------------------------|----------------------------------------------|
| Frontend / UI  | Ionic + HTML / CSS / JS           | Interfaz multiplataforma (View en MVVM)      |
| Lógica nativa  | Capacitor                         | Puente hacia funciones nativas del dispositivo |
| Backend        | Python + FastAPI                  | API REST — lógica de negocio (Model en MVVM) |
| ORM            | SQLAlchemy                        | Gestión de persistencia y migraciones        |
| Migraciones    | Alembic                           | Control de versiones del esquema de BD       |
| Base de datos  | MySQL (motor InnoDB)              | Persistencia de datos                        |
| Despliegue     | PWA                               | Instalable sin tienda de aplicaciones        |
| IDE            | Visual Studio Code                | Entorno de desarrollo                        |
| Paquetes FE    | npm                               | Gestión de dependencias del frontend         |
| Paquetes BE    | pip                               | Gestión de dependencias del backend          |

## Arquitectura

```
[Ionic — View] ←→ HTTP/JSON ←→ [FastAPI — Model] ←→ [MySQL]
                                      ↕
                               SQLAlchemy ORM
```

Patrón: **MVVM**
- **View** → Ionic HTML/CSS (interfaz visible)
- **ViewModel** → JavaScript / axios (lógica de presentación)
- **Model** → FastAPI + SQLAlchemy + MySQL (datos y reglas de negocio)

## Convenciones

- Nombres de tablas en **snake_case** y plural (tickets, usuarios)
- Claves primarias: `id_<entidad>` INT autoincremental
- Claves foráneas: `id_<entidad_referenciada>` INT
- Soft delete: campo `activo BOOLEAN DEFAULT TRUE` (no se eliminan registros)
- Contraseñas almacenadas como hash (nunca texto plano)
- Todos los endpoints bajo prefijo `/api/v1/`

## Metodología

**SDD (Spec-Driven Development):** toda feature debe tener su
`spec.md` aprobado antes de escribir código. La constitución manda
sobre cualquier decisión de feature.

## Entidades del modelo de datos

Usuario, Roles, Sucursales, Categorías, Tickets,
Comentarios, Historial_Estado, Notificaciones

## Límites técnicos (lo que NO usaremos)

- ~~Flask~~ — reemplazado por FastAPI
- ~~Django ORM~~ — descartado por incompatibilidad con FastAPI
- No se usará SQL manual — todo pasa por SQLAlchemy
