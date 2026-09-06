# 024 · Persistencia Offline y Almacenamiento Seguro — Tasks

**Estado:** completado ✅

## Grupo A — Almacenamiento seguro de tokens
- [x] Instalar capacitor-secure-storage-plugin
- [x] Actualizar auth.ts — login guarda tokens en SecureStorage
- [x] Actualizar auth.ts — getToken() lee desde SecureStorage
- [x] Actualizar auth.ts — logout() limpia SecureStorage + Preferences + borrador
- [x] Verificar que access_token ya no aparece en @capacitor/preferences
- [x] Verificar que login funciona correctamente con nuevo almacenamiento
- [x] Verificar que guard sigue funcionando (isAuthenticated usa getToken)
- [x] Verificar flujo completo login → bandeja → logout → login

## Grupo B — Caché local de tickets
- [x] Instalar localforage
- [x] Instalar @capacitor/network
- [x] Crear services/sqlite.ts con SqliteService usando localforage
- [x] Implementar inicializar() → localforage.ready()
- [x] Implementar guardarTickets() con esquema desnormalizado
- [x] Implementar leerTickets(filtro) con filtrado por activo/inactivo
- [x] Implementar obtenerUltimaSync() con timestamp ISO
- [x] Implementar tieneDatos() para verificar si hay caché
- [x] Implementar cacheExpirada() con umbral de 24 horas
- [x] Implementar limpiarCacheCompleta() para logout seguro
- [x] Integrar SqliteService en tickets.page.ts
- [x] Integrar @capacitor/network en tickets.page.ts

## Grupo C — Lectura offline e indicador de sincronización
- [x] cargarTickets() lee caché primero antes de llamar al backend
- [x] Si hay caché → mostrar inmediatamente (sin pantalla vacía)
- [x] Network.getStatus() verifica conectividad antes del fetch
- [x] Si offline y hay caché → mantener datos locales
- [x] Si offline y sin caché → EstadoRemoto.vacio()
- [x] Toast "Sin conexión — mostrando datos locales" en modo offline
- [x] Si online → actualizar backend → guardar en caché → actualizar UI
- [x] Si error de red con caché → toast advertencia (no error bloqueante)
- [x] Propiedad ultimaSync en tickets.page.ts
- [x] Agregar indicador sync en tickets.page.html
- [x] Agregar estilos .sync-indicator y .sync-offline en tickets.page.scss
- [x] Agregar íconos cloudDoneOutline, cloudOfflineOutline
- [x] cerrarSesion() llama limpiarCacheCompleta() antes del logout

## Grupo D — Prueba modo avión + documentación
- [x] Probar con WiFi activo en emulador Android — tickets cargan y se guardan en caché
- [x] Probar sin WiFi en emulador Android — tickets cargan desde caché
- [x] Verificar indicador "Actualizado HH:mm" con WiFi activo
- [x] Verificar indicador "Sin sincronizar" sin WiFi
- [x] Verificar toast "Sin conexión — mostrando datos locales"
- [x] Verificar que pantalla nunca aparece vacía cuando hay caché
- [x] Documentar datos almacenados, finalidad y duración (LOPDP)
- [x] Actualizar spec, plan y tasks de la feature
