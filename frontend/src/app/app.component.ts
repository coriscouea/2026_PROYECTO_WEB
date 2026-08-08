// =============================================================
// app.component.ts — Componente raíz de la aplicación
// HelpDesk Web | Frontend
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
  IonContent, IonIcon, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  folderOpenOutline, timeOutline, playCircleOutline,
  checkmarkCircleOutline, archiveOutline, listOutline,
  chevronDown, chevronForward, peopleOutline
} from 'ionicons/icons';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  standalone : true,
  imports    : [
    CommonModule,
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
    IonContent, IonIcon
  ]
})
export class AppComponent {

  expanded: { [key: string]: boolean } = {
    activos   : true,
    pendiente : false,
    en_proceso: false,
    finalizado: false
  };

  constructor(
    private router    : Router,
    private menuCtrl  : MenuController
  ) {
    addIcons({
      folderOpenOutline, timeOutline, playCircleOutline,
      checkmarkCircleOutline, archiveOutline, listOutline,
      chevronDown, chevronForward, peopleOutline
    });
  }

  toggleSection(seccion: string) {
    this.expanded[seccion] = !this.expanded[seccion];
  }

  async filtrarTickets(filtro: string, estado: string, prioridad: string) {
    await this.menuCtrl.close();
    this.router.navigate(['/tickets'], {
      queryParams: { filtro, estado, prioridad }
    });
  }
  async irUsuarios() {
    await this.menuCtrl.close();
    this.router.navigate(['/usuarios']);
  }
}
