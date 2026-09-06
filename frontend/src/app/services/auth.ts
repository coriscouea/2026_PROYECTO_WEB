// =============================================================
// services/auth.ts — Servicio de Autenticación
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================
// Responsabilidad: maneja el login, logout y almacenamiento
// seguro de tokens JWT usando SecureStoragePlugin (Keychain/
// Keystore) y datos no sensibles en Capacitor Preferences.
// =============================================================

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // -----------------------------------------------------------
  // Login — guarda tokens en almacenamiento cifrado del SO
  // Datos no sensibles (nombre, email, rol) en Preferences
  // -----------------------------------------------------------
  async login(email: string, password: string): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/auth/login`, {
      email,
      password
    });
    const datos = response.data.datos;

    // Tokens JWT — almacenamiento cifrado Keychain/Keystore
    await SecureStoragePlugin.set({ key: 'access_token',  value: datos.access_token });
    await SecureStoragePlugin.set({ key: 'refresh_token', value: datos.refresh_token });

    // Datos de sesión no sensibles — Preferences (texto plano)
    await Preferences.set({ key: 'email', value: email });
    const payload = JSON.parse(atob(datos.access_token.split('.')[1]));
    await Preferences.set({ key: 'rol',   value: payload.rol });
    await Preferences.set({ key: 'nombre', value: email.split('@')[0] });

    return datos;
  }

  // -----------------------------------------------------------
  // Logout seguro — elimina tokens cifrados Y datos de sesión
  // Cumple con LOPDP: ningún dato personal residual al salir
  // -----------------------------------------------------------

  async logout(): Promise<void> {
    // Eliminar tokens del almacenamiento cifrado
    try {
      await SecureStoragePlugin.remove({ key: 'access_token' });
      await SecureStoragePlugin.remove({ key: 'refresh_token' });
    } catch {
      // Si no existen las claves no lanza error
    }

    // Eliminar todos los datos de sesión de Preferences
    
    await Preferences.remove({ key: 'nombre' });
    await Preferences.remove({ key: 'email' });
    await Preferences.remove({ key: 'rol' });
    await Preferences.remove({ key: 'crear_ticket_draft' });
  }

  // -----------------------------------------------------------
  // Obtener el access token desde almacenamiento cifrado
  // -----------------------------------------------------------

  async getToken(): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key: 'access_token' });
      return result.value;
    } catch {
      return null;
    }
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

  // -----------------------------------------------------------
  // Obtener email del usuario desde Preferences
  // -----------------------------------------------------------

  async getEmail(): Promise<string> {
    const result = await Preferences.get({ key: 'email' });
    return result.value || '';
  }

  // -----------------------------------------------------------
  // Obtener perfil completo desde el backend y actualizar sesión
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
    await Preferences.set({ key: 'email',  value: usuario.email });
    await Preferences.set({ key: 'rol',    value: usuario.id_rol.toString() });

    return usuario;
  }
}