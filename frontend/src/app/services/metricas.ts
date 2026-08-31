// =============================================================
// services/metricas.ts — Servicio de Métricas
// HelpDesk Web | Feature 012 · Métricas Básicas
// =============================================================

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MetricasService {

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
  // Resumen por estado
  // -----------------------------------------------------------
  async obtenerResumen(): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/metricas/resumen`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Tickets por categoría
  // -----------------------------------------------------------
  async obtenerPorCategoria(): Promise<any[]> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/metricas/por-categoria`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Tickets por técnico
  // -----------------------------------------------------------
  async obtenerPorTecnico(): Promise<any[]> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/metricas/por-tecnico`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Tiempo promedio de resolución
  // -----------------------------------------------------------
  async obtenerTiempoResolucion(): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/metricas/tiempo-resolucion`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }


  // -----------------------------------------------------------
  // Resumen global — activos, inactivos e históricos
  // -----------------------------------------------------------
  async obtenerResumenGlobal(): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/metricas/resumen-global`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }
}