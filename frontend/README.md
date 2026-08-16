# HelpDesk Web — Frontend

Cliente multiplataforma PWA construido con Ionic + Capacitor + Angular.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Ionic Framework | 8.8.17 | Componentes UI móvil |
| Capacitor | 8.5.0 | Acceso a APIs nativas |
| Angular | 20.x | Framework JS |
| Angular CLI | 20.3.28 | Build y generación |
| Ionic CLI | 7.2.1 | Serve, build, doctor |
| TypeScript | — | Tipado estático |
| Axios | — | HTTP Client |
| @capacitor/preferences | — | Almacenamiento seguro JWT |
| Ionicons | — | Íconos |
| Node.js | v24.14.0 | Runtime |
| npm | 11.9.0 | Gestión de paquetes |

---

## Estructura

```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/              # Login dividido estilo Pichincha
│   │   │   ├── registro/           # Registro con validaciones UX
│   │   │   ├── olvido-password/    # Solicitud reset contraseña
│   │   │   ├── tickets/            # Dashboard por rol + bandeja
│   │   │   ├── detalle/            # Detalle ticket + historial + comentarios
│   │   │   ├── crear-ticket/       # Formulario nuevo ticket
│   │   │   ├── notificaciones/     # Lista con badge
│   │   │   ├── usuarios/           # Gestión admin (solo admin)
│   │   │   └── metricas/           # Dashboard métricas (solo admin)
│   │   ├── services/
│   │   │   ├── auth.ts             # login, logout, getToken, getRol, getNombre
│   │   │   ├── ticket.ts           # CRUD tickets, historial, comentarios
│   │   │   ├── notificacion.ts     # listar, conteo, marcar leída
│   │   │   ├── usuario.ts          # CRUD usuarios, solicitudes reset
│   │   │   └── metricas.ts         # resumen, por categoría, por técnico
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # Redirige a /login si no hay token
│   │   ├── app.component.html      # Sidebar árbol de navegación
│   │   ├── app.component.ts        # Lógica del sidebar
│   │   └── app.routes.ts           # Rutas con lazy loading
│   ├── environments/
│   │   ├── environment.ts          # apiUrl: localhost (desarrollo)
│   │   └── environment.prod.ts     # apiUrl: IP red local (producción)
│   ├── global.scss                 # Estilos globales del sidebar
│   ├── index.html                  # Título: HelpDesk Web
│   └── manifest.webmanifest        # Configuración PWA
├── www/                            # Build de producción (generado)
└── angular.json                    # Configuración Angular
```

---

## Instalación

```bash
cd frontend
npm install
```

---

## Variables de entorno

```typescript
// src/environments/environment.ts — desarrollo
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000'
};

// src/environments/environment.prod.ts — producción
export const environment = {
  production: true,
  apiUrl: 'http://192.168.1.12:8000'   // IP de la computadora en la red local
};
```

---

## Comandos

```bash
# Desarrollo con recarga en caliente
ionic serve
# → http://localhost:8100

# Diagnóstico del entorno
ionic info

# Build de producción
ionic build --prod
# → genera carpeta www/

# Servir PWA de producción
npx serve www -s -p 8081
# → http://localhost:8081
# → http://192.168.1.12:8081 (Android físico)
# → http://10.0.2.2:8081 (emulador Android)
```

---

## Destinos de ejecución

| Destino | URL | Método |
|---|---|---|
| Navegador desarrollo | http://localhost:8100 | ionic serve |
| PC producción | http://localhost:8081 | npx serve www |
| Android emulador | http://10.0.2.2:8081 | Chrome en emulador |
| Android físico | http://192.168.1.12:8081 | Chrome en dispositivo |
| iOS | Chrome DevTools iPhone 14 | Simulación responsive |

---

## Pantallas implementadas

### Login (`/login`)
- Diseño dividido estilo Pichincha
- Panel izquierdo: servicios que cubre HelpDesk + autor
- Panel derecho: formulario email/password
- Checkbox "Mantener sesión"
- Enter en contraseña ejecuta login
- Links: ¿Olvidaste tu contraseña? + ¿Usuario nuevo?

### Registro (`/registro`)
- Validaciones en tiempo real por campo
- Barra de fortaleza de contraseña (Débil/Media/Fuerte)
- Confirmación de contraseña
- Redirige al login tras registro exitoso

### Olvido de contraseña (`/olvido-password`)
- Campo email con validación
- Rate limiting 3/min
- Mensaje de éxito explicando flujo por WhatsApp Mesa de Ayuda

### Bandeja de tickets (`/tickets`)
- Bienvenida con nombre del usuario
- Subtítulo personalizado por rol
- Tarjetas resumen: Total / Pendientes / En proceso / Finalizados
- Filtros: Activos / Todos / Inactivos
- Lista de tarjetas con borde por prioridad
- Botón "+ Nuevo Ticket"
- Sidebar árbol de navegación

### Detalle del ticket (`/detalle/:id`)
- Información completa del ticket
- Badges de estado, categoría y prioridad
- Acciones por rol: Tomar / Iniciar / Finalizar / Desactivar
- Línea de tiempo del historial
- Comentarios con campo de texto

### Crear ticket (`/crear-ticket`)
- Campos: título, descripción, categoría, prioridad
- Validación antes de enviar

### Notificaciones (`/notificaciones`)
- Lista con indicador de no leída
- Badge en el header con conteo
- Marcar individual o todas como leídas
- Navega al ticket al hacer clic

### Gestión de usuarios (`/usuarios`) — solo admin
- Lista con avatar coloreado por rol
- Botón + para crear nuevo usuario con modal
- Selector de rol en cada tarjeta
- Botón 🔑 para cambiar contraseña
- Botón 🗑 para desactivar usuario
- Sección de solicitudes de reset pendientes

### Dashboard métricas (`/metricas`) — solo admin
- Tarjetas: Pendientes / En proceso / Finalizados / Total
- Tiempo promedio de resolución en horas
- Barras por categoría y por técnico

---

## Sidebar árbol de navegación

```
⚡ HelpDesk Web
├── 📂 Activos
│   ├── 🕐 Pendiente
│   │   ├── 🔴 Alta
│   │   ├── 🟡 Media
│   │   └── 🟢 Baja
│   ├── ▶ En proceso
│   │   ├── 🔴 Alta
│   │   ├── 🟡 Media
│   │   └── 🟢 Baja
│   └── ✅ Finalizado
│       ├── 🔴 Alta
│       ├── 🟡 Media
│       └── 🟢 Baja
├── 🗂 Inactivos
├── ☰ Todos los tickets
├── ─────────────── (solo admin)
├── 👥 Gestión de usuarios
└── 📊 Dashboard
─────────────────────────
👤 César Risco
   co.riscop@uea.edu.ec
   🔧 Técnico
```

---

## Paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Fondo oscuro | #0D1B2A | Header, sidebar |
| Azul acento | #0288D1 | Botones, links |
| Cian claro | #4FC3F7 | Gradientes, badges |
| Fondo claro | #F0F4F8 | Contenido principal |
| Alta prioridad | #EF4444 | Borde tarjeta roja |
| Media prioridad | #F59E0B | Borde tarjeta amarilla |
| Baja prioridad | #10B981 | Borde tarjeta verde |

---

## Limitaciones del entorno

### iOS requiere macOS
**Problema:** Capacitor compila iOS solo en macOS con Xcode.  
**Estrategia:** Simulación con Chrome DevTools → iPhone 14 para verificar diseño responsive.

### Firewall bloquea Android físico
**Problema:** El firewall de Windows y el router bloquean tráfico entre dispositivos.  
**Estrategia:** Reglas específicas de firewall para puertos 8000 y 8081 sin desactivar seguridad global.

### HTTP sin cifrar en desarrollo
**Problema:** Android/iOS bloquean tráfico HTTP en producción.  
**Estrategia:** Configuración acotada para desarrollo local. En producción real se requiere HTTPS.
