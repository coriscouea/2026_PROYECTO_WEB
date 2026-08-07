// =============================================================
// services/auth.ts — Servicio de Autenticación
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================
// Responsabilidad: maneja el login, logout y almacenamiento
// seguro de tokens JWT usando Capacitor Preferences.
// =============================================================

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // -----------------------------------------------------------
  // Login — llama a POST /auth/login y guarda los tokens
  // -----------------------------------------------------------

  async login(email: string, password: string): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/auth/login`, {
      email,
      password
    });
    const datos = response.data.datos;
    await Preferences.set({ key: 'access_token', value: datos.access_token });
    await Preferences.set({ key: 'refresh_token', value: datos.refresh_token });
    return datos;
  }

  // -----------------------------------------------------------
  // Logout — elimina los tokens del almacenamiento
  // -----------------------------------------------------------

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'access_token' });
    await Preferences.remove({ key: 'refresh_token' });
  }

  // -----------------------------------------------------------
  // Obtener el access token almacenado
  // -----------------------------------------------------------

  async getToken(): Promise<string | null> {
    const result = await Preferences.get({ key: 'access_token' });
    return result.value;
  }

  // -----------------------------------------------------------
  // Verificar si el usuario está autenticado
  // -----------------------------------------------------------
  
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }
}
