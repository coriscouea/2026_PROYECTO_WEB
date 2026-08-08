// =============================================================
// app.routes.ts — Rutas de la aplicación
// HelpDesk Web | Frontend
// =============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./pages/tickets/tickets.page').then(m => m.TicketsPage)
  },
  {
    path: 'detalle/:id',
    loadComponent: () =>
      import('./pages/detalle/detalle.page').then(m => m.DetallePage)
  },
  {
    path: 'crear-ticket',
    loadComponent: () => import('./pages/crear-ticket/crear-ticket.page').then( m => m.CrearTicketPage)
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones.page').then( m => m.NotificacionesPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.page').then( m => m.UsuariosPage)
  }
];