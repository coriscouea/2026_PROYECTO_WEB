// =============================================================
// olvido-password.page.ts — Solicitud de Reset de Contraseña
// HelpDesk Web | Feature 021 · Reset de Contraseña
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Component({
  selector   : 'app-olvido-password',
  templateUrl: './olvido-password.page.html',
  styleUrls  : ['./olvido-password.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonSpinner
  ]
})
export class OlvidoPasswordPage {

  email       : string  = '';
  enviando    : boolean = false;
  enviado     : boolean = false;
  errorMensaje: string  = '';

  constructor(private router: Router) {
    addIcons({ mailOutline });
  }

  async solicitarReset() {
    if (!this.email.trim()) {
      this.errorMensaje = 'Ingresa tu correo electrónico';
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.email)) {
      this.errorMensaje = 'Ingresa un correo válido';
      return;
    }

    this.enviando     = true;
    this.errorMensaje = '';

    try {
      await axios.post(`${environment.apiUrl}/auth/solicitar-reset`, {
        email: this.email.trim()
      });
      this.enviado = true;
    } catch (error: any) {
      if (error.response?.status === 429) {
        this.errorMensaje = 'Demasiados intentos. Espera 1 minuto.';
      } else {
        this.errorMensaje = 'Error de conexión. Verifica que el servidor esté activo.';
      }
    } finally {
      this.enviando = false;
    }
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}