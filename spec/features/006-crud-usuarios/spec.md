# 006 · CRUD Usuarios

**Estado:** implementado ✅

## Qué hace

Expone los endpoints REST que permiten registrar, consultar y desactivar
usuarios del sistema. El administrador puede crear cuentas, asignar roles
y sucursales, y desactivar usuarios que ya no pertenecen a la empresa.
Ningún usuario se elimina físicamente — solo se desactiva.

## Por qué

Sin usuarios no existe ninguna otra funcionalidad: los tickets necesitan
un solicitante y un técnico, las notificaciones necesitan un destinatario
y el historial necesita un responsable. Esta feature es el prerequisito
de autenticación y de cualquier operación que involucre identidad.

## Arquitectura por capas

```
[routes/usuarios.py]         ← recibe la solicitud HTTP, valida Pydantic
        ↓
[services/usuario_svc.py]    ← aplica reglas de negocio (unicidad email, rol por defecto)
        ↓
[repository/usuario_repo.py] ← operaciones SQLAlchemy contra MySQL
        ↓
[models/usuario.py]          ← entidad Usuario con sus restricciones
```

## Endpoints

| Método | Ruta                       | Qué hace                                        | Quién puede usarlo     |
|--------|----------------------------|-------------------------------------------------|------------------------|
| POST   | `/api/v1/usuarios`         | Crea un nuevo usuario con rol estándar          | Admin                  |
| GET    | `/api/v1/usuarios`         | Lista usuarios activos con paginación           | Admin                  |
| GET    | `/api/v1/usuarios/{id}`    | Consulta el detalle de un usuario específico    | Admin                  |
| PATCH  | `/api/v1/usuarios/{id}`    | Actualiza nombre, sucursal o rol                | Admin                  |
| DELETE | `/api/v1/usuarios/{id}`    | Soft delete — marca `activo=FALSE` (regla 4)  | Admin                        |

## Criterios de aceptación

**Create**
- [X] `POST /api/v1/usuarios` crea un usuario con rol `usuario` por defecto (regla 7).
- [X] Si el email ya existe en la base de datos, devuelve **409 Conflict**.
- [X] El campo `password` se almacena como hash — nunca en texto plano.
- [X] La respuesta exitosa devuelve **201 Created** con el usuario creado (sin el campo `password`).

**Read**
- [X] `GET /api/v1/usuarios` devuelve solo usuarios con `activo = TRUE` por defecto.
- [X] `GET /api/v1/usuarios` soporta paginación con parámetros `page` y `limit`.
- [X] `GET /api/v1/usuarios/{id}` devuelve **404 Not Found** si el usuario no existe.
- [X] Ninguna respuesta incluye el campo `password` (ni cifrado).

**Update**
- [X] `PATCH /api/v1/usuarios/{id}` actualiza solo los campos enviados.
- [X] El campo `email` no puede modificarse mediante PATCH — si se envía, se ignora.
- [X] El campo `password` no puede modificarse mediante este endpoint — tiene su propio flujo futuro.
- [X] Solo admin puede ejecutar PATCH; cualquier otro rol recibe **403 Forbidden**.

**Delete**
- [X] `DELETE /api/v1/usuarios/{id}` marca `activo = FALSE` y registra `deleted_at = NOW()` (soft delete con fecha, regla 4).
- [X] Si el usuario tiene tickets activos asociados, el sistema permite la desactivación
  pero los tickets permanecen en la base de datos con su historial intacto.
- [X] Si el usuario ya está inactivo, devuelve **400 Bad Request**.
- [X] Solo admin puede ejecutar DELETE; cualquier otro rol recibe **403 Forbidden**.

**General**
- [X] Todos los endpoints devuelven `{exito, datos, mensaje}` en éxito y `{exito, errores, mensaje}` en error.
- [X] Ninguna respuesta expone trazas de pila, consultas SQL ni mensajes internos.
- [X] Cada endpoint es probado en Postman con: caso exitoso, datos inválidos, email duplicado y rol no autorizado.

## Validaciones y sanitización

Orden: **sanitizar → validar → transformar**

| Campo         | Tipo   | Obligatorio | Reglas                                              | Código de error |
|---------------|--------|-------------|-----------------------------------------------------|-----------------|
| `nombre`      | str    | Sí          | min 3 chars, max 100, sin etiquetas HTML            | 422             |
| `email`       | str    | Sí          | formato email válido, único en la tabla             | 422 / 409       |
| `password`    | str    | Sí          | min 8 chars                                         | 422             |
| `id_rol`      | int    | No          | debe existir en tabla Roles; default → rol usuario  | 400             |
| `id_sucursal` | int    | No          | debe existir en tabla Sucursales si se envía        | 400             |

> El email se transforma a minúsculas antes de almacenarse para garantizar
> unicidad consistente (ej. "Juan@empresa.com" == "juan@empresa.com").

## Reglas de negocio aplicadas (capa service)

- **Regla 1** — el email debe ser único; verificar antes del INSERT y devolver 409 si ya existe.
- **Regla 4** — los usuarios no se eliminan físicamente; solo se desactivan con `activo = FALSE`.
- **Regla 7** — todo usuario creado recibe el rol `usuario` por defecto; el admin puede cambiarlo luego mediante PATCH.
- **Sin exposición de password** — el campo `password` nunca aparece en ninguna respuesta JSON.

## Códigos HTTP utilizados

| Código | Cuándo                                                      |
|--------|-------------------------------------------------------------|
| 201    | Usuario creado exitosamente (POST)                          |
| 200    | Consulta o actualización exitosa (GET, PATCH)               |
| 400    | FK inexistente, usuario ya inactivo, JSON malformado        |
| 403    | Rol sin permiso para la operación                           |
| 404    | Usuario no encontrado por ID                                |
| 409    | Email duplicado — ya existe un usuario con ese correo       |
| 422    | Valor viola reglas de validación (longitud, formato, etc.)  |

## Riesgos de seguridad

- **Exposición de contraseñas** — el campo `password` se excluye de todas las respuestas
  JSON, incluso del GET de detalle.
- **Escalada de roles** — solo el admin puede asignar o cambiar roles; un usuario no puede
  auto-asignarse `tecnico` o `admin` durante el registro ni mediante PATCH.
- **Email como vector de enumeración** — el mensaje de error por email duplicado no debe
  revelar si el email pertenece a un usuario activo o inactivo (devolver siempre 409 genérico).

## Fuera de alcance

- Autenticación JWT y login (→ feature 007-autenticacion).
- Cambio de contraseña con flujo propio (→ backlog futuro).
- Recuperación de contraseña por email (→ backlog futuro).
- Gestión de permisos granulares por endpoint (→ backlog futuro).
