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
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonFab, IonFabButton, IonMenuButton, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, add, clipboardOutline, notificationsOutline,
flashOffOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { TicketService } from '../../services/ticket';
import { NotificacionService } from '../../services/notificacion';

import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../components/loading-state/loading-state.component';

@Component({
  selector   : 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls  : ['./tickets.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonMenuButton, TicketCardComponent, EmptyStateComponent, LoadingStateComponent
  ]
})
export class TicketsPage implements OnInit {

  tickets             : any[]   = [];
  filtroActual        : string  = 'activos';
  cargando            : boolean = false;
  rol                 : string  = '';
  nombre              : string  = '';
  tituloHeader        : string  = 'Mis Tickets';
  estadoFiltro        : string  = '';
  prioridadFiltro     : string  = '';
  conteoNotificaciones: number  = 0;

  // Resumen para las tarjetas del dashboard
  resumen = { total: 0, pendiente: 0, en_proceso: 0, finalizado: 0 };

  constructor(
    private ticketService       : TicketService,
    private authService         : AuthService,
    private notificacionService : NotificacionService,
    private router              : Router,
    private route               : ActivatedRoute,
    private menuCtrl            : MenuController
  ) {
    addIcons({ logOutOutline, add, clipboardOutline, notificationsOutline, flashOffOutline });
  }

  async ngOnInit() {
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
    this.nombre = await this.authService.getNombre();
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

  async cargarTickets() {
    this.cargando = true;
    try {
      // Cargar todos para calcular resumen
      const todosActivos = await this.ticketService.listarTickets('activos', 1, 100);

      // Calcular resumen de tarjetas
      this.resumen = {
        total     : todosActivos.length,
        pendiente : todosActivos.filter((t: any) => t.estado === 'pendiente').length,
        en_proceso: todosActivos.filter((t: any) => t.estado === 'en_proceso').length,
        finalizado: todosActivos.filter((t: any) => t.estado === 'finalizado').length
      };

      // Cargar tickets según filtro actual
      let tickets = await this.ticketService.listarTickets(this.filtroActual, 1, 100);

      // Filtro por estado del sidebar
      if (this.estadoFiltro) {
        tickets = tickets.filter((t: any) => t.estado === this.estadoFiltro);
      }

      // Filtro por prioridad del sidebar
      if (this.prioridadFiltro) {
        tickets = tickets.filter((t: any) => t.prioridad === this.prioridadFiltro);
      }

      this.tickets = tickets;
    } catch (error) {
      console.error('Error cargando tickets:', error);
    } finally {
      this.cargando = false;
    }
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
