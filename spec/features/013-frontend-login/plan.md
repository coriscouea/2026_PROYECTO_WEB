# 013 · Frontend Login — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué Capacitor Preferences para los tokens?
- Almacenamiento seguro nativo en Android e iOS
- No expone tokens en localStorage (vulnerable a XSS)
- API async consistente en todas las plataformas

### ¿Por qué inputs nativos HTML en lugar de ion-input?
- Los `ion-input` aplican fondo blanco en autorrelleno del navegador que no se puede sobrescribir
- Los inputs nativos permiten el fix de autorrelleno con `-webkit-box-shadow`
- Mayor control sobre el estilo

### ¿Por qué diseño dividido estilo Pichincha?
- Diseño profesional reconocible en el contexto empresarial
- Panel izquierdo contextualiza los servicios — el usuario sabe qué sistema es
- Panel derecho enfocado en el formulario — menos distracciones

### ¿Por qué tabla solicitudes_reset y no notificaciones?
- La tabla `notificaciones` tiene `id_ticket NOT NULL` — FK constraint
- Usar notificaciones requeriría un ticket falso — incorrecto
- Tabla separada es más limpia, escalable y semánticamente correcta

---

## Componentes implementados

| Archivo | Responsabilidad |
|---|---|
| `login.page.html` | Template dividido con paneles |
| `login.page.ts` | Lógica login, toggle password, navegación |
| `login.page.scss` | Estilos glassmorphism, responsive móvil |
| `registro.page.html` | Template con validaciones en tiempo real |
| `registro.page.ts` | Lógica validación, fortaleza, registro |
| `registro.page.scss` | Estilos con estados válido/inválido |
| `olvido-password.page.html` | Template solicitud reset |
| `olvido-password.page.ts` | Lógica solicitud, manejo 429 |
| `olvido-password.page.scss` | Estilos tarjeta centrada |
| `auth.guard.ts` | Protección de rutas |
| `services/auth.ts` | login, logout, getToken, getRol, getNombre, getEmail, obtenerPerfil |

---

## Paleta de colores

| Elemento | Color |
|---|---|
| Fondo login | #E8EDF2 |
| Panel izquierdo | #0D1B2A → #1B3A5C |
| Tarjeta formulario | #F8FAFC |
| Botón primario | #0288D1 → #4FC3F7 |
| Error | #EF4444 |
| Éxito | #10B981 |
