# =============================================================
# alembic/env.py — Configuración del entorno de migraciones
# HelpDesk Web | Feature 004 · Setup Backend
# =============================================================
# Responsabilidad: conecta Alembic con SQLAlchemy para que
# detecte automáticamente los modelos y genere las migraciones
# correspondientes en la base de datos MySQL.
# =============================================================

from logging.config import fileConfig           # para configurar el logging de Alembic
from sqlalchemy import engine_from_config, pool # para crear el motor de base de datos
from alembic import context                     # para acceder al contexto de Alembic y ejecutar las migraciones
from dotenv import load_dotenv                  # para cargar variables de entorno desde un archivo .env
import os                                       # para acceder a variables de entorno del sistema operativo

# -------------------------------------------------------------
# Carga las variables de entorno desde .env
# Necesario para leer las credenciales de MySQL
# -------------------------------------------------------------

load_dotenv()

# -------------------------------------------------------------
# Importar Base y todos los modelos para que Alembic los detecte
# Si no se importan aquí, Alembic no sabrá que existen
# -------------------------------------------------------------

from app.database import Base
from app.models.roles import Rol
from app.models.sucursales import Sucursal
from app.models.categorias import Categoria
from app.models.usuario import Usuario
from app.models.tickets import Ticket
from app.models.comentarios import Comentario
from app.models.historial_estado import HistorialEstado
from app.models.notificaciones import Notificacion 

# -------------------------------------------------------------
# Objeto de configuración de Alembic
# Lee el archivo alembic.ini
# -------------------------------------------------------------

config = context.config

# -------------------------------------------------------------
# Configura el logging según alembic.ini
# -------------------------------------------------------------

if config.config_file_name is not None: 
    fileConfig(config.config_file_name)

# -------------------------------------------------------------
# Asigna el metadata de Base para que Alembic detecte
# automáticamente las tablas y sus cambios (autogenerate)
# -------------------------------------------------------------

target_metadata = Base.metadata

# -------------------------------------------------------------
# Construye la URL de conexión desde variables de entorno
# Sobrescribe la URL del alembic.ini con la del .env
# -------------------------------------------------------------

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    from sqlalchemy import create_engine
    connectable = create_engine(DATABASE_URL)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
