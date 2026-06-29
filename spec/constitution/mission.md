# mission.md — HelpDesk Web

## Qué construimos

HelpDesk Web es una aplicación móvil PWA para centralizar y formalizar
los requerimientos de soporte técnico de una empresa con múltiples
sucursales en Ecuador, reemplazando los canales informales (correo,
WhatsApp, comunicación verbal) por un sistema estructurado de tickets.

## Para quién

| Rol           | Descripción                                                      |
|---------------|------------------------------------------------------------------|
| usuario       | Empleado que registra requerimientos técnicos                    |
| tecnico       | Técnico especializado que atiende tickets de categoría Técnica y Redes |
| mesa_ayuda    | Agente que atiende tickets de categoría ERP (Dobra Empresarial)  |
| admin         | Administrador del sistema, gestiona usuarios y roles             |

## Problema que resuelve

- Requerimientos perdidos por canales informales
- Falta de trazabilidad en la atención de incidencias
- Imposibilidad de medir tiempos de respuesta
- Sin visibilidad del estado de cada caso

## Funcionalidades principales

1. Registro de tickets con categoría (Técnica, Redes, ERP) y prioridad
2. Bandeja compartida por rol — el primer disponible toma el ticket
3. Seguimiento de estado: pendiente → en_proceso → finalizado
4. Historial de cambios de estado con trazabilidad completa
5. Notificaciones automáticas al asignar o cambiar estado
6. Métricas básicas: tiempo de resolución, tickets por categoría/sucursal

## Lo que NO hace (por ahora)

- Asignación automática por carga de trabajo (versión futura)
- Integración directa con Dobra Empresarial (versión futura)
- Chat en tiempo real entre usuario y técnico (versión futura)
