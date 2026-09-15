// =============================================================
// services/local-notification.ts — Notificaciones Locales Nativas
// HelpDesk Web | Semana 14 · Funcionalidades Nativas
// =============================================================
// Responsabilidad: gestiona las notificaciones locales nativas.
// Maneja los 4 estados de permiso.
// El canal se crea en app.component.ts antes del primer uso.
// =============================================================

import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export type EstadoPermisoNotificacion =
  | 'concedido'
  | 'denegado'
  | 'denegado_permanente'
  | 'restringido';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  // ---------------------------------------------------------
  // Verifica si las notificaciones están disponibles
  // ---------------------------------------------------------
  estaDisponible(): boolean {
    return Capacitor.isNativePlatform();
  }

  // ---------------------------------------------------------
  // Solicita permiso de notificaciones
  // Se llama antes de mostrar la primera notificación
  // ---------------------------------------------------------
  async solicitarPermiso(): Promise<EstadoPermisoNotificacion> {
    if (!this.estaDisponible()) return 'restringido';

    try {
      const permisos = await LocalNotifications.checkPermissions();

      if (permisos.display === 'granted') return 'concedido';
      if (permisos.display === 'denied')  return 'denegado_permanente';

      const solicitud = await LocalNotifications.requestPermissions();

      if (solicitud.display === 'granted') return 'concedido';
      if (solicitud.display === 'denied')  return 'denegado';

      return 'denegado';

    } catch {
      return 'restringido';
    }
  }

  // ---------------------------------------------------------
  // Muestra una notificación local nativa
  // Verifica el permiso antes de cada uso
  // ---------------------------------------------------------
  async mostrarNotificacion(titulo: string, cuerpo: string, id: number = 1): Promise<boolean> {
    if (!this.estaDisponible()) return false;

    const estado = await this.solicitarPermiso();

    if (estado !== 'concedido') return false;

    try {
      await LocalNotifications.schedule({
        notifications: [{
          id      : id,
          title   : titulo,
          body    : cuerpo,
          channelId: 'helpdesk-tickets',
          schedule: { at: new Date(Date.now() + 500) }
        }]
      });
      return true;
    } catch (error) {
      console.warn('[Notificaciones] Error al mostrar notificación:', error);
      return false;
    }
  }

  // ---------------------------------------------------------
  // Verifica el estado actual del permiso
  // ---------------------------------------------------------
  async verificarEstado(): Promise<EstadoPermisoNotificacion> {
    if (!this.estaDisponible()) return 'restringido';

    try {
      const permisos = await LocalNotifications.checkPermissions();
      if (permisos.display === 'granted') return 'concedido';
      if (permisos.display === 'denied')  return 'denegado_permanente';
      return 'denegado';
    } catch {
      return 'restringido';
    }
  }

  // ---------------------------------------------------------
  // Abre los ajustes del sistema ante denegación permanente
  // ---------------------------------------------------------
  async abrirAjustes(): Promise<void> {
    try {
      const { NativeSettings } = await import('@capacitor/core') as any;
      if (NativeSettings?.open) {
        await NativeSettings.open({ option: 'application' });
      }
    } catch {
      console.warn('[Notificaciones] Ir a Ajustes manualmente');
    }
  }
}