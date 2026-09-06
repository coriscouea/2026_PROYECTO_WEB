# 022 · Sistema de Diseño — Tasks

**Estado:** completado ✅

## Grupo A — Tokens de diseño
- [x] Tokens primitivos — colores base sin significado
- [x] Tokens semánticos — función que cumple cada valor
- [x] Tokens de componente — uso concreto en componentes
- [x] Escala tipográfica MD3 en rem (display → caption)
- [x] Sistema de espaciado base 8px
- [x] Radios de esquina sm(8px) → full(9999px)
- [x] Sombras escalonadas sm → xl + shadow-primary
- [x] Duraciones y easing estándar
- [x] Tokens de accesibilidad (touch-target-min: 48px, disabled-opacity: 0.4)
- [x] Verificar contraste WCAG AA en todos los pares
- [x] Corregir 4 pares que no cumplían AA
- [x] Aplicar tokens en los 10 archivos SCSS

## Grupo B — Componentes reutilizables
- [x] EstadoBadgeComponent — @Input estado obligatorio, colores por token
- [x] EmptyStateComponent — @Input icono/titulo obligatorios, ng-content para acción
- [x] LoadingStateComponent — @Input cargando obligatorio, tipo opcional
- [x] TicketCardComponent — 6 @Input obligatorios, @Output cardClick, ng-content
- [x] ErrorStateComponent — @Input error, @Output reintentar/volver
- [x] ErrorService — traduce 400/401/403/404/409/422/429/500/0
- [x] Ensamblar tickets.page con los 5 componentes del catálogo

## Grupo C — Accesibilidad
- [x] aria-label en botón notificaciones (con conteo dinámico)
- [x] aria-label en botón logout
- [x] aria-label en botón 🔑 cambiar contraseña (nombre del usuario)
- [x] aria-label en botón 🗑 desactivar usuario (nombre del usuario)
- [x] aria-label en botón enviar comentario
- [x] aria-label en botón marcar todas notificaciones
- [x] aria-label en botón crear nuevo ticket
- [x] aria-label en botón cerrar modal
- [x] role="button" en todos los nodos del sidebar árbol
- [x] aria-hidden="true" en íconos decorativos
- [x] Área táctil 48px en botones 🔑 y 🗑
- [x] Área táctil 48px en toggle mostrar/ocultar password
- [x] Área táctil 48px en segmento filtro

## Grupo D — Responsivo y Safe Area
- [x] Safe area en ion-header (padding-top)
- [x] Safe area en ion-content (padding-bottom)
- [x] Safe area en ion-menu ion-footer
- [x] Breakpoint 600px — tarjetas resumen 2 columnas en móvil
- [x] Breakpoint 600px — bienvenida apilada
- [x] Breakpoint 600px — usuario-card apilada
- [x] Breakpoint 900px — left-panel login oculto
- [x] Breakpoint 841px — sidebar fijo en PC
- [x] Orientación landscape ajustada

## Grupo E — Estados y feedback
- [x] 4 estados (cargando/datos/vacío/error) en tickets.page
- [x] Toast en tomar ticket
- [x] Toast en cambiar estado
- [x] Toast en enviar comentario
- [x] Toast en cambiar rol
- [x] Toast en atender solicitud reset
- [x] Toast en crear ticket exitoso
- [x] Toast en crear usuario
- [x] EmptyState con acción sugerida en bandeja activos
- [x] EmptyState en notificaciones, historial, comentarios

## Grupo F — Dashboard métricas
- [x] Rediseño dashboard estilo analytics (Opción B)
- [x] Hero KPI con total global
- [x] Stats 3 columnas con color semántico
- [x] Donut chart SVG con leyenda
- [x] Panel por técnico con avatares y barras
- [x] Búsqueda en tiempo real en tabla tickets
- [x] Endpoint /api/v1/metricas/resumen-global en backend
- [x] Fila "Sin asignar" en panel técnico
