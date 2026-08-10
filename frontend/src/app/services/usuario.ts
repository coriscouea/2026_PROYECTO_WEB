// =============================================================
// services/usuario.ts — Servicio de Usuarios
// HelpDesk Web | Feature 006 · CRUD Usuarios
// =============================================================

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

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
  // Listar todos los usuarios activos
  // -----------------------------------------------------------
  async listarUsuarios(): Promise<any[]> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/usuarios`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Obtener detalle de un usuario
  // -----------------------------------------------------------
  async obtenerUsuario(id: number): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.get(`${this.apiUrl}/api/v1/usuarios/${id}`, { headers });
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Actualizar usuario — nombre, sucursal o rol
  // -----------------------------------------------------------
  async actualizarUsuario(id: number, datos: any): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.patch(
        `${this.apiUrl}/api/v1/usuarios/${id}`,
        datos,
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

  // -----------------------------------------------------------
  // Desactivar usuario — soft delete
  // -----------------------------------------------------------
  async desactivarUsuario(id: number): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.delete(
        `${this.apiUrl}/api/v1/usuarios/${id}`,
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }
  // -----------------------------------------------------------
  // Crear usuario — solo admin
  // -----------------------------------------------------------
  async crearUsuario(datos: any): Promise<any> {
    try {
      const headers  = await this.getHeaders();
      const response = await axios.post(
        `${this.apiUrl}/api/v1/usuarios`,
        datos,
        { headers }
      );
      return response.data.datos;
    } catch (error: any) {
      if (error.response?.status === 401) await this.handle401();
      throw error;
    }
  }

}

