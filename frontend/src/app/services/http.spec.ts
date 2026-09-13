// =============================================================
// services/http.service.ts — Cliente HTTP Centralizado
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

// Rutas públicas que no requieren token
const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro', '/auth/solicitar-reset'];

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly cliente: AxiosInstance;

  // Flag para evitar renovaciones concurrentes
  private renovando  : boolean = false;
  private cola       : Array<(token: string | null) => void> = [];

  constructor() {

    // ---------------------------------------------------------
    // Instancia única con configuración centralizada
    // validateStatus < 500 → errores 4xx llegan como respuestas
    // interpretables, no como excepciones
    // ---------------------------------------------------------

    this.cliente = axios.create({
      baseURL       : environment.apiUrl,
      timeout       : 10000,
      headers       : { 'Content-Type': 'application/json' },
      validateStatus: (status) => status < 500
    });

    this.registrarInterceptorAutenticacion();
    this.registrarInterceptorRenovacion();
    this.registrarInterceptorLogging();
  }

  // -----------------------------------------------------------
  // Interceptor 1 — Autenticación
  // Lee el token de SecureStorage y lo inyecta en el header.
  // Las rutas públicas se envían sin token.
  // -----------------------------------------------------------

  private registrarInterceptorAutenticacion(): void {
    this.cliente.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const esPublica = RUTAS_PUBLICAS.some(ruta =>
          config.url?.includes(ruta)
        );

        if (!esPublica) {
          try {
            const { value: token } = await SecureStoragePlugin.get({
              key: 'access_token'
            });
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
          } catch {
            // Sin token — la petición continúa sin Authorization
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // -----------------------------------------------------------
  // Interceptor 2 — Renovación automática del token
  // Captura el 401, renueva con el refresh token y reintenta
  // la petición original de forma transparente.
  // Flag _reintentado evita bucle infinito.
  // Cola evita renovaciones concurrentes.
  // -----------------------------------------------------------

  private registrarInterceptorRenovacion(): void {
    this.cliente.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config     = error.config as AxiosRequestConfig & { _reintentado?: boolean };
        const es401      = error.response?.status === 401;
        const reintentado = config._reintentado === true;

        if (!es401 || reintentado) {
          return Promise.reject(error);
        }

        // Si ya hay una renovación en curso — esperar en cola

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
          const { value: refreshToken } = await SecureStoragePlugin.get({
            key: 'refresh_token'
          });

          if (!refreshToken) throw new Error('Sin refresh token');

          // Llamada directa a axios para evitar interceptores propios

          const respuesta = await axios.post(
            `${environment.apiUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const nuevoToken: string = respuesta.data.datos.access_token;

          // Guardar nuevo token en SecureStorage
          await SecureStoragePlugin.set({
            key  : 'access_token',
            value: nuevoToken
          });

          // Notificar a todas las peticiones en cola
          this.cola.forEach(cb => cb(nuevoToken));
          this.cola = [];

          // Reintentar petición original con nuevo token
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${nuevoToken}`;
          config._reintentado = true;

          return this.cliente(config);

        } catch {
          // Renovación fallida — cerrar sesión
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

  // -----------------------------------------------------------
  // Interceptor 3 — Logging (solo en desarrollo)
  // Registra método, URL, código y tiempo de respuesta.
  // Oculta el header Authorization por seguridad.
  // -----------------------------------------------------------

  private registrarInterceptorLogging(): void {
    if (environment.production) return;

    this.cliente.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        (config as any)._tiempoInicio = Date.now();
        const headersLog = { ...config.headers };
        if (headersLog['Authorization']) {
          headersLog['Authorization'] = 'Bearer [OCULTO]';
        }
        console.log(`[HTTP] → ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      }
    );

    this.cliente.interceptors.response.use(
      (response) => {
        const duracion = Date.now() - ((response.config as any)._tiempoInicio || 0);
        console.log(
          `[HTTP] ← ${response.status} ${response.config.url} (${duracion}ms)`
        );
        return response;
      },
      (error) => {
        const duracion = Date.now() - ((error.config as any)?._tiempoInicio || 0);
        console.error(
          `[HTTP] ✗ ${error.response?.status || 0} ${error.config?.url} (${duracion}ms)`
        );
        return Promise.reject(error);
      }
    );
  }

  // -----------------------------------------------------------
  // Cierre de sesión desde el interceptor de renovación
  // Limpia SecureStorage + Preferences
  // -----------------------------------------------------------
  
  private async cerrarSesion(): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key: 'access_token' });
      await SecureStoragePlugin.remove({ key: 'refresh_token' });
    } catch { /* ignorar */ }
    await Preferences.remove({ key: 'nombre' });
    await Preferences.remove({ key: 'email' });
    await Preferences.remove({ key: 'rol' });
    await Preferences.remove({ key: 'crear_ticket_draft' });
    // Redirigir al login — usar window.location para salir del contexto Angular
    window.location.href = '/login';
  }

  // -----------------------------------------------------------
  // Métodos HTTP públicos — usan la instancia centralizada
  // -----------------------------------------------------------

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
