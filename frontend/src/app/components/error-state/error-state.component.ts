// =============================================================
// error-state.component.ts — Estado de error reutilizable
// HelpDesk Web | Semana 10 · Estados y manejo de errores
// =============================================================
// Responsabilidad: muestra un mensaje de error comprensible
// con opción de reintento. No consulta el backend directamente
// — recibe el error traducido como parámetro y emite la
// intención de reintentar hacia la pantalla contenedora.
// =============================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline, refreshOutline, arrowBackOutline } from 'ionicons/icons';
import { ErrorTraducido } from '../../services/error';

@Component({
  selector  : 'app-error-state',
  standalone: true,
  imports   : [CommonModule, IonIcon],
  template  : `
    <div class="error-state" *ngIf="error">
      <ion-icon name="cloud-offline-outline" aria-hidden="true"></ion-icon>
      <h3>{{ error.mensaje }}</h3>
      <p>{{ error.detalle }}</p>

      <!-- Botón reintentar — visible cuando el error es temporal -->
      <button class="btn-reintentar"
        *ngIf="error.puedeReintentar"
        (click)="reintentar.emit()"
        aria-label="Reintentar la operación">
        <ion-icon name="refresh-outline" aria-hidden="true"></ion-icon>
        Reintentar
      </button>

      <!-- Botón volver — visible cuando el elemento no existe -->
      <button class="btn-volver"
        *ngIf="error.accion === 'volver'"
        (click)="volver.emit()"
        aria-label="Volver al listado">
        <ion-icon name="arrow-back-outline" aria-hidden="true"></ion-icon>
        Volver al listado
      </button>
    </div>
  `,
  styles: [`
    .error-state {
      display        : flex;
      flex-direction : column;
      align-items    : center;
      justify-content: center;
      padding        : 60px var(--app-margin);
      text-align     : center;
      gap            : var(--space-3);
    }
    ion-icon {
      font-size: 48px;
      color    : var(--color-text-placeholder);
    }
    h3 {
      font-size  : var(--type-title-md-size);
      font-weight: var(--font-weight-bold);
      color      : var(--color-text-primary);
      margin     : 0;
    }
    p {
      font-size: var(--type-body-sm-size);
      color    : var(--color-text-secondary);
      margin   : 0;
    }
    .btn-reintentar, .btn-volver {
      display      : flex;
      align-items  : center;
      gap          : var(--space-2);
      padding      : var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      border       : none;
      font-size    : var(--type-body-sm-size);
      font-weight  : var(--font-weight-semibold);
      cursor       : pointer;
      min-height   : var(--touch-target-min);
      transition   : opacity var(--duration-fast) var(--easing-standard);
    }
    .btn-reintentar {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      color     : var(--color-text-on-dark);
    }
    .btn-volver {
      background: var(--primitive-slate-100);
      color     : var(--color-text-secondary);
    }
    .btn-reintentar:active, .btn-volver:active { opacity: 0.8; }
  `]
})
export class ErrorStateComponent {

  // Error traducido recibido desde la pantalla contenedora — obligatorio
  @Input({ required: true }) error!: ErrorTraducido | null;

  // Notifica al contenedor la intención de reintentar la operación
  @Output() reintentar = new EventEmitter<void>();

  // Notifica al contenedor la intención de volver al listado
  @Output() volver = new EventEmitter<void>();

  constructor() {
    addIcons({ cloudOfflineOutline, refreshOutline, arrowBackOutline });
  }
}