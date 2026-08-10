// =============================================================
// services/ticket.ts — Servicio de Tickets
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private router     : Router
  ) {}

  private async getHeaders() {
    const token = await this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  // ---------------------------------------------------------
  // Maneja errores 401 — limpia tokens y redirige al login
  // ---------------------------------------------------------
  private async handle401() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  async listarTickets(filtro: string = 'activos', page: number = 1, limit: number = 50): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/tickets`, {
        headers,
        params: { filtro, page, limit }
      });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async obtenerTicket(id: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async crearTicket(datos: any): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.apiUrl}/api/v1/tickets`, datos, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async obtenerHistorial(id: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}/historial`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async obtenerComentarios(id: number): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}/comentarios`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async agregarComentario(id: number, texto: string): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${this.apiUrl}/api/v1/tickets/${id}/comentarios`,
        { texto },
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }
  
  async actualizarTicket(id: number, datos: any): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.patch(
        `${this.apiUrl}/api/v1/tickets/${id}`,
        datos,
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  async desactivarTicket(id: number): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.delete(
        `${this.apiUrl}/api/v1/tickets/${id}`,
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }
}