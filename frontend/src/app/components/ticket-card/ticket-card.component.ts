// =============================================================
// ticket-card.component.ts — Tarjeta de ticket reutilizable
// HelpDesk Web | Semana 10 · Componentes reutilizables
// =============================================================
// Responsabilidad: muestra la información resumida de un ticket
// con borde de color según prioridad. No consulta el backend ni
// decide la navegación — emite el id al contenedor via Output.
// =============================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';

@Component({
  selector  : 'app-ticket-card',
  standalone: true,
  imports   : [CommonModule, DatePipe, TitleCasePipe, EstadoBadgeComponent],
  template  : `
    <div class="ticket-card"
      [class]="'prioridad-' + prioridad"
      (click)="cardClick.emit(idTicket)"
      (keydown.enter)="cardClick.emit(idTicket)"
      role="button"
      tabindex="0"
      [attr.aria-label]="'Ticket ' + idTicket + ': ' + titulo + ', estado ' + estado">

      <!-- Fila superior con número y badge de estado -->
      <div class="card-top">
        <span class="ticket-num">#{{ idTicket }}</span>
        <app-estado-badge [estado]="estado"></app-estado-badge>
      </div>

      <!-- Título del ticket -->
      <div class="ticket-titulo">{{ titulo }}</div>

      <!-- Fila inferior con categoría, prioridad y fecha -->
      <div class="card-bottom" *ngIf="!compacto">
        <span class="chip">{{ categoriaLabel }}</span>
        <span class="chip" [class]="'chip-' + prioridad">
          {{ prioridad | titlecase }}
        </span>
        <span class="ticket-fecha" *ngIf="mostrarFecha">
          {{ fecha | date:'dd/MM/yy' }}
        </span>
        <!-- Slot para contenido extra opcional -->
        <ng-content></ng-content>
      </div>

    </div>
  `,
  styles: [`
    .ticket-card {
      background   : var(--card-bg);
      border-radius: var(--radius-lg);
      padding      : var(--space-4);
      border-left  : 4px solid var(--color-border);
      box-shadow   : var(--shadow-md);
      cursor       : pointer;
      transition   : transform var(--duration-fast) var(--easing-standard),
                     box-shadow var(--duration-fast) var(--easing-standard);
    }
    .ticket-card:active {
      transform : scale(0.98);
      box-shadow: var(--shadow-sm);
    }
    .prioridad-alta  { border-left-color: var(--card-border-high); }
    .prioridad-media { border-left-color: var(--card-border-medium); }
    .prioridad-baja  { border-left-color: var(--card-border-low); }

    .card-top {
      display        : flex;
      justify-content: space-between;
      align-items    : center;
      margin-bottom  : var(--space-2);
    }
    .ticket-num {
      font-size  : var(--type-label-md-size);
      color      : var(--color-text-secondary);
      font-weight: var(--font-weight-bold);
    }
    .ticket-titulo {
      font-size    : var(--type-body-md-size);
      font-weight  : var(--font-weight-semibold);
      color        : var(--color-text-primary);
      margin-bottom: var(--space-3);
      line-height  : var(--type-title-md-lh);
    }
    .card-bottom {
      display    : flex;
      align-items: center;
      gap        : var(--space-1);
      flex-wrap  : wrap;
    }
    .chip {
      font-size    : var(--type-caption-size);
      padding      : 4px 10px;
      border-radius: var(--radius-full);
      background   : var(--primitive-slate-100);
      color        : var(--color-text-secondary);
      font-weight  : var(--font-weight-semibold);
    }
    .chip-alta  { background: #FEF2F2; color: var(--color-priority-high); }
    .chip-media { background: #FFFBEB; color: var(--color-priority-medium); }
    .chip-baja  { background: #F0FDF4; color: var(--color-priority-low); }
    .ticket-fecha {
      font-size  : var(--type-caption-size);
      color      : var(--color-text-placeholder);
      margin-left: auto;
    }
  `]
})
export class TicketCardComponent {

  // Identificador único del ticket — obligatorio
  @Input({ required: true }) idTicket!: number;

  // Título descriptivo del ticket — obligatorio
  @Input({ required: true }) titulo!: string;

  // Estado actual del ticket — obligatorio
  @Input({ required: true }) estado!: 'pendiente' | 'en_proceso' | 'finalizado';

  // Nivel de prioridad del ticket — obligatorio
  @Input({ required: true }) prioridad!: 'alta' | 'media' | 'baja';

  // Etiqueta de la categoría ya resuelta — obligatorio
  @Input({ required: true }) categoriaLabel!: string;

  // Fecha de creación del ticket — obligatorio
  @Input({ required: true }) fecha!: string;

  // Variante compacta sin fila inferior — opcional
  @Input() compacto: boolean = false;

  // Controla la visibilidad de la fecha — opcional
  @Input() mostrarFecha: boolean = true;

  // Notifica al contenedor el id del ticket seleccionado
  @Output() cardClick = new EventEmitter<number>();
}