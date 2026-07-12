# 007 · Autenticación y Autorización

**Estado:** propuesta

## Qué hace

Protege la API de HelpDesk Web mediante autenticación basada en JWT
y autorización por roles (RBAC). El usuario inicia sesión con email y
contraseña, recibe un access token y un refresh token, y adjunta el
access token en cada solicitud protegida. El backend verifica el token
y el rol antes de ejecutar cualquier operación sensible.

## Por qué

Sin autenticación, cualquier cliente puede leer o modificar tickets
y usuarios de la empresa enviando solicitudes HTTP directamente a la
API, sin importar quién sea. Esta feature cierra esa brecha y es
prerequisito de todas las features siguientes: historial, notificaciones
y métricas solo tienen sentido si sabemos quién ejecuta cada acción.

## Arquitectura por capas

```
[routes/auth.py]          ← endpoints públicos: registro, login, refresh
        ↓
[services/auth_svc.py]    ← lógica de autenticación: verificar credenciales,
                             generar tokens, verificar hash de contraseña
        ↓
[repository/usuario_repo.py] ← buscar usuario por email (ya existe en 006)
        ↓
[models/usuario.py]       ← entidad Usuario con password hasheado

[middleware/auth.py]      ← dependencias FastAPI que protegen rutas:
                             verificar token y verificar rol
```

## Endpoints de autenticación (públicos)

| Método | Ruta              | Qué hace                                                  |
|--------|-------------------|-----------------------------------------------------------|
| POST   | `/auth/registro`  | Crea un usuario con rol estándar y devuelve 201           |
| POST   | `/auth/login`     | Verifica credenciales y emite access + refresh token      |
| POST   | `/auth/refresh`   | Recibe refresh token y emite nuevo access token           |

> Nota: estos endpoints usan `/auth/` sin el prefijo `/api/v1/` porque
> son acciones de autenticación, no recursos REST — excepción aceptada
> en el estándar REST (sección 1.4.8 de la guía semana 7).

## Estructura del JWT

```json
{
  "sub": "154",
  "email": "juan.perez@empresa.com",
  "rol": "tecnico",
  "iat": 1751702400,
  "exp": 1751703300
}
```

- `sub` — id_usuario (identificador único del sujeto)
- `email` — correo del usuario autenticado
- `rol` — rol del usuario (para RBAC sin consulta adicional a BD)
- `iat` — fecha de emisión (Unix timestamp)
- `exp` — fecha de expiración (Unix timestamp)

**Nunca incluir en el payload:** contraseñas, tokens internos, datos bancarios ni información confidencial. El JWT es firmado, no cifrado — cualquiera puede leer su contenido.

## Vigencia de tokens

| Token         | Vigencia  | Propósito                                              |
|---------------|-----------|--------------------------------------------------------|
| Access token  | 30 min    | Autoriza cada solicitud protegida                      |
| Refresh token | 1 días    | Obtiene nuevo access token sin requerir nuevo login    |

## Clasificación de endpoints: públicos vs protegidos

| Endpoint                    | Protección         |
|-----------------------------|--------------------|
| `POST /auth/registro`       | Público            |
| `POST /auth/login`          | Público            |
| `POST /auth/refresh`        | Refresh token válido |
| `GET /api/v1/tickets`       | Access token — cualquier rol |
| `POST /api/v1/tickets`      | Access token — cualquier rol |
| `PATCH /api/v1/tickets/{id}`| Access token — tecnico, mesa_ayuda, admin |
| `DELETE /api/v1/tickets/{id}`| Access token — admin |
| `GET /api/v1/usuarios`      | Access token — admin |
| `POST /api/v1/usuarios`     | Access token — admin |
| `PATCH /api/v1/usuarios/{id}`| Access token — admin |
| `DELETE /api/v1/usuarios/{id}`| Access token — admin |

## RBAC — roles y permisos

| Rol          | Puede hacer                                                                |
|--------------|----------------------------------------------------------------------------|
| `usuario`    | Crear tickets propios, consultar sus propios tickets                       |
| `tecnico`    | Todo lo anterior + tomar tickets de categoría Técnica y Redes, cambiar estado |
| `mesa_ayuda` | Todo lo anterior + tomar tickets de categoría ERP, cambiar estado         |
| `admin`      | Todo — incluye gestión de usuarios, roles y sucursales                     |

## Criterios de aceptación

**Registro**
- [ ] `POST /auth/registro` crea usuario con rol `usuario` por defecto.
- [ ] Si el email ya existe devuelve **409 Conflict**.
- [ ] La contraseña se almacena como hash bcrypt — nunca en texto plano.
- [ ] La respuesta no incluye el campo `password`.

**Login**
- [ ] `POST /auth/login` verifica email y contraseña correctos.
- [ ] Si las credenciales son inválidas devuelve **401 Unauthorized**.
- [ ] Si el usuario está inactivo (`activo=FALSE`) devuelve **401 Unauthorized**.
- [ ] Respuesta exitosa devuelve `access_token`, `refresh_token` y `expira_en` (segundos).

**Refresh**
- [ ] `POST /auth/refresh` emite nuevo access token sin requerir login.
- [ ] Si el refresh token es inválido o expirado devuelve **401 Unauthorized**.

**Protección de rutas**
- [ ] Cualquier endpoint protegido sin token devuelve **401 Unauthorized**.
- [ ] Token inválido o expirado devuelve **401 Unauthorized**.
- [ ] Token válido pero rol insuficiente devuelve **403 Forbidden**.
- [ ] El middleware verifica autenticación antes de cualquier lógica de negocio.
- [ ] El middleware de autorización lee el rol directamente del JWT — sin consulta adicional a la BD.

**Seguridad**
- [ ] La clave secreta JWT se lee desde `.env` — nunca hardcodeada en el código.
- [ ] `POST /auth/login` aplica rate limiting — devuelve **429** al superar el límite.
- [ ] El backend configura CORS permitiendo solo los orígenes definidos en `.env`.
- [ ] Ningún endpoint expone contraseñas, tokens completos ni trazas internas en la respuesta.

## Comparación de alternativas — decisión documentada

| Criterio            | Sesiones de servidor     | JWT (elegido)                          |
|---------------------|--------------------------|----------------------------------------|
| Estado en servidor  | Sí — almacena sesiones   | No — stateless, principio REST         |
| Escalabilidad       | Requiere compartir sesiones entre instancias | Cualquier instancia valida el token |
| Adecuado para móvil | No — cookies limitadas en apps móviles | Sí — encabezado Authorization estándar |
| Revocación          | Inmediata                | Solo al expirar (mitigado con vida corta) |

Se elige JWT porque respeta el principio REST de statelessness, escala horizontalmente sin infraestructura adicional, y es el estándar más adoptado en APIs consumidas por aplicaciones móviles.

## Códigos HTTP

| Código | Cuándo                                                      |
|--------|-------------------------------------------------------------|
| 200    | Login o refresh exitoso                                     |
| 201    | Registro exitoso                                            |
| 401    | Token ausente, inválido, expirado o credenciales incorrectas |
| 403    | Token válido pero rol insuficiente para la operación        |
| 409    | Email duplicado en registro                                 |
| 422    | Datos de entrada inválidos (formato email, longitud password) |
| 429    | Rate limit excedido en login                                |

## Riesgos de seguridad

- **Exposición de credenciales** — mitigación: bcrypt para passwords, JWT en encabezado Authorization, claves en `.env`, nunca en logs ni código fuente.
- **IDOR** — mitigación: verificar siempre que el recurso solicitado pertenece al usuario autenticado antes de ejecutar la operación.
- **Fuerza bruta en login** — mitigación: rate limiting en `POST /auth/login` → 429 al superar el límite.
- **Tokens vencidos mal manejados** — mitigación: el frontend detecta 401, usa el refresh token para renovar el access token, y solo redirige al login si el refresh también falla.

## Fuera de alcance

- OAuth2 / inicio de sesión con Google o Microsoft (→ backlog futuro).
- Recuperación de contraseña por email (→ backlog futuro).
- Lista negra de tokens revocados (→ backlog futuro).
- Autenticación de dos factores (→ backlog futuro).
