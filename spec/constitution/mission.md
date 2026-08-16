# Misión

Las empresas con múltiples sucursales gestionan sus requerimientos de soporte técnico mediante canales informales: correos, WhatsApp, llamadas telefónicas. Esto genera pérdida de trazabilidad, duplicación de esfuerzos, tiempos de respuesta inconsistentes y ausencia de métricas para la toma de decisiones.

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

## Servicios que cubre

- ERP Dobra — instalación, errores y mejoras
- Soporte técnico — equipos PC, impresoras, periféricos
- Redes — conectividad, navegación, configuración
- Actualizaciones de software

## Qué NO es

- No es un sistema de chat en tiempo real.
- No integra directamente con el ERP Dobra Empresarial (por ahora).
- No reemplaza un sistema ITSM completo (JIRA, ServiceNow).
- No tiene reportes PDF/Excel en esta versión.

## Autor

**César Risco** — Estudiante de 5to Semestre, Aplicaciones Móviles  
Universidad Estatal Amazónica, 2026