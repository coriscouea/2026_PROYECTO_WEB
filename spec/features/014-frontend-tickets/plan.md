# 014 · Frontend Tickets — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué dashboard diferente por rol?
Cada rol tiene necesidades distintas. Un usuario quiere ver solo sus tickets. Un técnico necesita ver sus asignados y los disponibles para tomar. Un admin necesita métricas globales. Un dashboard genérico sería ineficiente para todos.

### ¿Por qué sidebar árbol en lugar de tabs?
El árbol permite navegación por 3 niveles (filtro → estado → prioridad) con una sola pantalla. Los tabs solo permiten un nivel. El árbol es más eficiente para un sistema de tickets con múltiples dimensiones de filtrado.

### ¿Por qué estilos del sidebar en global.scss y no en app.component.scss?
Ionic renderiza `ion-menu` fuera del shadow DOM del componente. Los estilos de `app.component.scss` no penetran el shadow DOM. Solo `global.scss` aplica correctamente a `ion-menu`.

### ¿Por qué `ion-footer` para el perfil del sidebar?
`position: absolute` no funciona correctamente con `ion-content` en Ionic — el scroll interfiere. `ion-footer` está fuera del flujo del scroll y siempre se muestra al fondo.

### ¿Por qué filtro en el frontend y no en el backend?
El backend ya filtra por rol. El filtro adicional por estado y prioridad desde el sidebar se aplica en el frontend sobre los datos ya cargados. Esto evita una petición extra al backend por cada clic en el árbol.

---

## Componentes y servicios

| Archivo | Responsabilidad |
|---|---|
| `app.component.html` | Sidebar árbol de navegación |
| `app.component.ts` | Lógica sidebar, rol, filtros |
| `global.scss` | Estilos globales del sidebar |
| `tickets.page.*` | Dashboard + bandeja |
| `detalle.page.*` | Detalle + historial + comentarios |
| `crear-ticket.page.*` | Formulario nuevo ticket |
| `notificaciones.page.*` | Lista notificaciones |
| `usuarios.page.*` | Gestión admin |
| `metricas.page.*` | Dashboard métricas |
| `services/ticket.ts` | CRUD tickets, historial, comentarios |
| `services/notificacion.ts` | Listar, conteo, marcar leída |
| `services/usuario.ts` | CRUD usuarios, solicitudes |
| `services/metricas.ts` | Resumen, por categoría, técnico |

---

## Paleta de colores

| Elemento | Color |
|---|---|
| Header | #0D1B2A |
| Sidebar | #0D1B2A |
| Fondo contenido | #F0F4F8 |
| Tarjetas | #FFFFFF |
| Borde alta | #EF4444 |
| Borde media | #F59E0B |
| Borde baja | #10B981 |
| Badge pendiente | #FEF3C7 / #D97706 |
| Badge en_proceso | #DBEAFE / #2563EB |
| Badge finalizado | #D1FAE5 / #059669 |
