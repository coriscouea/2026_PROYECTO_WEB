# 015 · PWA y Despliegue

**Estado:** implementado ✅  
**Semana:** 9  
**Tipo:** Infraestructura / Despliegue

---

## ¿Qué hace?

Compilación de producción de la app Ionic como PWA (Progressive Web App) instalable. Probada en PC (Edge), emulador Android (API 37.1) y dispositivo físico Android vía WiFi. Script de arranque automático para demostración.

---

## Plataformas

| Plataforma | Estado | Método |
|---|---|---|
| PC — Chrome/Edge | ✅ Instalable | npx serve www -s -p 8081 |
| Android emulador | ✅ Funcional | Chrome en emulador API 37.1 |
| Android físico | ✅ Funcional | Chrome vía WiFi 192.168.1.12 |
| iOS | ⚠️ Simulado | Chrome DevTools iPhone 14 |

---

## Configuración PWA

### manifest.webmanifest
```json
{
  "name": "HelpDesk Web",
  "short_name": "HelpDesk",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D1B2A",
  "theme_color": "#0288D1"
}
```

### Variables de entorno por destino
```typescript
// environment.ts — desarrollo
apiUrl: 'http://127.0.0.1:8000'

// environment.prod.ts — producción
apiUrl: 'http://192.168.1.12:8000'
```

### CORS por destino
```env
CORS_ORIGINS=http://localhost:8100,http://localhost:8081,
             http://192.168.1.12:8081,http://10.0.2.2:8081
```

---

## Direcciones por destino

| Destino | Frontend | Backend |
|---|---|---|
| PC desarrollo | http://localhost:8100 | http://localhost:8000 |
| PC producción | http://localhost:8081 | http://localhost:8000 |
| Android emulador | http://10.0.2.2:8081 | http://10.0.2.2:8000 |
| Android físico | http://192.168.1.12:8081 | http://192.168.1.12:8000 |

---

## Limitaciones documentadas

### iOS requiere macOS
**Problema:** Capacitor compila para iOS solo en macOS con Xcode.  
**Estrategia:** Chrome DevTools con perfil iPhone 14 para verificar responsive.

### Firewall en red local
**Problema:** Windows Firewall y router bloquean tráfico entre dispositivos.  
**Estrategia:** Reglas específicas de firewall para puertos 8000 y 8081.

### HTTP sin cifrar
**Problema:** Android/iOS bloquean HTTP en producción real.  
**Estrategia:** Configuración acotada solo para hosts de desarrollo. Producción real requiere HTTPS.

---

## Criterios de aceptación

- [x] ionic build --prod genera www/ sin errores
- [x] manifest.webmanifest configurado con nombre y colores
- [x] Título "HelpDesk Web" en la pestaña del navegador
- [x] PWA instalable en PC desde Edge
- [x] PWA accesible en emulador Android API 37.1
- [x] PWA accesible en Android físico vía WiFi
- [x] environment.prod.ts apunta a IP de la computadora
- [x] CORS configurado para todos los orígenes de destino
- [x] Script iniciar_helpdesk.bat arranca todo con doble clic
- [x] Firewall configurado para puertos 8000 y 8081
