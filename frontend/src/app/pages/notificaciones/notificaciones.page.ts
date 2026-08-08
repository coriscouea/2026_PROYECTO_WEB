// =============================================================
// notificaciones.page.ts — Lógica de Notificaciones
// HelpDesk Web | Feature 011 · Notificaciones Avanzadas
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ticketOutline, notificationsOffOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { NotificacionService } from '../../services/notificacion';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonIcon, IonSpinner
  ]
})
export class NotificacionesPage implements OnInit {

  notificaciones: any[]   = [];
  cargando      : boolean = false;

  constructor(
    private notificacionService: NotificacionService,
    private router             : Router
  ) {
    addIcons({ ticketOutline, notificationsOffOutline, checkmarkDoneOutline });
  }

  async ngOnInit() {
    await this.cargarNotificaciones();
  }

  ionViewWillEnter() {
    this.cargarNotificaciones();
  }

  async cargarNotificaciones() {
    this.cargando = true;
    try {
      this.notificaciones = await this.notificacionService.listarNotificaciones();
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      this.cargando = false;
    }
  }

  async verTicket(notificacion: any) {
    // Marcar como leída y navegar al ticket
    if (!notificacion.leida) {
      await this.notificacionService.marcarLeida(notificacion.id_notificacion);
    }
    this.router.navigate(['/detalle', notificacion.id_ticket]);
  }

  async marcarTodasLeidas() {
    try {
      await this.notificacionService.marcarTodasLeidas();
      await this.cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificaciones:', error);
    }
  }
}