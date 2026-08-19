// =============================================================
// estado-badge.component.ts — Badge de estado del ticket
// HelpDesk Web | Semana 10 · Componentes reutilizables
// =============================================================
// Responsabilidad: muestra el estado de un ticket con color
// semántico. No consulta el backend ni conoce la ruta de
// navegación — recibe el estado como parámetro.
// =============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector   : 'app-estado-badge',
  standalone : true,
  imports    : [CommonModule],
  template   : `
    <span class="estado-badge" [class]="'estado-' + estado">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .estado-badge {
      font-size    : var(--type-label-md-size);
      font-weight  : var(--font-weight-semibold);
      padding      : 4px 12px;
      border-radius: var(--radius-full);
    }
    .estado-pendiente  { background: var(--badge-pending-bg);  color: var(--badge-pending-text); }
    .estado-en_proceso { background: var(--badge-process-bg);  color: var(--badge-process-text); }
    .estado-finalizado { background: var(--badge-done-bg);     color: var(--badge-done-text); }
  `]
})
export class EstadoBadgeComponent {

  // Estado del ticket — obligatorio
  @Input({ required: true }) estado!: 'pendiente' | 'en_proceso' | 'finalizado';

  // Convierte el valor interno al texto visible para el usuario
  getLabel(): string {
    const labels: Record<string, string> = {
      pendiente : 'Pendiente',
      en_proceso: 'En proceso',
      finalizado: 'Finalizado'
    };
    return labels[this.estado] || this.estado;
  }
}