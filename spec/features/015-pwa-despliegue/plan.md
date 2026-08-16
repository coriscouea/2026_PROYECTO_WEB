# 015 · PWA y Despliegue — Plan

**Estado:** implementado ✅

---

## Decisiones técnicas

### ¿Por qué PWA en lugar de APK nativo?
- Un APK nativo requiere Android Studio (8GB), compilación, firma del APK y distribución manual
- Una PWA es instalable directamente desde el navegador sin tienda de aplicaciones
- Para el contexto universitario y empresarial local, la PWA es más práctica y rápida de distribuir
- El mismo código funciona en PC, Android e iOS sin modificaciones

### ¿Por qué npx serve con flag -s?
- El flag `-s` significa "single page app" — redirige todas las rutas al `index.html`
- Sin este flag, navegar directamente a `/tickets` devuelve 404
- Angular usa rutas del lado del cliente que el servidor no conoce

### ¿Por qué puerto 8081 en lugar de 8080?
- XAMPP/Apache ocupa el puerto 8080 en el equipo de desarrollo
- El puerto 8081 evita conflictos con otros servicios locales

### ¿Por qué 10.0.2.2 para el emulador Android?
- El emulador Android usa una red virtual separada
- `localhost` dentro del emulador apunta al propio emulador, no a la computadora
- `10.0.2.2` es la dirección especial que el emulador reserva para acceder al host

### ¿Por qué script .bat con PowerShell en lugar de cmd?
- PowerShell maneja mejor rutas con espacios y variables de entorno
- `venv\Scripts\Activate.ps1` es el activador correcto para PowerShell
- cmd tiene problemas con rutas largas en Windows

---

## Proceso de build

```bash
# 1. Build de producción
ionic build --prod

# 2. Verificar que www/ se generó correctamente
ls www/

# 3. Servir la PWA
npx serve www -s -p 8081

# 4. Probar en navegador
# http://localhost:8081

# 5. Probar en emulador (Chrome del emulador)
# http://10.0.2.2:8081
```

---

## angular.json — Budget ajustado

Se aumentó el budget de CSS por componente para permitir estilos más ricos:

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "6kb",
  "maximumError": "10kb"
}
```
