# 007 · Autenticación y Autorización — Tareas

_Checklist accionable derivada del `plan.md`. Marca `[x]` al completar cada tarea._

## Dependencias
- [ ] Instalar: `pip install python-jose[cryptography] slowapi`
- [ ] Actualizar `backend/requirements.txt` con `pip freeze > requirements.txt`

## Variables de entorno
- [ ] Agregar al `.env`:
  - `JWT_SECRET_KEY` — generado con `openssl rand -hex 32`
  - `JWT_ALGORITHM=HS256`
  - `ACCESS_TOKEN_EXPIRE_MINUTES=15`
  - `REFRESH_TOKEN_EXPIRE_DAYS=7`
  - `CORS_ORIGINS=http://localhost:8100`
- [ ] Agregar las mismas claves (sin valores) al `.env.example`

## Módulo de seguridad
- [ ] Crear `backend/app/core/` y el archivo `backend/app/core/security.py` con:
  - [ ] `hash_password(password)` — retorna hash bcrypt
  - [ ] `verify_password(plain, hashed)` — retorna True/False
  - [ ] `create_access_token(data)` — JWT con exp de 15 min
  - [ ] `create_refresh_token(data)` — JWT con exp de 7 días
  - [ ] `decode_token(token)` — verifica firma y expiración; lanza excepción si falla

## Middleware / dependencias FastAPI
- [ ] Crear `backend/app/middleware/auth.py` con:
  - [ ] `get_current_user(token)` — extrae y valida el JWT; devuelve 401 si falla
  - [ ] `require_roles(*roles)` — verifica que el rol del JWT esté permitido; devuelve 403 si no

## Servicio de autenticación
- [ ] Crear `backend/app/services/auth_svc.py` con:
  - [ ] `registrar(db, datos)` — hashea password, verifica unicidad email, crea usuario
  - [ ] `login(db, email, password)` — busca usuario, verifica hash, genera ambos tokens
  - [ ] `refresh(db, refresh_token)` — valida token, genera nuevo access token

## Endpoints de autenticación
- [ ] Crear `backend/app/routes/auth.py` con:
  - [ ] `POST /auth/registro` — devuelve 201 sin campo password
  - [ ] `POST /auth/login` — con rate limiting (slowapi), devuelve tokens
  - [ ] `POST /auth/refresh` — devuelve nuevo access token
- [ ] Registrar el router en `backend/app/main.py`

## CORS
- [ ] Configurar `CORSMiddleware` en `backend/app/main.py` leyendo orígenes desde `.env`

## Protección de endpoints existentes
- [ ] Aplicar `Depends(get_current_user)` en todos los endpoints de tickets y usuarios
- [ ] Aplicar `Depends(require_roles(...))` según la tabla de permisos del `spec.md`

## Pruebas en Postman
- [ ] Registro exitoso → verificar 201 y que la respuesta no incluye `password`
- [ ] Registro con email duplicado → verificar 409
- [ ] Login con credenciales correctas → verificar 200 y que la respuesta incluye `access_token` y `refresh_token`
- [ ] Login con contraseña incorrecta → verificar 401
- [ ] Login con usuario inactivo → verificar 401
- [ ] Acceder a endpoint protegido sin token → verificar 401
- [ ] Acceder a endpoint protegido con token expirado → verificar 401
- [ ] Acceder a endpoint de admin con rol `usuario` → verificar 403
- [ ] Renovar token con refresh token válido → verificar 200 y nuevo access token
- [ ] Renovar token con refresh token inválido → verificar 401
- [ ] Superar límite de intentos de login → verificar 429
- [ ] Registrar capturas de pantalla de cada caso como evidencia

## Cierre
- [ ] Validar contra todos los criterios de aceptación de `spec.md`
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`
