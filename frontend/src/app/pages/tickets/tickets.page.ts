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
import { logOutOutline, add, clipboardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonSpinner, IonFab, IonFabButton
  ]
})
export class TicketsPage implements OnInit {

  tickets     : any[]   = [];
  filtroActual: string  = 'activos';
  cargando    : boolean = false;
  rol         : string  = '';
  tituloHeader: string  = 'Mis Tickets';

  constructor(
    private ticketService: TicketService,
    private authService  : AuthService,
    private router       : Router
  ) {
    addIcons({ logOutOutline, add, clipboardOutline });
  }

  async ngOnInit() {
    this.rol = await this.authService.getRol();
    this.tituloHeader = this.getTituloHeader();
    await this.cargarTickets();
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
      this.tickets = await this.ticketService.listarTickets(this.filtroActual);
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
}