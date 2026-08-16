# 014 · Frontend Tickets

**Estado:** implementado ✅  
**Semana:** 9  
**Tipo:** Frontend

---

## ¿Qué hace?

Conjunto de pantallas para la gestión completa de tickets en Ionic Angular. Dashboard personalizado por rol con tarjetas de resumen, sidebar árbol de navegación, detalle con historial y comentarios, gestión de usuarios y dashboard de métricas.

---

## Pantallas

### Bandeja de tickets (`/tickets`)
Dashboard principal personalizado por rol:
- Bienvenida con nombre del usuario y subtítulo por rol
- 4 tarjetas resumen: Total / Pendientes / En proceso / Finalizados
- Filtros: Activos / Todos / Inactivos
- Lista de tarjetas con borde izquierdo por prioridad (rojo/amarillo/verde)
- Badge de notificaciones en el header
- Botón "+ Nuevo Ticket"
- Clic en tarjeta navega al detalle

**Dashboard por rol:**

| Rol | Título | Subtítulo |
|---|---|---|
| usuario | Mis Tickets | Panel de seguimiento de tus tickets |
| tecnico | Bandeja Técnica | Panel de trabajo técnico |
| mesa_ayuda | Bandeja ERP | Panel de soporte ERP |
| admin | Todos los Tickets | Panel de administración del sistema |

### Detalle del ticket (`/detalle/:id`)
- Información completa: título, descripción, badges estado/categoría/prioridad
- Metadata: fecha creación, técnico asignado, fecha actualización
- Acciones por rol:
  - Tomar ticket (si sin técnico asignado)
  - Iniciar / Finalizar (según transición válida)
  - Desactivar (solo admin, con confirmación)
- Línea de tiempo del historial con íconos por tipo de evento
- Sección de comentarios ordenados ASC
- Campo de texto para agregar comentario
- Tickets inactivos: muestra aviso + solo historial

### Crear ticket (`/crear-ticket`)
- Campos: título (max 150), descripción, categoría, prioridad
- Selector visual de categoría (Técnica/Redes/ERP)
- Selector visual de prioridad (Baja/Media/Alta con emojis)
- Validación antes de enviar

### Notificaciones (`/notificaciones`)
- Lista con indicador de no leída (punto azul + borde)
- Badge en header con conteo de no leídas
- Clic en notificación: marca leída + navega al ticket
- Botón ✓✓ para marcar todas como leídas
- Estado vacío cuando no hay notificaciones

### Gestión de usuarios (`/usuarios`) — solo admin
- Lista con avatar coloreado por rol
- Botón + para crear nuevo usuario con modal
- Modal crear: nombre, email, password, rol con validaciones
- Selector de rol en cada tarjeta (cambia en tiempo real)
- Botón 🔑 para cambiar contraseña con mini modal
- Botón 🗑 para desactivar usuario con confirmación
- Sección de solicitudes de reset pendientes (amarilla)
- Botón "Atender" con mensaje recordatorio WhatsApp

### Dashboard métricas (`/metricas`) — solo admin
- Tarjetas resumen 2x2: Pendientes / En proceso / Finalizados / Total
- Tiempo promedio de resolución en horas
- Barras por categoría (azul)
- Barras por técnico (morado)
- Estado vacío cuando no hay técnicos asignados

---

## Sidebar árbol de navegación

```
⚡ HelpDesk Web
├── 📂 Activos
│   ├── 🕐 Pendiente → Alta / Media / Baja
│   ├── ▶ En proceso → Alta / Media / Baja
│   └── ✅ Finalizado → Alta / Media / Baja
├── 🗂 Inactivos
├── ☰ Todos los tickets
├── ─── solo admin ───
├── 👥 Gestión de usuarios
└── 📊 Dashboard
─────────────────────────
👤 Nombre del usuario
   email@empresa.com
   🔧 Rol
```

---

## Criterios de aceptación

- [x] Dashboard muestra título y subtítulo personalizado por rol
- [x] Tarjetas resumen con conteos correctos
- [x] Filtro activos/inactivos/todos conectado al backend
- [x] Sidebar árbol con 3 niveles: estado → prioridad
- [x] Sidebar muestra Gestión y Dashboard solo para admin
- [x] Perfil del usuario en footer del sidebar
- [x] Badge de notificaciones actualizado en cada visita
- [x] Detalle muestra historial como línea de tiempo
- [x] Comentarios con campo de texto funcional
- [x] Tomar ticket solo si no tiene técnico asignado
- [x] Transiciones de estado correctas: pendiente → en_proceso → finalizado
- [x] Desactivar ticket solo para admin con confirmación
- [x] Tickets inactivos muestran historial aunque estén desactivados
- [x] Crear usuario con modal y validaciones
- [x] Cambiar contraseña con mini modal y mensaje WhatsApp
- [x] Solicitudes de reset visibles en panel admin
