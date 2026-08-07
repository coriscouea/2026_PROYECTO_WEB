// =============================================================
// crear-ticket.page.ts — Lógica de Crear Ticket
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-crear-ticket',
  templateUrl: './crear-ticket.page.html',
  styleUrls: ['./crear-ticket.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonSpinner
  ]
})
export class CrearTicketPage {

  titulo      : string  = '';
  descripcion : string  = '';
  idCategoria : number  = 0;
  prioridad   : string  = '';
  errorMensaje: string  = '';
  enviando    : boolean = false;

  categorias = [
    { id: 1, label: '⚙ Técnica' },
    { id: 2, label: '🌐 Redes'  },
    { id: 3, label: '📊 ERP'    }
  ];

  constructor(
    private ticketService: TicketService,
    private router       : Router
  ) {}

  async crearTicket() {
    // ---------------------------------------------------------
    // Validaciones básicas
    // ---------------------------------------------------------
    if (!this.titulo.trim() || this.titulo.length < 5) {
      this.errorMensaje = 'El título debe tener al menos 5 caracteres';
      return;
    }
    if (!this.descripcion.trim() || this.descripcion.length < 10) {
      this.errorMensaje = 'La descripción debe tener al menos 10 caracteres';
      return;
    }
    if (!this.idCategoria) {
      this.errorMensaje = 'Selecciona una categoría';
      return;
    }
    if (!this.prioridad) {
      this.errorMensaje = 'Selecciona una prioridad';
      return;
    }

    this.enviando     = true;
    this.errorMensaje = '';

    try {
      // Obtener id_usuario del token almacenado
      const tokenResult = await Preferences.get({ key: 'access_token' });
      const token = tokenResult.value || '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = parseInt(payload.sub);

      await this.ticketService.crearTicket({
        titulo      : this.titulo.trim(),
        descripcion : this.descripcion.trim(),
        id_categoria: this.idCategoria,
        prioridad   : this.prioridad,
        id_usuario  : idUsuario
      });

      this.router.navigate(['/tickets']);
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.errorMensaje = 'Verifica los datos ingresados';
      } else {
        this.errorMensaje = 'Error al crear el ticket. Intenta de nuevo.';
      }
    } finally {
      this.enviando = false;
    }
  }
}