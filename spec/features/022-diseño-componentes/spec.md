# 022 · Sistema de Diseño y Componentes Reutilizables — Semana 10

**Estado:** implementado ✅
**Semana:** 10
**Tipo:** Frontend — Design System

---

## ¿Qué hace?

Define el sistema de tokens de diseño en 3 niveles y construye el catálogo de componentes reutilizables de la aplicación. Establece la base visual y de accesibilidad sobre la cual se ensamblan todas las pantallas.

---

## Tokens de diseño — 3 niveles en global.scss

### Nivel 1 — Primitivo
Valores puros sin significado asignado: `--primitive-blue-700`, `--primitive-navy-900`, etc.

### Nivel 2 — Semántico
La función que cada valor cumple: `--color-primary`, `--color-surface-dark`, `--color-text-secondary`, `--color-error`, etc.

### Nivel 3 — Componente
Uso concreto dentro de cada componente: `--card-bg`, `--badge-pending-bg`, `--header-bg`, `--badge-done-text`, etc.

### Categorías de tokens implementados
- **Color** — paleta completa con contraste WCAG AA verificado y corregido
- **Tipografía** — escala Material Design 3 (display → caption) en rem
- **Espaciado** — unidad base 8px, múltiplos del 1 al 12
- **Radio de esquina** — sm(8px) → full(9999px)
- **Sombra** — sm → xl + shadow-primary
- **Animaciones** — fast(100ms), normal(200ms), slow(300ms), easing-standard
- **Accesibilidad** — touch-target-min(48px), disabled-opacity(0.4)

---

## Componentes reutilizables — catálogo

### EstadoBadgeComponent
- Selector: `app-estado-badge`
- @Input: `estado: 'pendiente' | 'en_proceso' | 'finalizado'`
- @Input opcionales: `mostrarIcono`, `tamaño`
- Colores por tokens semánticos — WCAG AA garantizado

### EmptyStateComponent
- Selector: `app-empty-state`
- @Input: `icono`, `titulo`, `subtitulo`, `padding`
- ng-content para botón de acción personalizado

### LoadingStateComponent
- Selector: `app-loading-state`
- @Input: `cargando`, `mensaje`, `tipo`
- Envuelve a sus hijos — solo renderiza cuando `cargando = true`

### TicketCardComponent
- Selector: `app-ticket-card`
- @Input: `idTicket`, `titulo`, `estado`, `prioridad`, `categoriaLabel`, `fecha`
- @Input opcionales: `compacto`, `mostrarFecha`
- @Output: `cardClick: EventEmitter<number>`

### ErrorStateComponent
- Selector: `app-error-state`
- @Input: `error: ErrorTraducido`
- @Output: `reintentar`, `volver`

---

## ErrorService — traductor HTTP

| Código | Mensaje al usuario |
|---|---|
| 400 | Los datos enviados no son válidos |
| 401 | Tu sesión ha expirado |
| 403 | No tienes permiso para realizar esta acción |
| 404 | El elemento ya no existe |
| 409 | Ya existe un registro con esos datos |
| 422 | Hay errores en el formulario |
| 429 | Demasiados intentos. Espera 1 minuto |
| 500 | Error del servidor. Intenta de nuevo |
| 0 | Sin conexión a internet |

---

## Accesibilidad WCAG 2.2

- aria-label en todos los íconos interactivos sin texto visible
- aria-hidden="true" en íconos decorativos
- role="button" en divs clicables del sidebar
- Área táctil mínima 48px en botones de acción críticos

---

## Responsivo y Safe Area

| Punto de corte | Comportamiento |
|---|---|
| < 600px | Móvil: tarjetas apiladas, usuario-card en columna |
| 600 – 840px | Tablet: 2 columnas tarjetas |
| > 840px | PC: sidebar fijo |

Safe area: `env(safe-area-inset-*)` en header, content y footer.

---

## 4 estados implementados en bandeja

1. **cargando** — LoadingStateComponent con spinner
2. **exito(datos)** — lista de TicketCardComponent
3. **vacio** — EmptyStateComponent con acción sugerida
4. **error** — ErrorStateComponent con reintentar/volver

---

## Criterios de aceptación

- [x] Tokens en 3 niveles — ningún valor hardcodeado en componentes
- [x] 5 componentes reutilizables Angular standalone creados
- [x] Regla de 3 apariciones aplicada en la selección
- [x] aria-label en todos los elementos interactivos sin texto visible
- [x] Contraste WCAG AA verificado y corregido en 4 pares
- [x] Área táctil mínima 48px en botones críticos
- [x] Responsive verificado en Chrome DevTools
- [x] Safe area configurada en header/content/footer
- [x] ErrorService traduce todos los códigos HTTP relevantes
- [x] 4 estados implementados en tickets.page
