# 021 · Reset de Contraseña

**Estado:** implementado ✅

## Problema

Los usuarios que olvidan su contraseña no tienen forma de recuperar el acceso sin intervención directa del administrador. La tabla `notificaciones` requiere `id_ticket NOT NULL`, lo que impide usarla para notificaciones sin ticket asociado.

## Decisión arquitectónica

Se crea una tabla separada `solicitudes_reset` para no comprometer la integridad referencial de la tabla `notificaciones`. Esta decisión prioriza la escalabilidad y la correctitud sobre la rapidez de implementación.

## Entidad: solicitudes_reset

```sql
CREATE TABLE solicitudes_reset (
  id_solicitud  INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario    INT NOT NULL,
  fecha         DATETIME DEFAULT NOW(),
  atendida      BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | /auth/solicitar-reset | Público | Crea solicitud de reset |
| GET | /api/v1/solicitudes | Admin | Lista solicitudes pendientes |
| PATCH | /api/v1/solicitudes/{id}/atender | Admin | Marca solicitud como atendida |

## Flujo completo

```
1. Usuario hace clic en "¿Olvidaste tu contraseña?" en el login
2. Ingresa su email en la pantalla olvido-password
3. Backend crea registro en solicitudes_reset
4. Admin ve solicitudes pendientes en Gestión de usuarios
5. Admin va al usuario → botón 🔑 → cambia la contraseña
6. Admin marca la solicitud como atendida
7. Sistema muestra: "Comunica la nueva contraseña por WhatsApp de Mesa de Ayuda"
8. Usuario recibe la nueva clave y hace login
```

## Seguridad

- Rate limiting: 3 solicitudes por minuto por IP
- Respuesta siempre igual (email exista o no) — evita enumeración de usuarios
- La contraseña nueva se hashea con bcrypt antes de guardarse

## Criterios de aceptación

- [x] POST /auth/solicitar-reset crea registro en solicitudes_reset
- [x] Rate limiting 3/minute en el endpoint
- [x] Respuesta siempre igual independientemente de si el email existe
- [x] GET /api/v1/solicitudes lista solo las pendientes (atendida=false)
- [x] PATCH /api/v1/solicitudes/{id}/atender marca como atendida
- [x] Panel admin en Gestión de usuarios muestra solicitudes pendientes
- [x] Botón 🔑 en cada usuario abre modal para cambiar contraseña
- [x] PATCH /api/v1/usuarios/{id} acepta campo password opcional y lo hashea
- [x] Pantalla olvido-password con campo email, validación y mensaje de éxito
- [x] Mensaje de éxito explica que la clave llegará por WhatsApp de Mesa de Ayuda
