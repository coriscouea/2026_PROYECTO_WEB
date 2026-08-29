// =============================================================
// app.routes.ts — Rutas de la aplicación
// HelpDesk Web | Frontend
// =============================================================

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ─── Rutas públicas — accesibles sin autenticación ───────
  
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'registro',
    loadComponent: () => 
      import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },

  {
    path: 'olvido-password',
    loadComponent: () => 
      import('./pages/olvido-password/olvido-password.page').then( m => m.OlvidoPasswordPage)
  },

  // ─── Rutas protegidas — requieren token JWT válido ────────

  {
    path: 'tickets',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./pages/tickets/tickets.page').then(m => m.TicketsPage)
  },

  {
    path: 'detalle/:id',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./pages/detalle/detalle.page').then(m => m.DetallePage),
    
    // Ruta anidada — el id del ticket viaja en la URL
    // La pantalla se reconstruye solo con este parámetro

    children:[]
  },

  {
    path: 'crear-ticket',
    canActivate:[authGuard],
    loadComponent: () => 
      import('./pages/crear-ticket/crear-ticket.page').then( m => m.CrearTicketPage)
  },

  {
    path: 'notificaciones',
    canActivate:[authGuard],
    loadComponent: () => 
      import('./pages/notificaciones/notificaciones.page').then( m => m.NotificacionesPage)
  },

  {

    path: 'usuarios',
    canActivate:[authGuard],
    loadComponent: () => 
      import('./pages/usuarios/usuarios.page').then( m => m.UsuariosPage)
  },

  {
    path: 'metricas',
    canActivate:[authGuard],
    loadComponent: () => 
      import('./pages/metricas/metricas.page').then( m => m.MetricasPage)
  },

  // ─── Ruta comodín — redirige rutas desconocidas al login ──

  {
    path: '**',
    redirectTo: 'login'
  }

];