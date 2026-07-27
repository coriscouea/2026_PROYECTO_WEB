# 007 · Autenticación y Autorización — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Dependencias
- [x] Instalar: `pip install python-jose[cryptography] slowapi`
- [x] Actualizar `backend/requirements.txt` con `pip freeze > requirements.txt`

## Variables de entorno
- [x] Agregar al `.env`:
  - `JWT_SECRET_KEY` — generado con `openssl rand -hex 32`
  - `JWT_ALGORITHM=HS256`
  - `ACCESS_TOKEN_EXPIRE_MINUTES=30` _(ajustado de 15 a 30 min — decisión final documentada en `spec.md`)_
  - `REFRESH_TOKEN_EXPIRE_DAYS=1` _(ajustado de 7 a 1 día — decisión final documentada en `spec.md`)_
  - `CORS_ORIGINS=http://localhost:8100`
- [x] Agregar las mismas claves (sin valores) al `.env.example`

## Módulo de seguridad
- [x] Crear `backend/app/core/` y el archivo `backend/app/core/security.py` con:
  - [x] `hash_password(password)` — retorna hash bcrypt
  - [x] `verify_password(plain, hashed)` — retorna True/False
  - [x] `create_access_token(data)` — JWT con exp de 30 min
  - [x] `create_refresh_token(data)` — JWT con exp de 1 día
  - [x] `decode_token(token)` — verifica firma y expiración; lanza excepción si falla

## Middleware / dependencias FastAPI
- [x] Crear `backend/app/middleware/auth.py` con:
  - [x] `get_current_user(token)` — extrae y valida el JWT; devuelve 401 si falla
  - [x] `require_roles(*roles)` — verifica que el rol del JWT esté permitido; devuelve 403 si no

## Servicio de autenticación
- [x] Crear `backend/app/services/auth_svc.py` con:
  - [x] `svc_registro(db, datos)` — hashea password, verifica unicidad email, crea usuario
  - [x] `svc_login(db, email, password)` — busca usuario, verifica hash, genera ambos tokens
  - [x] `svc_refresh(db, refresh_token)` — valida token, genera nuevo access token

## Endpoints de autenticación
- [x] Crear `backend/app/routes/auth.py` con:
  - [x] `POST /auth/registro` — devuelve 201 sin campo password
  - [x] `POST /auth/login` — con rate limiting (`slowapi`, 5/minuto vía `app/core/limiter.py`), devuelve tokens
  - [x] `POST /auth/refresh` — devuelve nuevo access token
- [x] Registrar el router en `backend/app/main.py`

## CORS
- [x] Configurar `CORSMiddleware` en `backend/app/main.py` leyendo orígenes desde `.env`

## Protección de endpoints existentes
- [x] Aplicar `Depends(get_current_user)` en todos los endpoints de tickets y usuarios
- [x] Aplicar `Depends(require_roles(...))` según la tabla de permisos del `spec.md`
- [x] Filtrar tickets por pertenencia/categoría según rol (`usuario` ve solo los suyos, `tecnico`/`mesa_ayuda` solo su categoría) — mitigación IDOR aplicada en `ticket_repo.py` y `ticket_svc.py`

## Pruebas en Postman
- [x] Registro exitoso → verificar 201 y que la respuesta no incluye `password`
- [x] Registro con email duplicado → verificar 409
- [x] Login con credenciales correctas → verificar 200 y que la respuesta incluye `access_token` y `refresh_token`
- [x] Login con contraseña incorrecta → verificar 401
- [x] Login con usuario inactivo → verificar 401
- [x] Acceder a endpoint protegido sin token → verificar 401
- [x] Acceder a endpoint protegido con token expirado → verificar 401
- [x] Acceder a endpoint de admin con rol `usuario` → verificar 403
- [x] Renovar token con refresh token válido → verificar 200 y nuevo access token
- [x] Renovar token con refresh token inválido → verificar 401
- [x] Superar límite de intentos de login → verificar 429
- [x] Registrar capturas de pantalla de cada caso como evidencia

## Cierre
- [x] Validar contra todos los criterios de aceptación de `spec.md`
- [x] Mover la feature a "Hecho" en `../../constitution/roadmap.md`
