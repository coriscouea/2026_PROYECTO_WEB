# 023 · Navegación, Estado y Formularios — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué navegación imperativa y no declarativa?
La navegación declarativa con `routerLink` no puede expresar lógica condicional. En HelpDesk Web tres casos requieren código: el destino tras login depende de `redirectUrl`, la navegación al detalle es respuesta a un `@Output`, y el logout con 401 dispara redirección desde el service.

### ¿Por qué `redirectUrl` como queryParam y no en localStorage?
Los queryParams son visibles en la URL y no requieren limpieza manual. Al hacer login con un `redirectUrl` válido, el guard automáticamente redirige y el parámetro desaparece de la URL.

### ¿Por qué tipo cerrado `EstadoRemoto<T>` y no variables separadas?
Variables separadas (`cargando`, `error`, `tickets`) permiten estados inválidos — es posible que `cargando = true` y `tickets` tenga datos simultáneamente. El tipo cerrado garantiza mutua exclusión en tiempo de compilación.

### ¿Por qué validación blur y no solo al enviar?
La validación solo al enviar produce una experiencia frustrante — el usuario completa el formulario y solo al final ve todos los errores. La validación blur informa inmediatamente al abandonar cada campo.

### ¿Por qué `@capacitor/preferences` para el borrador y no una variable de clase?
Una variable de clase se pierde al navegar hacia atrás porque el componente se destruye. Preferences persiste entre navegaciones sin importar el ciclo de vida del componente.

### ¿Por qué `ticketGuardado = true` antes de navegar?
`ionViewWillLeave` se dispara al navegar — sin la bandera, guarda el borrador incluso después de crearlo exitosamente. La bandera previene este efecto secundario.

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `app.routes.ts` | canActivate en todas las rutas protegidas, ruta comodín |
| `guards/auth-guard.ts` | redirectUrl en queryParams al redirigir |
| `login.page.ts` | Leer redirectUrl + ActivatedRoute |
| `crear-ticket.page.ts` | Validación blur, errores por campo, borrador, ticketGuardado |
| `crear-ticket.page.html` | Eventos blur, errores inline por campo |
| `tickets.page.ts` | EstadoRemoto<any[]>, SqliteService |

## Archivos creados

| Archivo | Descripción |
|---|---|
| `models/estado-remoto.ts` | Tipo cerrado con 4 casos mutuamente excluyentes |
