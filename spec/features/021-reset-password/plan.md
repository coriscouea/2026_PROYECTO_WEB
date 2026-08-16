# 021 · Reset de Contraseña — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué tabla separada solicitudes_reset?

**Opción A — Usar tabla notificaciones**
- ❌ `id_ticket` es NOT NULL — FK constraint
- ❌ Requeriría un ticket falso como referencia
- ❌ Mezcla semánticas distintas

**Opción B — Modificar notificaciones para permitir NULL**
- ❌ Rompe la lógica existente de notificaciones
- ❌ Riesgo de FK inválidas en otras queries
- ❌ No es escalable

**Opción C — Tabla separada solicitudes_reset ✅ ELEGIDA**
- ✅ Sin dependencia de id_ticket
- ✅ Semánticamente correcta
- ✅ Escalable — puede tener campos adicionales futuros
- ✅ No rompe lógica existente

### ¿Por qué respuesta siempre igual en solicitar-reset?
Si la respuesta fuera diferente según si el email existe o no, un atacante podría enumerar emails válidos del sistema. Siempre responder igual es una práctica estándar de seguridad.

### ¿Por qué el admin comunica la contraseña por WhatsApp?
El sistema no tiene servidor de email configurado (SMTP). Implementar SMTP requeriría credenciales externas, configuración adicional y mantenimiento. Para el contexto universitario y empresarial local, el canal WhatsApp de Mesa de Ayuda es más práctico y controlado.

### ¿Por qué panel en Gestión de usuarios y no en Notificaciones?
- Las notificaciones están ligadas a tickets
- El admin ya gestiona usuarios en esa pantalla
- Ver solicitudes donde se gestiona la acción es más intuitivo

---

## Flujo de seguridad

```
Solicitud → Rate limit 3/min → Verificar email → Crear registro
                                     ↓
                              Si no existe → respuesta igual (sin revelar)
                                     ↓
                              Si existe → crear solicitud_reset
```

---

## Archivos involucrados

### Backend
| Archivo | Cambio |
|---|---|
| `models/solicitudes_reset.py` | Nuevo modelo |
| `repository/solicitud_reset_repo.py` | Nuevo repositorio |
| `routes/auth.py` | Endpoint POST /auth/solicitar-reset |
| `routes/solicitudes.py` | Nuevo router GET/PATCH |
| `schemas/usuario.py` | Campo password opcional en UsuarioUpdate |
| `services/usuario_svc.py` | Hash password si viene en PATCH |
| `main.py` | Registrar nuevo router |

### Frontend
| Archivo | Cambio |
|---|---|
| `pages/olvido-password/*` | Nueva pantalla |
| `pages/usuarios/usuarios.page.*` | Modal 🔑 + sección solicitudes |
| `services/usuario.ts` | listarSolicitudes(), atenderSolicitud() |
| `app.routes.ts` | Ruta /olvido-password |
