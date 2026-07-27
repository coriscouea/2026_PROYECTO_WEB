# =============================================================
# core/limiter.py — Configuración del rate limiter
# HelpDesk Web | Feature 007 · Autenticación JWT
# =============================================================
# Se define aquí para evitar import circular entre main.py
# y routes/auth.py
# =============================================================

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)