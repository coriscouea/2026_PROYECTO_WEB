// =============================================================
// services/notificacion.ts — Servicio de Notificaciones
// HelpDesk Web | Feature 011 · Notificaciones Avanzadas
// =============================================================

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private router     : Router
  ) {}

  private async getHeaders() {
    const token = await this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  private async handle401() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  // -----------------------------------------------------------
  // Listar todas las notificaciones
  // -----------------------------------------------------------
  
  async listarNotificaciones(): Promise<any[]> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/notificaciones`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Conteo de no leídas
  // -----------------------------------------------------------

  async conteoNoLeidas(): Promise<number> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/notificaciones/conteo`, { headers });
      return response.data.datos.total;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      return 0;
    }
  }

  // -----------------------------------------------------------
  // Marcar una notificación como leída
  // -----------------------------------------------------------

  async marcarLeida(id: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.patch(
        `${this.apiUrl}/api/v1/notificaciones/${id}/leer`,
        {},
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Marcar todas como leídas
  // -----------------------------------------------------------

  async marcarTodasLeidas(): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.patch(
        `${this.apiUrl}/api/v1/notificaciones/leer-todas`,
        {},
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }
}