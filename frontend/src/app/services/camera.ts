// =============================================================
// services/camera.ts — Servicio de Cámara
// HelpDesk Web | Semana 14 · Funcionalidades Nativas
// =============================================================

import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export type EstadoPermisoCamara =
  | 'concedido'
  | 'denegado'
  | 'denegado_permanente'
  | 'restringido';

export interface ResultadoFoto {
  exito  : boolean;
  foto   : string | null;
  estado : EstadoPermisoCamara | null;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  // ---------------------------------------------------------
  // Verifica si la cámara está disponible en el dispositivo
  // ---------------------------------------------------------

  estaDisponible(): boolean {
    return Capacitor.isNativePlatform();
  }

  // ---------------------------------------------------------
  // Solicita permiso y abre la cámara
  // Se llama solo cuando el usuario toca el botón
  // ---------------------------------------------------------

  async tomarFoto(): Promise<ResultadoFoto> {

    if (!this.estaDisponible()) {
      return {
        exito  : false,
        foto   : null,
        estado : 'restringido',
        mensaje: 'La cámara no está disponible en este dispositivo'
      };
    }

    try {
      const permisos = await Camera.checkPermissions();

      if (permisos.camera === 'denied') {
        return {
          exito  : false,
          foto   : null,
          estado : 'denegado_permanente',
          mensaje: 'El permiso de cámara fue denegado permanentemente. Actívalo en Ajustes.'
        };
      }

      if (permisos.camera === 'prompt' || permisos.camera === 'prompt-with-rationale') {
        const solicitud = await Camera.requestPermissions({ permissions: ['camera'] });
        if (solicitud.camera === 'denied') {
          return {
            exito  : false,
            foto   : null,
            estado : 'denegado',
            mensaje: 'Permiso de cámara denegado. La foto no se adjuntará al ticket.'
          };
        }
      }

      // @ts-ignore — getPhoto deprecado en v8 pero sigue funcionando

      const foto = await (Camera as any).getPhoto({
        quality      : 70,
        allowEditing : false,
        resultType   : 'base64',
        source       : 'CAMERA',
        saveToGallery: false
      });

      return {
        exito  : true,
        foto   : foto.base64String || null,
        estado : 'concedido',
        mensaje: 'Foto tomada correctamente'
      };

    } catch (error: any) {
      if (error?.message?.includes('cancel')) {
        return { exito: false, foto: null, estado: null, mensaje: 'Foto cancelada' };
      }
      return {
        exito  : false,
        foto   : null,
        estado : 'denegado_permanente',
        mensaje: 'No se pudo acceder a la cámara'
      };
    }
  }

  // ---------------------------------------------------------
  // Selector del sistema — sin permiso de galería
  // ---------------------------------------------------------
  async elegirFoto(): Promise<ResultadoFoto> {
    if (!this.estaDisponible()) {
      return {
        exito  : false,
        foto   : null,
        estado : 'restringido',
        mensaje: 'El selector de fotos no está disponible'
      };
    }

    try {

      // @ts-ignore — getPhoto deprecado en v8 pero sigue funcionando

      const foto = await (Camera as any).getPhoto({
        quality    : 70,
        allowEditing: false,
        resultType : 'base64',
        source     : 'PHOTOS'
      });

      return {
        exito  : true,
        foto   : foto.base64String || null,
        estado : 'concedido',
        mensaje: 'Foto seleccionada correctamente'
      };

    } catch (error: any) {
      if (error?.message?.includes('cancel')) {
        return { exito: false, foto: null, estado: null, mensaje: 'Selección cancelada' };
      }
      return {
        exito  : false,
        foto   : null,
        estado : 'denegado_permanente',
        mensaje: 'No se pudo acceder al selector de fotos'
      };
    }
  }

  // ---------------------------------------------------------
  // Abre los ajustes del sistema ante denegación permanente
  // ---------------------------------------------------------
  async abrirAjustes(): Promise<void> {
    try {
      const win = window as any;
      if (win.AndroidSettings) {
        win.AndroidSettings.openAppSettings();
      }
    } catch (error) {
      console.warn('[Camera] No se pudo abrir ajustes:', error);
    }
  }
}