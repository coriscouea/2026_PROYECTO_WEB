// =============================================================
// app.component.ts — Componente raíz de la aplicación
// HelpDesk Web | Frontend
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
  IonContent, IonIcon, IonFooter, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  folderOpenOutline, timeOutline, playCircleOutline,
  checkmarkCircleOutline, archiveOutline, listOutline,
  chevronDown, chevronForward, peopleOutline, barChartOutline
} from 'ionicons/icons';
import { AuthService } from './services/auth';
@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  standalone : true,
  imports    : [
    CommonModule,
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
    IonContent, IonIcon, IonFooter
  ]
})
export class AppComponent implements OnInit {

  rol: string = '';

  expanded: { [key: string]: boolean } = {
    activos   : true,
    pendiente : false,
    en_proceso: false,
    finalizado: false
  };

  constructor(
    private router      : Router,
    private menuCtrl    : MenuController,
    private authService : AuthService
  ) {
    addIcons({
      folderOpenOutline, timeOutline, playCircleOutline,
      checkmarkCircleOutline, archiveOutline, listOutline,
      chevronDown, chevronForward, peopleOutline, barChartOutline
    });
  }

  nombre  : string = '';
  email   : string = '';

  async ngOnInit() {
      this.rol    = await this.authService.getRol();
      this.nombre = await this.authService.getNombre();
      this.email  = await this.authService.getEmail();

    }

    // ---------------------------------------------------------
    // Actualiza el rol cuando el usuario navega
    // ---------------------------------------------------------

    async actualizarRol() {
      this.rol = await this.authService.getRol();
    }

    esAdmin(): boolean {
      return this.rol === 'admin';
    }

    esTecnicoOMesaAyuda(): boolean {
      return ['tecnico', 'mesa_ayuda', 'admin'].includes(this.rol);
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

  async irMetricas() {
  await this.menuCtrl.close();
  this.router.navigate(['/metricas']);
  }
  getRolLabel(): string {
  const labels: any = {
    usuario   : 'Usuario',
    tecnico   : 'Técnico',
    mesa_ayuda: 'Mesa Ayuda',
    admin     : 'Admin'
  };
  return labels[this.rol] || this.rol;
  }
}
