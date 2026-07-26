# =============================================================
# core/security.py — Funciones de seguridad
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Responsabilidad: hash de contraseñas, generación y
# verificación de tokens JWT. No contiene lógica de negocio.
# =============================================================

from datetime import datetime, timezone, timedelta  # Importa clases del módulo estándar
from jose import JWTError,  jwt                     # Importa desde la librería 'python-jose'
from passlib.context import CryptContext            # Importa 'CryptContext' de la librería 'passlib'
from dotenv import load_dotenv                      # Importa 'load_dotenv' de la librería 'python-dotenv'
import os                                           # Importa el módulo estándar 'os'

load_dotenv()

# -------------------------------------------------------------
# Configuración de bcrypt para hash de contraseñas
# -------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------------------------------------------------
# Variables de entorno para JWT
# -------------------------------------------------------------

SECRET_KEY                  = os.getenv("JWT_SECRET_KEY")
ALGORITHM                   = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS   = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "1"))

def hash_password(password: str) -> str:

    # ---------------------------------------------------------
    # Convierte la contraseña en texto plano a hash bcrypt
    # El hash es irreversible — nunca se puede recuperar el original
    # ---------------------------------------------------------

    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:

    # ---------------------------------------------------------
    # Compara la contraseña en texto plano con el hash almacenado
    # Devuelve True si coinciden, False si no
    # ---------------------------------------------------------

    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:

    # ---------------------------------------------------------
    # Genera un JWT de acceso con expiración de 30 minutos
    # data debe incluir: sub (id_usuario), email, rol
    # ---------------------------------------------------------

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:

    # ---------------------------------------------------------
    # Genera un JWT de actualización con expiración de 1 día
    # Solo contiene sub (id_usuario) para minimizar el payload
    # ---------------------------------------------------------

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:

    # ---------------------------------------------------------
    # Verifica la firma y expiración del token JWT
    # Devuelve el payload si es válido
    # Lanza JWTError si el token es inválido o expirado
    # ---------------------------------------------------------

    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


