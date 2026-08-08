// =============================================================
// tickets.page.ts — Bandeja de Tickets
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  IonSpinner, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, add, clipboardOutline, notificationsOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { TicketService } from '../../services/ticket';
import { NotificacionService } from '../../services/notificacion';
import { ActivatedRoute } from '@angular/router';
import { MenuController, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonSpinner, IonFab, IonFabButton, IonMenuButton
  ]
})
export class TicketsPage implements OnInit {

  tickets         : any[]   = [];
  filtroActual    : string  = 'activos';
  cargando        : boolean = false;
  rol             : string  = '';
  tituloHeader    : string  = 'Mis Tickets';
  estadoFiltro    : string = '';
  prioridadFiltro : string = '';

  constructor(
    private ticketService       : TicketService,
    private authService         : AuthService,
    private notificacionService : NotificacionService,
    private router              : Router,
    private route               : ActivatedRoute,
    private menuCtrl            : MenuController
  ) {
    addIcons({ logOutOutline, add, clipboardOutline, notificationsOutline });
  }

  

  async ngOnInit() {
    this.rol          = await this.authService.getRol();
    this.tituloHeader = this.getTituloHeader();
    
    // Escucha parámetros del sidebar
    
    this.route.queryParams.subscribe(params => {
      if (params['filtro']) {
        this.filtroActual     = params['filtro'];
        this.estadoFiltro     = params['estado']    || '';
        this.prioridadFiltro  = params['prioridad'] || '';
      }
      this.cargarTickets();
    });

    await this.cargarConteoNotificaciones();
  }

  ionViewWillEnter(){
    if(!this.estadoFiltro && !this.prioridadFiltro){
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
    console.log('filtro:', this.filtroActual, 'estado:', this.estadoFiltro, 'prioridad', this.prioridadFiltro);
    this.cargando = true;
    try {
      let tickets = await this.ticketService.listarTickets(this.filtroActual, 1, 100);
      console.log('primer ticket', tickets[0]?.estado, tickets[0]?.prioridad);
      // Filtro adicional por estado si viene del sidebar
      if (this.estadoFiltro) {
        console.log('antes filtro estado:', tickets.length);
        tickets = tickets.filter((t: any) => t.estado === this.estadoFiltro);
        console.log('despues filtro estado:', tickets.length);
      }

      // Filtro adicional por prioridad si viene del sidebar
      if (this.prioridadFiltro) {
        console.log('antes filtro prioridad:', tickets.length)
        tickets = tickets.filter((t: any) => t.prioridad === this.prioridadFiltro);
        console.log('despues filtro prioridad:', tickets.length);
      }

      this.tickets = tickets;
    } catch (error) {
      console.error('Error cargando tickets:', error);
    } finally {
      this.cargando = false;
    }
  }

  cambiarFiltro() {
    this.cargarTickets();
  }

  getCategoriaLabel(id: number): string {
    const categorias: any = { 1: '⚙ Técnica', 2: '🌐 Redes', 3: '📊 ERP' };
    return categorias[id] || 'Sin categoría';
  }

  getPrioridadColor(prioridad: string): string {
    const colores: any = { alta: 'danger', media: 'warning', baja: 'success' };
    return colores[prioridad] || 'medium';
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
  // propiedad
  conteoNotificaciones: number = 0;

  // método
  async cargarConteoNotificaciones() {
    try {
      this.conteoNotificaciones = await this.notificacionService.conteoNoLeidas();
    } catch (error) {
      this.conteoNotificaciones = 0;
    }
  }
}