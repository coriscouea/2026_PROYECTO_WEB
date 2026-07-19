# =============================================================
# database.py — Conexión a la base de datos MySQL
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: crear el motor de conexión SQLAlchemy,
# la sesión de base de datos y la clase base para los modelos.
# Este archivo es el punto de entrada de toda la capa de datos.
# =============================================================

from sqlalchemy import create_engine                        # crea el motor de conexión a MySQL
from sqlalchemy.orm import sessionmaker, DeclarativeBase    # sessionmaker: fábrica de sesiones | DeclarativeBase: clase base para modelos
from dotenv import load_dotenv                              # lee las variables del archivo .env
import os                                                   # accede a las variables de entorno del sistema

# -------------------------------------------------------------
# Carga las variables de entorno desde el archivo .env
# Sin esta línea, os.getenv() devolvería None para todas las variables
# -------------------------------------------------------------

load_dotenv()

# -------------------------------------------------------------
# Lee cada variable de entorno definida en .env
# Si una variable no existe, os.getenv() devuelve None
# -------------------------------------------------------------

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# -------------------------------------------------------------
# Construye la URL de conexión en el formato que SQLAlchemy entiende
# Formato: dialecto+driver://usuario:contraseña@host:puerto/base_de_datos
# pymysql es el driver Python que conecta SQLAlchemy con MySQL
# -------------------------------------------------------------

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# -------------------------------------------------------------
# Crea el motor de conexión a MySQL
# El motor es el objeto principal que SQLAlchemy usa para hablar con la BD
# Se crea una sola vez y se reutiliza en toda la aplicación
# -------------------------------------------------------------

engine = create_engine(DATABASE_URL, echo=True)

# -------------------------------------------------------------
# Crea la fábrica de sesiones
# Cada sesión representa una transacción con la base de datos
# autocommit=False → los cambios no se guardan solos, hay que hacer db.commit()
# autoflush=False  → SQLAlchemy no sincroniza automáticamente antes de cada consulta
# bind=engine      → vincula la sesión al motor de MySQL que definimos arriba
# -------------------------------------------------------------

Sessionlocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# -------------------------------------------------------------
# Clase base para todos los modelos SQLAlchemy
# Cada entidad (Usuario, Ticket, Rol...) hereda de esta clase
# DeclarativeBase permite definir tablas como clases Python
# ----------------------------------------------------------

class Base(DeclarativeBase):
    pass

# -------------------------------------------------------------
# Generador de sesiones para los endpoints de FastAPI
# FastAPI llama a esta función en cada petición HTTP
# yield db  → entrega la sesión al endpoint que la necesita
# finally   → garantiza que la sesión se cierra siempre,
#             incluso si ocurre un error durante la petición
# -------------------------------------------------------------

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

