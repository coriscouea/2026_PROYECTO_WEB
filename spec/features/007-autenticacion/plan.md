# 007 · Autenticación y Autorización — Plan

_Cómo se implementa lo descrito en `spec.md`. Debe respetar la `constitution/`._

## Enfoque

Se implementa autenticación stateless con JWT usando la librería
`python-jose` para generar y verificar tokens, y `passlib[bcrypt]`
para el hash de contraseñas. La protección de rutas se implementa
mediante dependencias de FastAPI (`Depends`) — no como middleware
global — para mantener control granular por endpoint.

## Dependencias nuevas

```
python-jose[cryptography]   ← generación y verificación de JWT
passlib[bcrypt]             ← ya instalado en la feature 004
slowapi                     ← rate limiting para el endpoint de login
```

## Implementación

1. Agregar variables al `.env` y `.env.example`:
   `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`,
   `REFRESH_TOKEN_EXPIRE_DAYS`, `CORS_ORIGINS`.

2. Crear `backend/app/core/security.py` — funciones de seguridad:
   - `hash_password(password)`          → hash bcrypt
   - `verify_password(plain, hashed)`   → comparar hash
   - `create_access_token(data)`        → genera JWT de 15 min
   - `create_refresh_token(data)`       → genera JWT de 7 días
   - `decode_token(token)`              → verifica firma y expiración

3. Crear `backend/app/middleware/auth.py` — dependencias FastAPI:
   - `get_current_user(token)`  → extrae usuario del JWT, devuelve 401 si falla
   - `require_roles(*roles)`    → verifica que el rol del token esté en la lista, devuelve 403 si no

4. Crear `backend/app/services/auth_svc.py` — lógica de autenticación:
   - `registrar(db, datos)`         → llama usuario_repo, hashea password, crea usuario
   - `login(db, email, password)`   → busca usuario, verifica hash, genera tokens
   - `refresh(db, refresh_token)`   → valida refresh token, genera nuevo access token

5. Crear `backend/app/routes/auth.py` — endpoints públicos:
   - `POST /auth/registro`
   - `POST /auth/login` (con rate limiting)
   - `POST /auth/refresh`

6. Configurar CORS en `backend/app/main.py` con `CORSMiddleware`.

7. Aplicar `Depends(get_current_user)` y `Depends(require_roles(...))` en los
   endpoints existentes de tickets y usuarios.

8. Probar el flujo completo en Postman.

## Decisiones

- **`python-jose` sobre `PyJWT`** — python-jose tiene mejor soporte para
  algoritmos criptográficos y es la librería recomendada en la documentación
  oficial de FastAPI Security.
- **`Depends()` sobre middleware global** — FastAPI Depends permite aplicar
  protección endpoint por endpoint de forma declarativa y explícita, en lugar
  de un middleware global que requiere listas de exclusión para rutas públicas.
- **Refresh token como JWT** — más simple que almacenarlo en base de datos
  para esta etapa; la revocación inmediata queda como mejora futura.
- **Rate limiting con `slowapi`** — librería compatible con FastAPI, aplica
  límite de solicitudes por IP en `POST /auth/login`.

## Riesgos

- **JWT_SECRET_KEY débil** — mitigación: generar con `openssl rand -hex 32`
  y almacenar en `.env`; nunca usar valores predecibles como "secret".
- **CORS demasiado permisivo** — mitigación: leer orígenes permitidos desde
  `.env`; en desarrollo `localhost:8100`, en producción solo el dominio real.
- **Refresh token sin revocación** — riesgo aceptado en esta etapa;
  la vida corta del access token (15 min) mitiga el impacto.
