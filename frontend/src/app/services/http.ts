// =============================================================
// services/http.ts — Cliente HTTP Centralizado
// HelpDesk Web | Semana 13 · Integración con Backend
// =============================================================
// Responsabilidad: instancia única de Axios con configuración
// centralizada. Todos los servicios consumen este cliente —
// ninguno importa Axios directamente.
//
// Interceptores registrados en orden:
//   1. Autenticación  — inyecta el token antes de enviar
//   2. Renovación     — captura 401 y renueva el token
//   3. Logging        — registra en consola solo en desarrollo
// =============================================================

import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro', '/auth/solicitar-reset'];

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly cliente: AxiosInstance;
  private renovando : boolean = false;
  private cola      : Array<(token: string | null) => void> = [];

  constructor() {
    this.cliente = axios.create({
      baseURL       : environment.apiUrl,
      timeout       : 10000,
      headers       : { 'Content-Type': 'application/json' },
    });

    this.registrarInterceptorAutenticacion();
    this.registrarInterceptorRenovacion();
    this.registrarInterceptorLogging();
  }

  private registrarInterceptorAutenticacion(): void {
    this.cliente.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const esPublica = RUTAS_PUBLICAS.some(ruta => config.url?.includes(ruta));

        if (!esPublica) {
          try {
            const { value: token } = await SecureStoragePlugin.get({ key: 'access_token' });
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
          } catch {
            // Sin token — continúa sin Authorization
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private registrarInterceptorRenovacion(): void {
    this.cliente.interceptors.response.use(
      // Respuestas exitosas (2xx) — pasan directo
      (response) => response,

      // Errores (4xx, 5xx, red) — aquí se captura el 401      
      async (error) => {
        const config = error.config as AxiosRequestConfig & { _reintentado?: boolean };
        const es401 = error.response?.status === 401;
        const reintentado = config._reintentado === true;

        if (!es401 || reintentado) return Promise.reject(error);
        
        if (this.renovando) {
          return new Promise((resolve, reject) => {
            this.cola.push((nuevoToken) => {
              if (nuevoToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${nuevoToken}`;
                config._reintentado = true;
                resolve(this.cliente(config));
              } else {
                reject(error);
              }
            });
          });
        }

        this.renovando = true;

        try {
          const { value: refreshToken } = await SecureStoragePlugin.get({ key: 'refresh_token' });       if (!refreshToken) throw new Error('Sin refresh token');

          const respuesta = await axios.post(
            `${environment.apiUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const nuevoToken: string = respuesta.data.datos.access_token;
          await SecureStoragePlugin.set({ key: 'access_token', value: nuevoToken });

          this.cola.forEach(cb => cb(nuevoToken));
          this.cola = [];

          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${nuevoToken}`;
          config._reintentado = true;

          return this.cliente(config);

        } catch {
          this.cola.forEach(cb => cb(null));
          this.cola = [];
          await this.cerrarSesion();
          return Promise.reject(error);

        } finally {
          this.renovando = false;
        }
      }
    );
  }


  private registrarInterceptorLogging(): void {
    if (environment.production) return;

    this.cliente.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        (config as any)._tiempoInicio = Date.now();
        console.log(`[HTTP] → ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      }
    );

    this.cliente.interceptors.response.use(
      (response) => {
        const duracion = Date.now() - ((response.config as any)._tiempoInicio || 0);
        console.log(`[HTTP] ← ${response.status} ${response.config.url} (${duracion}ms)`);
        return response;
      },
      (error) => {
        const duracion = Date.now() - ((error.config as any)?._tiempoInicio || 0);
        console.error(`[HTTP] ✗ ${error.response?.status || 0} ${error.config?.url} (${duracion}ms)`);
        return Promise.reject(error);
      }
    );
  }

  private async cerrarSesion(): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key: 'access_token' });
      await SecureStoragePlugin.remove({ key: 'refresh_token' });
    } catch { }
    await Preferences.remove({ key: 'nombre' });
    await Preferences.remove({ key: 'email' });
    await Preferences.remove({ key: 'rol' });
    await Preferences.remove({ key: 'crear_ticket_draft' });
    window.location.href = '/login';
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.cliente.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.cliente.post<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.cliente.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.cliente.delete<T>(url, config);
  }
}