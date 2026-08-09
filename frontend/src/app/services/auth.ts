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
    
    // Guardar email del usuario
    await Preferences.set({key: 'email', value: email});

    // Obtener nombre del payload JWT
    const payload = JSON.parse(atob(datos.access_token.split('.')[1]));
    await Preferences.set({key: 'rol', value: payload.rol});
    await Preferences.set({ key: 'nombre', value: email.split('@')[0] });
    
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

  // -----------------------------------------------------------
  // Obtener el rol del usuario desde el token JWT
  // -----------------------------------------------------------
  
  async getRol(): Promise<string> {
    const token = await this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || '';
  }

  // -----------------------------------------------------------
  // Obtener el id del usuario desde el token JWT
  // -----------------------------------------------------------

  async getIdUsuario(): Promise<number> {
    const token = await this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.sub) || 0;
  }
  
  // -----------------------------------------------------------
  // Obtener nombre del usuario desde Preferences
  // -----------------------------------------------------------

  async getNombre(): Promise<string> {
    const result = await Preferences.get({ key: 'nombre' });
    return result.value || '';
  }

  async getEmail(): Promise<string> {
    const result = await Preferences.get({ key: 'email' });
    return result.value || '';
  }

  // -----------------------------------------------------------
  // Obtener perfil completo del usuario autenticado
  // -----------------------------------------------------------

  async obtenerPerfil(): Promise<any> {
    const token = await this.getToken();
    if (!token) return;

    const response = await axios.get(
      `${this.apiUrl}/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const usuario = response.data.datos;
    await Preferences.set({ key: 'nombre', value: usuario.nombre });
    await Preferences.set({ key: 'email',  value: usuario.email  });
    await Preferences.set({ key: 'rol',    value: usuario.id_rol.toString() });

    return usuario;
  }
}

