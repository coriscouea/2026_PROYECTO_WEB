// =============================================================
// detalle.page.ts — Lógica de la pantalla de Detalle
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send, personAdd, checkmarkCircle, playCircle, trashOutline } from 'ionicons/icons';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth';
import { ErrorService, ErrorTraducido } from '../../services/error';

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

  ticket              : any     = null;
  historial           : any[]   = [];
  comentarios         : any[]   = [];
  nuevoComentario     : string  = '';
  cargando            : boolean = false;
  actualizando        : boolean = false;
  idTicket            : number  = 0;
  rol                 : string  = '';
  idUsuario           : number  = 0;
  ticketNoEncontrado  : boolean = false;
  errorActual: ErrorTraducido | null = null; 

  constructor(
    private route        : ActivatedRoute,
    private router       : Router,
    private ticketService: TicketService,
    private authService  : AuthService,
    private toastCtrl     : ToastController,
    private errorService : ErrorService 
  ) {
    addIcons({ send, personAdd, checkmarkCircle, playCircle, trashOutline });
  }

  async ngOnInit() {
    this.idTicket = Number(this.route.snapshot.paramMap.get('id'));
    this.rol       = await this.authService.getRol();
    this.idUsuario = await this.authService.getIdUsuario();
    await this.cargarDatos();
  }

  ionViewWillEnter(){
    this.cargarDatos();
  }
  
  async cargarDatos() {
    this.cargando = true;
    this.ticketNoEncontrado = false;
    try {
      const [ticket, historial, comentarios] = await Promise.all([
        this.ticketService.obtenerTicket(this.idTicket),
        this.ticketService.obtenerHistorial(this.idTicket),
        this.ticketService.obtenerComentarios(this.idTicket)
      ]);
      this.ticket      = ticket;
      this.historial   = historial;
      this.comentarios = comentarios;
    } catch (error: any) {
      if (error.response?.status === 404){
        this.ticketNoEncontrado = true;  
      
        // Ticket inactivo — cargar solo historial  
    
        try {
          this.historial = await this.ticketService.obtenerHistorial(this.idTicket);
        } catch (e) {}
      }
      console.error('Error cargando detalle:', error);
    } finally {
      this.cargando = false
    }
  }  
    
  // ---------------------------------------------------------
  // Cambiar estado del ticket
  // ---------------------------------------------------------

  async cambiarEstado(nuevoEstado: string) {
    this.actualizando = true;
    try {
      await this.ticketService.actualizarTicket(this.idTicket,
        { estado: nuevoEstado }
      );
      await this.mostrarToast('✅ Estado actualizado correctamente');
      await this.cargarDatos();
    } catch (error: any) {
      const err = this.errorService.traducir(error);
      await this.mostrarToast(err.mensaje, 'danger');
    } finally {
      this.actualizando = false;
    }
  }

  // ---------------------------------------------------------
  // Asignar técnico actual al ticket
  // ---------------------------------------------------------

  async tomarTicket() {
    this.actualizando = true;
    try {

    // Obtiene el id del usuario autenticado desde el token
    const idTecnico = await this.authService.getIdUsuario();

      await this.ticketService.actualizarTicket(this.idTicket,
        { id_tecnico_asignado: idTecnico }
      );
      await this.mostrarToast('✅ Ticket tomado correctamente');
      await this.cargarDatos();
    } catch (error: any) {
      const err = this.errorService.traducir(error);
      await this.mostrarToast(err.mensaje, 'danger');
    } finally {
      this.actualizando = false;
    }
  }

  // ---------------------------------------------------------
  // Verificar si puede cambiar estado
  // ---------------------------------------------------------

  puedeActuar(): boolean {
    return ['tecnico', 'mesa_ayuda', 'admin'].includes(this.rol);
  }

  getSiguienteEstado(): string | null {
    const transiciones: any = {
      pendiente : 'en_proceso',
      en_proceso: 'finalizado',
      finalizado: null
    };
    return transiciones[this.ticket?.estado] || null;
  }

  getLabelSiguienteEstado(): string {
    const labels: any = {
      en_proceso: '▶ Iniciar',
      finalizado : '✅ Finalizar'
    };
    return labels[this.getSiguienteEstado() || ''] || '';
  }

  async enviarComentario() {
    if (!this.nuevoComentario.trim()) return;
    try {
      await this.ticketService.agregarComentario(this.idTicket, this.nuevoComentario);
      this.nuevoComentario = '';
      await this.mostrarToast('✅ Comentario agregado');
      await this.cargarDatos();
    } catch (error: any) {
      const err = this.errorService.traducir(error);
      await this.mostrarToast(err.mensaje, 'danger');
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

  async desactivarTicket() {
    if (!confirm('¿Desactivar este ticket? Esta acción no se puede deshacer.')) return;
    this.actualizando = true;
    try {
      await this.ticketService.desactivarTicket(this.idTicket);
      this.router.navigate(['/tickets']);
    } catch (error) {
      console.error('Error desactivando ticket:', error);
    } finally {
      this.actualizando = false;
    }
  }


  // Método toast reutilizable

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message : mensaje,
      duration: 2000,
      position: 'bottom',
      color   : color
    });
    await toast.present();
  }
}