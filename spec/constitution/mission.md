# Misión

_Define la razón de ser del proyecto. Es la referencia que decide si una feature "encaja" o no._

## Qué construimos

HelpDesk Web es una aplicación móvil PWA que centraliza los requerimientos de soporte técnico de una empresa con múltiples sucursales en Ecuador, reemplazando los canales informales (correo, WhatsApp, comunicación verbal) por un sistema estructurado de tickets.

1. **Registro de tickets** — el empleado reporta su requerimiento clasificándolo por categoría y prioridad.
2. **Gestión por bandeja compartida** — técnicos y mesa de ayuda toman los tickets disponibles según su rol.
3. **Seguimiento y trazabilidad** — cada cambio de estado queda registrado en el historial con fecha y responsable.
4. **Métricas de gestión** — la API calcula indicadores clave para la toma de decisiones.

## Para quién

- **Empleados (usuarios estándar)** — registran requerimientos técnicos y consultan el estado de sus tickets.
- **Técnicos** — atienden tickets de categoría Técnica y Redes desde su bandeja.
- **Mesa de ayuda** — atienden tickets de categoría ERP (Dobra Empresarial).
- **Administradores** — gestionan usuarios, roles y sucursales del sistema.

## Principios

- **Trazabilidad completa** — todo cambio de estado, comentario o asignación queda registrado; nada se elimina físicamente.
- **Separación por roles** — cada usuario ve y puede hacer solo lo que su rol permite; los permisos no son auto-asignables.
- **API primero** — el backend calcula y centraliza la lógica; el frontend solo consume y muestra.
- **Una sola base de código** — el mismo frontend Ionic sirve para Android, iOS y PWA sin duplicar desarrollo.
- **Spec antes que código** — ninguna feature se implementa sin su especificación aprobada (SDD).

## Qué NO es

- No es un sistema de chat en tiempo real.
- No integra directamente con el ERP Dobra Empresarial (por ahora).
- No reemplaza un sistema ITSM completo (JIRA, ServiceNow).
- No tiene reportes PDF/Excel en esta versión.
