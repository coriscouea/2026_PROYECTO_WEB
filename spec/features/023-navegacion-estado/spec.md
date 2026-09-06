# 023 · Navegación, Manejo de Estado y Formularios — Semana 11

**Estado:** implementado ✅
**Semana:** 11
**Tipo:** Frontend — Navegación y Estado

---

## ¿Qué hace?

Implementa la navegación protegida con `canActivate`, el manejo de estado con tipo cerrado `EstadoRemoto<T>`, la validación avanzada de formularios con blur y errores por campo, y la preservación del borrador del formulario de creación de tickets.

---

## Mapa de rutas

| Ruta | Tipo | Guard |
|---|---|---|
| /login | Pública | — |
| /registro | Pública | — |
| /olvido-password | Pública | — |
| /tickets | Protegida | authGuard |
| /detalle/:id | Protegida | authGuard |
| /crear-ticket | Protegida | authGuard |
| /notificaciones | Protegida | authGuard |
| /usuarios | Protegida | authGuard |
| /metricas | Protegida | authGuard |
| /** (comodín) | → /login | — |

---

## Guard con redirectUrl

```typescript
// auth-guard.ts — conserva el destino pretendido
router.navigate(['/login'], {
  queryParams: { redirectUrl: state.url }
});

// login.page.ts — recupera y navega al destino
const redirectUrl = this.route.snapshot.queryParams['redirectUrl'] ?? '/tickets';
this.router.navigateByUrl(redirectUrl);
```

---

## Tipo cerrado EstadoRemoto

```typescript
export type EstadoRemoto<T> =
  | { tipo: 'cargando' }
  | { tipo: 'exito';   datos: T }
  | { tipo: 'vacio' }
  | { tipo: 'error';   mensaje: string; puedeReintentar: boolean };

// Constructores convenientes
EstadoRemoto.cargando()
EstadoRemoto.exito(datos)
EstadoRemoto.vacio()
EstadoRemoto.error(mensaje, puedeReintentar)
```

Garantiza mutua exclusión de estados — solo uno puede estar activo.

---

## Validación en crear-ticket

- Validación al perder el foco (blur): `validarTitulo()`, `validarDescripcion()`
- Validación al seleccionar: `validarCategoria()`, `validarPrioridad()`
- Validación completa al enviar
- Errores 422 del backend mapeados al campo específico
- Botón deshabilitado hasta que todos los campos sean válidos

---

## Borrador del formulario

```
ionViewWillLeave → si !ticketGuardado → guardarBorrador() en Preferences
ionViewWillEnter → restaurarBorrador() desde Preferences
crearTicket() exitoso → ticketGuardado = true → limpiarBorrador() → navegar
```

---

## Tratamiento diferencial 401 vs 403

| Código | Significado | Acción |
|---|---|---|
| 401 | Token expirado | logout() + redirect /login con redirectUrl |
| 403 | Sin permiso | Toast de error, permanece en la pantalla |

---

## Criterios de aceptación

- [x] Todas las rutas protegidas tienen canActivate: [authGuard]
- [x] Ruta comodín /** redirige a /login
- [x] Guard conserva redirectUrl al redirigir
- [x] Login navega al redirectUrl tras autenticación
- [x] EstadoRemoto<any[]> implementado en tickets.page
- [x] Validación blur en título y descripción de crear-ticket
- [x] Errores 422 mapeados a campos individuales
- [x] Borrador conservado al navegar hacia atrás
- [x] Borrador limpio al crear ticket exitosamente
- [x] ticketGuardado previene doble guardado en ionViewWillLeave
- [x] 401 hace logout automático, 403 muestra toast
