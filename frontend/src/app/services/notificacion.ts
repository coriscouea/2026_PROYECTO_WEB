// =============================================================
// services/notificacion.ts — Servicio de Notificaciones
// HelpDesk Web | Feature 011 · Notificaciones Avanzadas
// =============================================================
// El token se inyecta automáticamente por HttpService.
// El 401 lo maneja el interceptor de renovación en http.ts.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpService) {}

  async listarNotificaciones(): Promise<any[]> {
    const response = await this.http.get('/api/v1/notificaciones');
    return response.data.datos;
  }

  async conteoNoLeidas(): Promise<number> {
    try {
      const response = await this.http.get('/api/v1/notificaciones/conteo');
      return response.data.datos.total;
    } catch {
      return 0;
    }
  }

  async marcarLeida(id: number): Promise<any> {
    const response = await this.http.patch(`/api/v1/notificaciones/${id}/leer`, {});
    return response.data.datos;
  }

  async marcarTodasLeidas(): Promise<any> {
    const response = await this.http.patch('/api/v1/notificaciones/leer-todas', {});
    return response.data.datos;
  }
}