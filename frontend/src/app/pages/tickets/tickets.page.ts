// =============================================================
// tickets.page.ts — Bandeja de Tickets
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonFab, IonFabButton, IonMenuButton, MenuController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, add, clipboardOutline, notificationsOutline,
flashOffOutline,cloudDoneOutline, cloudOfflineOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { TicketService } from '../../services/ticket';
import { NotificacionService } from '../../services/notificacion';
import { ErrorService, ErrorTraducido } from '../../services/error';

import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';

import { EstadoRemoto } from 'src/app/models/estado-remoto';

import { SqliteService } from '../../services/sqlite';
import { Network } from '@capacitor/network';

@Component({
  selector   : 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls  : ['./tickets.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonMenuButton, TicketCardComponent, EmptyStateComponent, LoadingStateComponent,
    ErrorStateComponent
  ]
})
export class TicketsPage implements OnInit {

  filtroActual        : string  = 'activos';
  rol                 : string  = '';
  nombre              : string  = '';
  tituloHeader        : string  = 'Mis Tickets';
  estadoFiltro        : string  = '';
  prioridadFiltro     : string  = '';
  conteoNotificaciones: number  = 0;
  estadoTickets       : EstadoRemoto<any[]> = EstadoRemoto.cargando();
  
  // Resumen para las tarjetas del dashboard
  resumen = { total: 0, pendiente: 0, en_proceso: 0, finalizado: 0 };

  ultimaSync: string | null = null;

  constructor(
    private ticketService       : TicketService,
    private authService         : AuthService,
    private notificacionService : NotificacionService,
    private router              : Router,
    private route               : ActivatedRoute,
    private menuCtrl            : MenuController,
    private errorService        : ErrorService,
    private toastCtrl           : ToastController,
    private sqliteService       : SqliteService 
  ) {
    addIcons({ logOutOutline, add, clipboardOutline, notificationsOutline, flashOffOutline, cloudDoneOutline, cloudOfflineOutline });
  }

  async ngOnInit() {

    // Inicializar SQLite antes de cargar tickets
    await this.sqliteService.inicializar();

    this.rol          = await this.authService.getRol();
    this.nombre       = await this.authService.getNombre();
    this.tituloHeader = this.getTituloHeader();

    // Escuchar parámetros del sidebar
    this.route.queryParams.subscribe(params => {
      if (params['filtro']) {
        this.filtroActual    = params['filtro'];
        this.estadoFiltro    = params['estado']    || '';
        this.prioridadFiltro = params['prioridad'] || '';
      }
      this.cargarTickets();
    });

    await this.cargarConteoNotificaciones();
  }

  async ionViewWillEnter() {
    // Leer rol del JWT — no de Preferences — para reflejar cambios inmediatos
    this.rol    = await this.authService.getRol();
    this.nombre = await this.authService.getNombre();
    this.tituloHeader = this.getTituloHeader();
    
    if (!this.estadoFiltro && !this.prioridadFiltro) {
      this.cargarTickets();
    }
    this.cargarConteoNotificaciones();
  }

  getTituloHeader(): string {
    const titulos: any = {
      usuario   : 'Mis Tickets',
      tecnico   : 'Bandeja Técnica',
      mesa_ayuda: 'Bandeja ERP',
      admin     : 'Todos los Tickets'
    };
    return titulos[this.rol] || 'Tickets';
  }

  // Método para mostrar toast

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message : mensaje,
      duration: 2000,
      position: 'bottom',
      color   : color
    });
    await toast.present();
  }

async cargarTickets() {
  this.estadoTickets = EstadoRemoto.cargando();

  // Intenta leer desde caché local primero — pantalla nunca vacía
  const tieneCache = await this.sqliteService.tieneDatos();
  if (tieneCache) {
    const ticketsCache = await this.sqliteService.leerTickets(this.filtroActual);
    this.ultimaSync    = await this.sqliteService.obtenerUltimaSync();

    let tickets = ticketsCache;
    if (this.estadoFiltro)    tickets = tickets.filter((t: any) => t.estado    === this.estadoFiltro);
    if (this.prioridadFiltro) tickets = tickets.filter((t: any) => t.prioridad === this.prioridadFiltro);

    if (tickets.length > 0) {
      this.estadoTickets = EstadoRemoto.exito(tickets);
    }
  }

  // Verifica conectividad antes de llamar al backend
  const status = await Network.getStatus();
  if (!status.connected) {
    if (this.estadoTickets.tipo === 'cargando') {
      this.estadoTickets = EstadoRemoto.vacio();
    }
    await this.mostrarToast('Sin conexión — mostrando datos locales', 'warning');
    return;
  }

  try {
    const todosActivos = await this.ticketService.listarTickets('activos', 1, 100);

    this.resumen = {
      total     : todosActivos.length,
      pendiente : todosActivos.filter((t: any) => t.estado === 'pendiente').length,
      en_proceso: todosActivos.filter((t: any) => t.estado === 'en_proceso').length,
      finalizado: todosActivos.filter((t: any) => t.estado === 'finalizado').length
    };

    let tickets = await this.ticketService.listarTickets(this.filtroActual, 1, 100);

    if (this.estadoFiltro)    tickets = tickets.filter((t: any) => t.estado    === this.estadoFiltro);
    if (this.prioridadFiltro) tickets = tickets.filter((t: any) => t.prioridad === this.prioridadFiltro);

    // Guardar en caché local para lectura offline
    await this.sqliteService.guardarTickets(todosActivos);
    this.ultimaSync = await this.sqliteService.obtenerUltimaSync();

    if (tickets.length === 0) {
      this.estadoTickets = EstadoRemoto.vacio();
    } else {
      this.estadoTickets = EstadoRemoto.exito(tickets);
    }

  } catch (error: any) {
    const err = this.errorService.traducir(error);

    // Si hay caché disponible no mostrar error — solo advertencia
    if (tieneCache) {
      await this.mostrarToast('No se pudo actualizar — mostrando datos locales', 'warning');
    } else {
      this.estadoTickets = EstadoRemoto.error(err.mensaje, err.puedeReintentar);
    }

    if (error?.response?.status === 401) {
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}

  volverATickets() {
    this.router.navigate(['/tickets']);
  }

  cambiarFiltro() {
    this.estadoFiltro    = '';
    this.prioridadFiltro = '';
    this.cargarTickets();
  }

  getCategoriaLabel(id: number): string {
    const categorias: any = { 1: '⚙ Técnica', 2: '🌐 Redes', 3: '📊 ERP' };
    return categorias[id] || 'Sin categoría';
  }

  verDetalle(id: number) {
    this.router.navigate(['/detalle', id]);
  }

  crearTicket() {
    this.router.navigate(['/crear-ticket']);
  }

  async cerrarSesion() {
    await this.sqliteService.limpiarCacheCompleta();
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  irNotificaciones() {
    this.router.navigate(['/notificaciones']);
  }

  async cargarConteoNotificaciones() {
    try {
      this.conteoNotificaciones = await this.notificacionService.conteoNoLeidas();
    } catch (error) {
      this.conteoNotificaciones = 0;
    }
  }
  getSubtitulo(): string {
    const subtitulos: any = {
      usuario   : 'Panel de seguimiento de tus tickets',
      tecnico   : 'Panel de trabajo técnico',
      mesa_ayuda: 'Panel de soporte ERP',
      admin     : 'Panel de administración del sistema'
    };
    return subtitulos[this.rol] || '';
  }

  filtrarPorEstado(estado: string) {
    this.estadoFiltro    = estado;
    this.prioridadFiltro = '';
    this.filtroActual    = 'activos';
    this.cargarTickets();
  }
}


