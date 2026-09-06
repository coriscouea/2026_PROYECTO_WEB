// =============================================================
// services/sqlite.ts — Servicio de Caché Local
// HelpDesk Web | Semana 12 · Persistencia Local
// =============================================================
// Responsabilidad: gestiona la caché local de tickets usando
// localforage (IndexedDB). Esquema desnormalizado optimizado
// para lectura rápida sin necesidad de JOINs.
// Versión del esquema: 1
// =============================================================

import { Injectable } from '@angular/core';
import localforage from 'localforage';

const CACHE_KEY        = 'tickets_cache';
const SYNC_KEY         = 'ultima_sync';
const CACHE_EXPIRY_MS  = 24 * 60 * 60 * 1000; // 24 horas

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private store: LocalForage;

  constructor() {
    // Configura el almacén local con IndexedDB como driver preferido
    this.store = localforage.createInstance({
      name       : 'helpdesk_web',
      storeName  : 'tickets_cache',
      description: 'Caché local de tickets HelpDesk Web'
    });
  }

  // Inicializa el servicio — compatibilidad con el código existente
  async inicializar(): Promise<void> {
    await this.store.ready();
  }

  // Guarda tickets en la caché local con timestamp del servidor
  async guardarTickets(tickets: any[]): Promise<void> {
    const ahora = new Date().toISOString();

    // Esquema desnormalizado — solo campos que muestra la interfaz
    const ticketsMinimizados = tickets.map(t => ({
      id_ticket           : t.id_ticket,
      titulo              : t.titulo,
      estado              : t.estado,
      prioridad           : t.prioridad,
      id_categoria        : t.id_categoria,
      categoria_label     : t.categoria_label     || '',
      nombre_usuario      : t.nombre_usuario      || null,
      nombre_tecnico      : t.nombre_tecnico      || null,
      fecha_creacion      : t.fecha_creacion      || null,
      fecha_actualizacion : t.fecha_actualizacion || null,
      activo              : t.activo
    }));

    await this.store.setItem(CACHE_KEY, ticketsMinimizados);
    await this.store.setItem(SYNC_KEY, ahora);
  }

  // Lee tickets desde la caché — nunca muestra pantalla vacía
  async leerTickets(filtro: string = 'activos'): Promise<any[]> {
    const tickets: any[] | null = await this.store.getItem(CACHE_KEY);
    if (!tickets) return [];

    if (filtro === 'activos')   return tickets.filter(t => t.activo);
    if (filtro === 'inactivos') return tickets.filter(t => !t.activo);
    return tickets;
  }

  // Obtiene la fecha de la última sincronización con el backend
  async obtenerUltimaSync(): Promise<string | null> {
    return await this.store.getItem(SYNC_KEY);
  }

  // Verifica si la caché tiene datos disponibles
  async tieneDatos(): Promise<boolean> {
    const tickets: any[] | null = await this.store.getItem(CACHE_KEY);
    return tickets !== null && tickets.length > 0;
  }

  // Verifica si la caché ha expirado — caducidad de 24 horas
  async cacheExpirada(): Promise<boolean> {
    const ultimaSync: string | null = await this.store.getItem(SYNC_KEY);
    if (!ultimaSync) return true;
    const diferencia = Date.now() - new Date(ultimaSync).getTime();
    return diferencia > CACHE_EXPIRY_MS;
  }

  // Limpia toda la caché — se llama al cerrar sesión (LOPDP)
  async limpiarCacheCompleta(): Promise<void> {
    await this.store.clear();
  }
}