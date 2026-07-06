# 006 · CRUD Usuarios — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Se implementan los 5 endpoints REST de Usuario siguiendo el mismo patrón
de capas que la feature 005 (routes → service → repository → model).
La capa service concentra las reglas críticas: unicidad de email,
transformación a minúsculas, asignación de rol por defecto y exclusión
del campo password en todas las respuestas.

## Implementación

1. Definir schemas Pydantic — `backend/app/schemas/usuario.py`
   (UsuarioCreate, UsuarioUpdate, UsuarioResponse — sin campo password).
2. Crear repositorio — `backend/app/repository/usuario_repo.py`
   con: crear, listar activos, obtener por id, actualizar, desactivar, buscar por email.
3. Crear capa de servicio — `backend/app/services/usuario_svc.py`
   con: sanitizar nombre, transformar email a minúsculas, verificar unicidad
   de email (→ 409), hashear password, asignar rol por defecto, verificar
   existencia de FK (rol, sucursal).
4. Crear router — `backend/app/routes/usuarios.py`
   con los 5 endpoints y sus códigos HTTP.
5. Registrar el router en `backend/app/main.py`.
6. Probar cada endpoint en Postman y registrar evidencias.

## Decisiones

- **Email a minúsculas antes de persistir** — la transformación garantiza
  que "Juan@empresa.com" y "juan@empresa.com" sean el mismo usuario;
  sin esto la validación de unicidad puede fallar silenciosamente.
- **Password hasheado con bcrypt** — nunca almacenar texto plano;
  el hash se genera en la capa service antes de llegar al repositorio.
- **UsuarioResponse sin password** — el schema de respuesta Pydantic
  no incluye el campo password; aunque exista en el modelo SQLAlchemy,
  nunca sale en ninguna respuesta JSON.
- **Soft delete con tickets intactos** — al desactivar un usuario,
  sus tickets y comentarios permanecen en la base de datos;
  solo `activo = FALSE` cambia en la tabla Usuario.
- **409 genérico para email duplicado** — el mensaje no revela si el
  email pertenece a un usuario activo o inactivo, previniendo enumeración.

## Riesgos

- **Bcrypt no instalado** — mitigación: agregar `passlib[bcrypt]`
  a `requirements.txt` en la feature 004 o en esta.
- **FK de rol o sucursal inexistente** — mitigación: verificar existencia
  en la capa service antes del INSERT y devolver 400 con mensaje claro.
- **Admin desactiva su propia cuenta** — mitigación: la capa service
  debe verificar que el usuario autenticado no se desactive a sí mismo;
  devolver 400 si lo intenta.
