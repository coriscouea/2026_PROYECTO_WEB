// =============================================================
// services/metricas.ts — Servicio de Métricas
// HelpDesk Web | Feature 012 · Métricas Básicas
// =============================================================
// El token se inyecta automáticamente por HttpService.
// El 401 lo maneja el interceptor de renovación en http.ts.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class MetricasService {

  constructor(private http: HttpService) {}

  async obtenerResumen(): Promise<any> {
    const response = await this.http.get('/api/v1/metricas/resumen');
    return response.data.datos;
  }

  async obtenerPorCategoria(): Promise<any[]> {
    const response = await this.http.get('/api/v1/metricas/por-categoria');
    return response.data.datos;
  }

  async obtenerPorTecnico(): Promise<any[]> {
    const response = await this.http.get('/api/v1/metricas/por-tecnico');
    return response.data.datos;
  }

  async obtenerTiempoResolucion(): Promise<any> {
    const response = await this.http.get('/api/v1/metricas/tiempo-resolucion');
    return response.data.datos;
  }

  async obtenerResumenGlobal(): Promise<any> {
    const response = await this.http.get('/api/v1/metricas/resumen-global');
    return response.data.datos;
  }
}