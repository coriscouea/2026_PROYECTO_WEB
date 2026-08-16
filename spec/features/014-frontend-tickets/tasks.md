# 014 · Frontend Tickets — Tasks

**Estado:** completado ✅

---

## Tasks completadas

### Servicios
- [x] Crear `services/ticket.ts` con Axios
- [x] Implementar listarTickets(filtro, page, limit)
- [x] Implementar obtenerTicket(id)
- [x] Implementar crearTicket(datos)
- [x] Implementar actualizarTicket(id, datos)
- [x] Implementar desactivarTicket(id)
- [x] Implementar listarHistorial(id)
- [x] Implementar listarComentarios(id)
- [x] Implementar crearComentario(id, texto)
- [x] Crear `services/notificacion.ts`
- [x] Implementar listarNotificaciones()
- [x] Implementar conteoNoLeidas()
- [x] Implementar marcarLeida(id)
- [x] Implementar marcarTodasLeidas()
- [x] Crear `services/usuario.ts`
- [x] Implementar listarUsuarios()
- [x] Implementar crearUsuario(datos)
- [x] Implementar actualizarUsuario(id, datos)
- [x] Implementar desactivarUsuario(id)
- [x] Implementar listarSolicitudes()
- [x] Implementar atenderSolicitud(id)
- [x] Crear `services/metricas.ts`
- [x] Implementar obtenerResumen()
- [x] Implementar obtenerPorCategoria()
- [x] Implementar obtenerPorTecnico()
- [x] Implementar obtenerTiempoResolucion()

### Sidebar árbol de navegación
- [x] Crear sidebar en app.component.html con ion-menu
- [x] Nodo raíz Activos con toggle expand/collapse
- [x] Subnodos Pendiente, En proceso, Finalizado con toggle
- [x] Hojas Alta, Media, Baja que filtran al hacer clic
- [x] Nodos Inactivos y Todos directos (sin subnodos)
- [x] Sección admin con Gestión de usuarios y Dashboard
- [x] Perfil usuario en ion-footer del sidebar
- [x] Estilos en global.scss (no en app.component.scss)
- [x] Actualización de rol en NavigationEnd

### Bandeja de tickets
- [x] Header con logo ⚡, título dinámico, badge notificaciones, logout
- [x] Bienvenida con nombre del usuario y subtítulo por rol
- [x] 4 tarjetas resumen clicables que filtran la lista
- [x] Segmento filtro activos/todos/inactivos
- [x] Lista de tarjetas con borde por prioridad
- [x] Contador de tickets encontrados
- [x] Estado vacío cuando no hay tickets
- [x] Leer queryParams del sidebar para filtrar
- [x] Botón "+ Nuevo Ticket" en header
- [x] Fix "En_proceso" → "En proceso" con .replace('_', ' ')

### Detalle del ticket
- [x] Header con botón volver y número del ticket
- [x] Badges de estado, categoría y prioridad
- [x] Descripción y metadata (creado, técnico, actualizado)
- [x] Botón "Tomar ticket" condicional
- [x] Botón estado con transición correcta
- [x] Botón "Desactivar ticket" solo admin
- [x] Historial como línea de tiempo con íconos por tipo
- [x] Lista de comentarios ordenados ASC
- [x] Campo de texto para agregar comentario
- [x] Estado especial para tickets inactivos

### Gestión de usuarios
- [x] Lista con avatar coloreado por rol (A/T/M/U inicial)
- [x] Modal crear usuario con validaciones
- [x] Selector rol en línea con cambio inmediato
- [x] Mini modal 🔑 cambio contraseña
- [x] Botón desactivar con confirmación
- [x] Sección solicitudes reset pendientes en amarillo
- [x] Botón "Atender" con alert recordatorio

### Dashboard métricas
- [x] Grid 2x2 de tarjetas resumen
- [x] Tarjeta tiempo promedio con número grande
- [x] Barras por categoría con porcentaje dinámico
- [x] Barras por técnico con color diferente
- [x] Estado vacío para técnicos sin asignaciones

### Notificaciones
- [x] Lista con indicador punto azul para no leídas
- [x] Borde azul en notificaciones no leídas
- [x] Clic: marca leída + navega al ticket
- [x] Botón ✓✓ marcar todas
- [x] Badge en header actualizado en cada visita
- [x] Estado vacío con ícono

### Crear ticket
- [x] Campo título con contador de caracteres
- [x] Campo descripción textarea
- [x] Selector visual de categoría
- [x] Selector visual de prioridad con emojis
- [x] Validación y envío al backend
