// =============================================================
// loading-state.component.ts — Indicador de carga reutilizable
// HelpDesk Web | Semana 10 · Componentes reutilizables
// =============================================================
// Responsabilidad: muestra un spinner centrado mientras se
// espera una respuesta del backend. Se oculta automáticamente
// cuando cargando es false. No consulta el backend directamente.
// =============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector  : 'app-loading-state',
  standalone: true,
  imports   : [CommonModule, IonSpinner],
  template  : `
    <div class="loading-state" *ngIf="cargando" [attr.aria-label]="mensaje || 'Cargando'">
      <ion-spinner [name]="tipo"></ion-spinner>
      <p *ngIf="mensaje">{{ mensaje }}</p>
    </div>
  `,
  styles: [`
    .loading-state {
      display        : flex;
      flex-direction : column;
      align-items    : center;
      justify-content: center;
      padding        : 60px 0;
      gap            : var(--space-3);
    }
    p {
      font-size : var(--type-body-sm-size);
      color     : var(--color-text-secondary);
      margin    : 0;
    }
  `]
})
export class LoadingStateComponent {

  // Controla la visibilidad del spinner — obligatorio
  @Input({ required: true }) cargando!: boolean;

  // Texto descriptivo bajo el spinner — opcional
  @Input() mensaje: string = '';

  // Tipo de spinner de Ionic — opcional
  @Input() tipo: string = 'crescent';
}