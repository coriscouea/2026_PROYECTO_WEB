import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonSpinner, IonIcon
  ]
})
export class DetallePage implements OnInit {

  ticket          : any     = null;
  historial       : any[]   = [];
  comentarios     : any[]   = [];
  nuevoComentario : string  = '';
  cargando        : boolean = false;
  idTicket        : number  = 0;

  constructor(
    private route        : ActivatedRoute,
    private ticketService: TicketService
  ) {
    addIcons({ send });
  }

  async ngOnInit() {
    this.idTicket = Number(this.route.snapshot.paramMap.get('id'));
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      const [ticket, historial, comentarios] = await Promise.all([
        this.ticketService.obtenerTicket(this.idTicket),
        this.ticketService.obtenerHistorial(this.idTicket),
        this.ticketService.obtenerComentarios(this.idTicket)
      ]);
      this.ticket     = ticket;
      this.historial  = historial;
      this.comentarios= comentarios;
    } catch (error) {
      console.error('Error cargando detalle:', error);
    } finally {
      this.cargando = false;
    }
  }

  async enviarComentario() {
    if (!this.nuevoComentario.trim()) return;
    try {
      await this.ticketService.agregarComentario(this.idTicket, this.nuevoComentario);
      this.nuevoComentario = '';
      this.comentarios = await this.ticketService.obtenerComentarios(this.idTicket);
      this.historial   = await this.ticketService.obtenerHistorial(this.idTicket);
    } catch (error) {
      console.error('Error enviando comentario:', error);
    }
  }

  getCategoriaLabel(id: number): string {
    const cat: any = { 1: '⚙ Técnica', 2: '🌐 Redes', 3: '📊 ERP' };
    return cat[id] || 'Sin categoría';
  }

  getTipoLabel(tipo: string): string {
    const labels: any = {
      ticket_creado      : '✅ Ticket creado',
      tecnico_asignado   : '👤 Técnico asignado',
      estado_cambiado    : '🔄 Estado cambiado',
      prioridad_cambiada : '⚡ Prioridad cambiada',
      comentario_agregado: '💬 Comentario agregado',
      ticket_cerrado     : '🔒 Ticket cerrado'
    };
    return labels[tipo] || tipo;
  }
}