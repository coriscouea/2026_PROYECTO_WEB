// =============================================================
// registro.page.ts — Lógica de la pantalla de Registro
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  helpCircle, mailOutline, lockClosedOutline, personOutline,
  eyeOutline, eyeOffOutline, alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Component({
  selector   : 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls  : ['./registro.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonSpinner
  ]
})
export class RegistroPage {

  nombre          : string  = '';
  email           : string  = '';
  password        : string  = '';
  confirmarPassword: string = '';
  mostrarPassword : boolean = false;
  mostrarConfirmar: boolean = false;
  enviando        : boolean = false;
  errorMensaje    : string  = '';
  exitoMensaje    : string  = '';

  // Errores por campo
  errores: any = {
    nombre  : '',
    email   : '',
    password: '',
    confirmar: ''
  };

  // Fortaleza de contraseña
  fortaleza: number = 0; // 0-3

  constructor(
    private router: Router
  ) {
    addIcons({
      helpCircle, mailOutline, lockClosedOutline, personOutline,
      eyeOutline, eyeOffOutline, alertCircleOutline, checkmarkCircleOutline
    });
  }

  // ---------------------------------------------------------
  // Validación en tiempo real — nombre
  // ---------------------------------------------------------
  validarNombre() {
    if (!this.nombre) {
      this.errores.nombre = '';
    } else if (this.nombre.length < 3) {
      this.errores.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (this.nombre.length > 100) {
      this.errores.nombre = 'El nombre no puede superar 100 caracteres';
    } else {
      this.errores.nombre = null; // null = válido
    }
  }

  // ---------------------------------------------------------
  // Validación en tiempo real — email
  // ---------------------------------------------------------
  validarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.errores.email = '';
    } else if (!regex.test(this.email)) {
      this.errores.email = 'Ingresa un correo válido (ejemplo@empresa.com)';
    } else {
      this.errores.email = null;
    }
  }

  // ---------------------------------------------------------
  // Validación en tiempo real — contraseña con fortaleza
  // ---------------------------------------------------------
  validarPassword() {
    if (!this.password) {
      this.errores.password = '';
      this.fortaleza = 0;
      return;
    }

    let puntos = 0;
    if (this.password.length >= 8)  puntos++;
    if (/[A-Z]/.test(this.password)) puntos++;
    if (/[0-9]/.test(this.password)) puntos++;

    this.fortaleza = puntos;

    if (this.password.length < 8) {
      this.errores.password = 'La contraseña debe tener al menos 8 caracteres';
    } else {
      this.errores.password = null;
    }

    // Re-validar confirmación si ya tiene valor
    if (this.confirmarPassword) {
      this.validarConfirmar();
    }
  }

  // ---------------------------------------------------------
  // Validación en tiempo real — confirmar contraseña
  // ---------------------------------------------------------
  validarConfirmar() {
    if (!this.confirmarPassword) {
      this.errores.confirmar = '';
    } else if (this.password !== this.confirmarPassword) {
      this.errores.confirmar = 'Las contraseñas no coinciden';
    } else {
      this.errores.confirmar = null;
    }
  }

  getFortalezaLabel(): string {
    const labels = ['', 'Débil', 'Media', 'Fuerte'];
    return labels[this.fortaleza] || '';
  }

  getFortalezaColor(): string {
    const colors = ['', '#EF4444', '#F59E0B', '#10B981'];
    return colors[this.fortaleza] || '';
  }

  togglePassword()  { this.mostrarPassword  = !this.mostrarPassword; }
  toggleConfirmar() { this.mostrarConfirmar = !this.mostrarConfirmar; }

  formularioValido(): boolean {
    return (
      this.errores.nombre   === null &&
      this.errores.email    === null &&
      this.errores.password === null &&
      this.errores.confirmar=== null &&
      this.nombre.length > 0 &&
      this.email.length  > 0 &&
      this.password.length > 0 &&
      this.confirmarPassword.length > 0
    );
  }

  // ---------------------------------------------------------
  // Enviar registro al backend
  // ---------------------------------------------------------
  async registrarse() {
    // Validar todos los campos
    this.validarNombre();
    this.validarEmail();
    this.validarPassword();
    this.validarConfirmar();

    if (!this.formularioValido()) {
      this.errorMensaje = 'Corrige los errores antes de continuar';
      return;
    }

    this.enviando     = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    try {
      await axios.post(`${environment.apiUrl}/auth/registro`, {
        nombre  : this.nombre.trim(),
        email   : this.email.trim(),
        password: this.password
      });

      this.exitoMensaje = '¡Cuenta creada correctamente! Redirigiendo...';
      setTimeout(() => this.router.navigate(['/login']), 2000);

    } catch (error: any) {
      if (error.response?.status === 409) {
        this.errores.email = 'Este correo ya está registrado';
        this.errorMensaje  = 'El correo ya existe en el sistema';
      } else if (error.response?.status === 422) {
        this.errorMensaje = 'Verifica los datos ingresados';
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