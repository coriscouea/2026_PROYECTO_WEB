// =============================================================
// services/error.ts — Traductor de errores HTTP
// HelpDesk Web | Semana 10 · Estados y manejo de errores
// =============================================================
// Responsabilidad: traduce los códigos de estado HTTP del
// backend a mensajes comprensibles para el usuario final.
// Nunca expone mensajes técnicos del servidor al usuario.
// =============================================================

import { Injectable } from '@angular/core';

export interface ErrorTraducido {
  mensaje        : string;
  detalle        : string;
  puedeReintentar: boolean;
  accion         : 'login' | 'volver' | 'corregir' | 'esperar' | 'ninguna' | 'reintentar';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  // Convierte un código HTTP en un mensaje del dominio del usuario
  traducir(error: any): ErrorTraducido {
    const codigo = error?.response?.status || 0;

    const traducciones: Record<number, ErrorTraducido> = {
      400: {
        mensaje        : 'Los datos enviados no son válidos.',
        detalle        : 'Verifica que todos los campos estén correctamente completados.',
        puedeReintentar: false,
        accion         : 'corregir'
      },
      401: {
        mensaje        : 'Tu sesión ha expirado.',
        detalle        : 'Por favor inicia sesión nuevamente para continuar.',
        puedeReintentar: false,
        accion         : 'login'
      },
      403: {
        mensaje        : 'No tienes permiso para realizar esta acción.',
        detalle        : 'Contacta al administrador si crees que es un error.',
        puedeReintentar: false,
        accion         : 'ninguna'
      },
      404: {
        mensaje        : 'El elemento ya no existe.',
        detalle        : 'Es posible que haya sido eliminado. Vuelve al listado.',
        puedeReintentar: false,
        accion         : 'volver'
      },
      409: {
        mensaje        : 'Este correo ya está registrado en el sistema.',
        detalle        : 'Usa otro correo o solicita restablecer tu contraseña.',
        puedeReintentar: false,
        accion         : 'corregir'
      },
      422: {
        mensaje        : 'Hay errores en el formulario.',
        detalle        : 'Revisa los campos marcados e intenta nuevamente.',
        puedeReintentar: false,
        accion         : 'corregir'
      },
      429: {
        mensaje        : 'Demasiados intentos.',
        detalle        : 'Espera 1 minuto e intenta nuevamente.',
        puedeReintentar: true,
        accion         : 'esperar'
      },
      500: {
        mensaje        : 'Error del servidor.',
        detalle        : 'El problema es temporal. Intenta nuevamente en unos momentos.',
        puedeReintentar: true,
        accion         : 'reintentar'
      },
      0: {
        mensaje        : 'Sin conexión.',
        detalle        : 'Verifica que el servidor esté activo y tu red funcione.',
        puedeReintentar: true,
        accion         : 'reintentar'
      }
    };

    return traducciones[codigo] ?? {
      mensaje        : 'Ocurrió un error inesperado.',
      detalle        : 'Intenta nuevamente o contacta al administrador.',
      puedeReintentar: true,
      accion         : 'reintentar'
    };
  }
}