// =============================================================
// services/ticket.ts — Servicio de Tickets
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================

import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;

  constructor(private authService: AuthService) {}

  // -----------------------------------------------------------
  // Headers con token JWT
  // -----------------------------------------------------------

  private async getHeaders() {
    const token = await this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  // -----------------------------------------------------------
  // Listar tickets con filtro y paginación
  // -----------------------------------------------------------

  async listarTickets(filtro: string = 'activos', page: number = 1, limit: number = 50): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/api/v1/tickets`, {
      headers,
      params: { filtro, page, limit }
    });
    return response.data.datos;
  }

  // -----------------------------------------------------------
  // Obtener detalle de un ticket
  // -----------------------------------------------------------

  async obtenerTicket(id: number): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}`, { headers });
    return response.data.datos;
  }

  // -----------------------------------------------------------
  // Crear ticket
  // -----------------------------------------------------------

  async crearTicket(datos: any): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.apiUrl}/api/v1/tickets`, datos, { headers });
    return response.data.datos;
  }

  // -----------------------------------------------------------
  // Obtener historial del ticket
  // -----------------------------------------------------------

  async obtenerHistorial(id: number): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}/historial`, { headers });
    return response.data.datos;
  }

  // -----------------------------------------------------------
  // Obtener comentarios del ticket
  // -----------------------------------------------------------

  async obtenerComentarios(id: number): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/api/v1/tickets/${id}/comentarios`, { headers });
    return response.data.datos;
  }

  // -----------------------------------------------------------
  // Agregar comentario
  // -----------------------------------------------------------

  async agregarComentario(id: number, texto: string): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(
      `${this.apiUrl}/api/v1/tickets/${id}/comentarios`,
      { texto },
      { headers }
    );
    return response.data.datos;
  }
}
