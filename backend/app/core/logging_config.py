# =============================================================
# core/logging_config.py — Configuración de logging
# HelpDesk Web | Feature 019 · Logging Estructurado
# =============================================================
# Responsabilidad: configura el sistema de logging con niveles
# INFO/WARNING/ERROR. Reemplaza los print() dispersos.
# NUNCA registrar passwords, tokens ni datos sensibles.
# =============================================================

import logging
import sys

def setup_logging():

    # ---------------------------------------------------------
    # Formato: [LEVEL] FECHA HORA - módulo - mensaje
    # --------------------------------------------------------- 

    formato = logging.Formatter(
        fmt = "[%(levelname)s] %(asctime)s - %(name)s - %(message)s",
        datefmt = "%Y-%m-%d %H:%M:%S"
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formato)

    logger = logging.getLogger("helpdesk")
    logger.setLevel(logging.INFO)                       # Nivel mínimo de logging
    logger.addHandler(handler)
    logger.propagate = False                            # Evita que los logs se dupliquen en la consola  

    return logger

# -------------------------------------------------------------
# Logger global — importar desde cualquier módulo:
# from app.core.logging_config import logger
# logger.info("Ticket creado")
# logger.warning("Intento de acceso denegado")
# logger.error("Error inesperado")
# -------------------------------------------------------------

logger = setup_logging()