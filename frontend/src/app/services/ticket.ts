// =============================================================
// services/ticket.ts — Servicio de Tickets
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================
// El token se inyecta automáticamente por HttpService.
// El 401 lo maneja el interceptor de renovación en http.ts.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpService) {}

  async listarTickets(filtro: string = 'activos', page: number = 1, limit: number = 50): Promise<any> {
    const response = await this.http.get('/api/v1/tickets', {
      params: { filtro, page, limit }
    });
    return response.data.datos;
  }

  async obtenerTicket(id: number): Promise<any> {
    const response = await this.http.get(`/api/v1/tickets/${id}`);
    return response.data.datos;
  }

  async crearTicket(datos: any): Promise<any> {
    const response = await this.http.post('/api/v1/tickets', datos);
    return response.data.datos;
  }

  async actualizarTicket(id: number, datos: any): Promise<any> {
    const response = await this.http.patch(`/api/v1/tickets/${id}`, datos);
    return response.data.datos;
  }

  async desactivarTicket(id: number): Promise<any> {
    const response = await this.http.delete(`/api/v1/tickets/${id}`);
    return response.data.datos;
  }

  async obtenerHistorial(id: number): Promise<any> {
    const response = await this.http.get(`/api/v1/tickets/${id}/historial`);
    return response.data.datos;
  }

  async obtenerComentarios(id: number): Promise<any> {
    const response = await this.http.get(`/api/v1/tickets/${id}/comentarios`);
    return response.data.datos;
  }

  async agregarComentario(id: number, texto: string): Promise<any> {
    const response = await this.http.post(`/api/v1/tickets/${id}/comentarios`, { texto });
    return response.data.datos;
  }
}