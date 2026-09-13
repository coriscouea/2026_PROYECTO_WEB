// =============================================================
// services/usuario.ts — Servicio de Usuarios
// HelpDesk Web | Feature 006 · CRUD Usuarios
// =============================================================
// El token se inyecta automáticamente por HttpService.
// El 401 lo maneja el interceptor de renovación en http.ts.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpService) {}

  async listarUsuarios(): Promise<any[]> {
    const response = await this.http.get('/api/v1/usuarios');
    return response.data.datos;
  }

  async obtenerUsuario(id: number): Promise<any> {
    const response = await this.http.get(`/api/v1/usuarios/${id}`);
    return response.data.datos;
  }

  async crearUsuario(datos: any): Promise<any> {
    const response = await this.http.post('/api/v1/usuarios', datos);
    return response.data.datos;
  }

  async actualizarUsuario(id: number, datos: any): Promise<any> {
    const response = await this.http.patch(`/api/v1/usuarios/${id}`, datos);
    return response.data.datos;
  }

  async desactivarUsuario(id: number): Promise<any> {
    const response = await this.http.delete(`/api/v1/usuarios/${id}`);
    return response.data.datos;
  }

  async listarSolicitudes(): Promise<any[]> {
    const response = await this.http.get('/api/v1/solicitudes');
    return response.data.datos;
  }

  async atenderSolicitud(id: number): Promise<any> {
    const response = await this.http.patch(`/api/v1/solicitudes/${id}/atender`, {});
    return response.data;
  }
}