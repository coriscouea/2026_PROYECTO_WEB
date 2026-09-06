# 023 · Navegación, Estado y Formularios — Tasks

**Estado:** completado ✅

## Grupo A — Rutas y navegación
- [x] Agregar canActivate: [authGuard] en /tickets
- [x] Agregar canActivate: [authGuard] en /detalle/:id
- [x] Agregar canActivate: [authGuard] en /crear-ticket
- [x] Agregar canActivate: [authGuard] en /notificaciones
- [x] Agregar canActivate: [authGuard] en /usuarios
- [x] Agregar canActivate: [authGuard] en /metricas
- [x] Agregar ruta comodín /** → /login
- [x] Actualizar auth-guard.ts para incluir redirectUrl en queryParams
- [x] Actualizar login.page.ts para leer redirectUrl con ActivatedRoute
- [x] Verificar flujo completo: login → destino → logout → guard → login → destino

## Grupo B — EstadoRemoto
- [x] Crear models/estado-remoto.ts con tipo cerrado de 4 casos
- [x] Crear constructores: cargando(), exito(datos), vacio(), error(mensaje, puedeReintentar)
- [x] Implementar estadoTickets: EstadoRemoto<any[]> en tickets.page.ts
- [x] Reemplazar variables cargando, errorActual, tickets por estadoTickets
- [x] Actualizar tickets.page.html para usar estadoTickets.tipo
- [x] Conectar LoadingStateComponent con estadoTickets.tipo === 'cargando'
- [x] Conectar ErrorStateComponent con estadoTickets.tipo === 'error'
- [x] Conectar TicketCardComponent con estadoTickets.datos
- [x] Conectar EmptyStateComponent con estadoTickets.tipo === 'vacio'
- [x] Corregir contador de tickets para usar estadoTickets.datos.length

## Grupo C — Validación crear-ticket
- [x] Agregar errores: Record<string, string> por campo
- [x] Agregar tocados: Record<string, boolean> por campo
- [x] Implementar validarTitulo() con reglas min 5 / max 150
- [x] Implementar validarDescripcion() con regla min 10
- [x] Implementar validarCategoria()
- [x] Implementar validarPrioridad()
- [x] Implementar formularioValido() para habilitar botón
- [x] Agregar (blur)="validarTitulo()" en input título
- [x] Agregar (blur)="validarDescripcion()" en textarea descripción
- [x] Agregar validarCategoria() en (click) de cada opción de categoría
- [x] Agregar validarPrioridad() en (click) de cada opción de prioridad
- [x] Mostrar error individual debajo de cada campo
- [x] Mapear errores 422 del backend al campo correspondiente
- [x] Validar todos los campos al enviar antes de POST

## Grupo D — Borrador del formulario
- [x] Agregar propiedad private ticketGuardado: boolean = false
- [x] Implementar guardarBorrador() en Preferences con clave crear_ticket_draft
- [x] Implementar restaurarBorrador() leyendo de Preferences
- [x] Implementar limpiarBorrador() removiendo de Preferences
- [x] Implementar ionViewWillEnter() → restaurarBorrador()
- [x] Implementar ionViewWillLeave() → guardarBorrador() solo si !ticketGuardado
- [x] En crearTicket() exitoso: ticketGuardado = true → limpiarBorrador() → navegar
- [x] Verificar que borrador se conserva al volver con botón atrás
- [x] Verificar que borrador se limpia al crear ticket exitosamente
