// =============================================================
// empty-state.component.ts — Estado vacío reutilizable
// HelpDesk Web | Semana 10 · Componentes reutilizables
// =============================================================
// Responsabilidad: muestra un mensaje cuando no hay contenido
// disponible. Acepta un slot de acción opcional via ng-content
// para que la pantalla contenedora decida qué botón mostrar.
// No consulta el backend ni conoce la navegación.
// =============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  clipboardOutline, notificationsOffOutline, peopleOutline,
  archiveOutline, chatbubbleOutline, checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector  : 'app-empty-state',
  standalone: true,
  imports   : [CommonModule, IonIcon],
  template  : `
    <div class="empty-state" [style.padding]="padding">
      <ion-icon [name]="icono" aria-hidden="true"></ion-icon>
      <h3>{{ titulo }}</h3>
      <p *ngIf="subtitulo">{{ subtitulo }}</p>
      <!-- Slot para acción opcional — la pantalla decide qué botón insertar -->
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display        : flex;
      flex-direction : column;
      align-items    : center;
      justify-content: center;
      color          : var(--color-text-placeholder);
      text-align     : center;
      padding        : 80px var(--app-margin);
    }
    ion-icon {
      font-size    : 56px;
      margin-bottom: var(--space-4);
    }
    h3 {
      font-size    : var(--type-title-md-size);
      font-weight  : var(--font-weight-bold);
      color        : var(--color-text-secondary);
      margin-bottom: var(--space-1);
    }
    p {
      font-size: var(--type-body-sm-size);
    }
  `]
})
export class EmptyStateComponent {

  // Nombre del ícono Ionicons a mostrar — obligatorio
  @Input({ required: true }) icono!: string;

  // Título principal del estado vacío — obligatorio
  @Input({ required: true }) titulo!: string;

  // Subtítulo explicativo — opcional
  @Input() subtitulo: string = '';

  // Espaciado vertical personalizable — opcional
  @Input() padding: string = '80px var(--app-margin)';

  constructor() {
    addIcons({
      clipboardOutline, notificationsOffOutline, peopleOutline,
      archiveOutline, chatbubbleOutline, checkmarkCircleOutline
    });
  }
}