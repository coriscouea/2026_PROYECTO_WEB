// =============================================================
// services/auth.ts — Servicio de Autenticación
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpService) {}

  async login(email: string, password: string): Promise<any> {
    const response = await this.http.post('/auth/login', { email, password });
    const datos = response.data.datos;

    await SecureStoragePlugin.set({ key: 'access_token',  value: datos.access_token });
    await SecureStoragePlugin.set({ key: 'refresh_token', value: datos.refresh_token });

    await Preferences.set({ key: 'email', value: email });
    const payload = JSON.parse(atob(datos.access_token.split('.')[1]));
    await Preferences.set({ key: 'rol',    value: payload.rol });
    await Preferences.set({ key: 'nombre', value: email.split('@')[0] });

    return datos;
  }

  async logout(): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key: 'access_token' });
      await SecureStoragePlugin.remove({ key: 'refresh_token' });
    } catch { }
    await Preferences.remove({ key: 'nombre' });
    await Preferences.remove({ key: 'email' });
    await Preferences.remove({ key: 'rol' });
    await Preferences.remove({ key: 'crear_ticket_draft' });
  }

  async getToken(): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key: 'access_token' });
      return result.value;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async getRol(): Promise<string> {
    const token = await this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || '';
  }

  async getIdUsuario(): Promise<number> {
    const token = await this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.sub) || 0;
  }

  async getNombre(): Promise<string> {
    const result = await Preferences.get({ key: 'nombre' });
    return result.value || '';
  }

  async getEmail(): Promise<string> {
    const result = await Preferences.get({ key: 'email' });
    return result.value || '';
  }

  async obtenerPerfil(): Promise<any> {
    const response = await this.http.get('/auth/me');
    const usuario  = response.data.datos;

    await Preferences.set({ key: 'nombre', value: usuario.nombre });
    await Preferences.set({ key: 'email',  value: usuario.email });
    await Preferences.set({ key: 'rol',    value: usuario.id_rol.toString() });

    return usuario;
  }
}