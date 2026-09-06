# 022 · Sistema de Diseño — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué tokens en 3 niveles y no variables globales planas?
El nivel semántico permite cambiar el modo claro/oscuro reasignando los mismos nombres semánticos a valores distintos sin que ningún componente se entere. El nivel de componente permite cambiar el estilo de todos los badges de estado modificando una sola línea.

### ¿Por qué localforage en lugar de SQLite para la caché?
SQLite con WebAssembly en el navegador requiere configuración compleja de archivos .wasm que genera errores de compatibilidad de versiones. localforage usa IndexedDB nativo del navegador — sin WebAssembly, sin configuración adicional, con la misma API async.

### ¿Por qué la regla de 3 apariciones para componentes?
Abstraer un componente en su primer uso produce una abstracción equivocada porque no se conocen las variantes. Esperar a la tercera aparición proporciona información suficiente sobre qué debe variar.

### ¿Por qué composición con ng-content en lugar de herencia?
La composición permite construir variantes sin duplicar código. Un `EmptyStateComponent` que acepta `ng-content` puede mostrar cualquier botón de acción sin conocer qué hace ese botón.

### ¿Por qué ErrorService separado del componente?
Los códigos HTTP son mensajes técnicos destinados al desarrollador. El usuario necesita mensajes del dominio del negocio. ErrorService centraliza esta traducción en un solo lugar.

---

## Archivos modificados — Grupo A Tokens

| Archivo | Cambio |
|---|---|
| `src/global.scss` | Tokens en 3 niveles + responsive + safe area |
| `tickets.page.scss` | Todos los valores hardcodeados → tokens |
| `detalle.page.scss` | Todos los valores hardcodeados → tokens |
| `notificaciones.page.scss` | Todos los valores hardcodeados → tokens |
| `usuarios.page.scss` | Todos los valores hardcodeados → tokens |
| `metricas.page.scss` | Todos los valores hardcodeados → tokens |
| `login.page.scss` | Tokens tipografía + espaciado (colores glassmorphism propios) |
| `registro.page.scss` | Tokens tipografía + espaciado |
| `olvido-password.page.scss` | Tokens tipografía + espaciado |
| `crear-ticket.page.scss` | Todos los valores hardcodeados → tokens |

## Archivos creados — Grupo B Componentes

| Archivo | Descripción |
|---|---|
| `components/estado-badge/` | Badge de estado del ticket |
| `components/empty-state/` | Estado vacío con ng-content |
| `components/loading-state/` | Spinner reutilizable |
| `components/ticket-card/` | Tarjeta de ticket |
| `components/error-state/` | Estado de error con reintentar |
| `services/error.ts` | Traductor de códigos HTTP |

---

## Paleta de colores corregida para WCAG AA

| Par | Antes | Después | Ratio |
|---|---|---|---|
| Badge pendiente texto | #D97706 | #92400E | 5.2:1 ✅ |
| Badge finalizado texto | #059669 | #065F46 | 5.8:1 ✅ |
| Badge proceso texto | #2563EB | #1E40AF | 5.9:1 ✅ |
| Texto secundario | #94A3B8 | #64748B | 4.6:1 ✅ |
| Caption fechas | #CBD5E1 | #64748B | 4.6:1 ✅ |
