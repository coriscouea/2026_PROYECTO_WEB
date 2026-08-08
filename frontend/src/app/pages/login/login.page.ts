// =============================================================
// login.page.ts — Lógica de la pantalla de Login
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,IonButton, IonIcon, IonSpinner, IonCheckbox
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  helpCircle, eye, eyeOff, alertCircle,
  mailOutline, lockClosedOutline, 
  eyeOutline, eyeOffOutline, alertCircleOutline 
} from 'ionicons/icons';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonButton, IonIcon, IonSpinner, IonCheckbox
  ]
})
export class LoginPage {

  email        : string  = '';
  password     : string  = '';
  errorMensaje : string  = '';
  cargando     : boolean = false;
  mostrarPassword: boolean = false;
  rememberMe: boolean = false

  constructor(
    private authService: AuthService,
    private router     : Router
  ) {
    addIcons({ 
      helpCircle, eye, eyeOff, alertCircle,
      mailOutline, lockClosedOutline, eyeOutline,
      eyeOffOutline, alertCircleOutline
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async iniciarSesion() {

    // ---------------------------------------------------------
    // Validaciones básicas en el frontend
    // ---------------------------------------------------------
    
    if (!this.email || !this.password) {
      this.errorMensaje = 'Por favor ingresa tu correo y contraseña';
      return;
    }

    this.cargando     = true;
    this.errorMensaje = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/tickets']);
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.errorMensaje = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      } else if (error.response?.status === 429) {
        this.errorMensaje = 'Demasiados intentos. Espera 1 minuto.';
      } else {
        this.errorMensaje = 'Error de conexión. Verifica que el servidor esté activo.';
      }
    } finally {
      this.cargando = false;
    }
  }
}
