// =============================================================
// usuarios.page.ts — Gestión de Usuarios
// HelpDesk Web | Feature 006 · CRUD Usuarios
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, peopleOutline, personAddOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector   : 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls  : ['./usuarios.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon, IonButton
  ]
})
export class UsuariosPage implements OnInit {

  usuarios          : any[]   = [];
  cargando          : boolean = false;
  mostrarFormulario : boolean = false;
  creando           : boolean = false;
  errorMensaje      : string = '';

  // Campos del formulario

  nuevoNombre   : string = '';
  nuevoEmail    : string = '';
  nuevoPassword : string = '';
  nuevoRol      : number = 1;

  errores     : any = {
    nombre    : '',
    email     : '',
    password  : ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router        : Router
  ) {
    addIcons({ trashOutline, peopleOutline, personAddOutline });
  }

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;
    try {
      this.usuarios = await this.usuarioService.listarUsuarios();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      this.cargando = false;
    }
  }

  getRolLabel(idRol: number): string {
    const roles: any = {
      1: 'Usuario',
      2: 'Técnico',
      3: 'Mesa Ayuda',
      4: 'Admin'
    };
    return roles[idRol] || 'Desconocido';
  }
  
  cerrarFormulario(){
    this.mostrarFormulario  = false;
    this.nuevoNombre        = '';
    this.nuevoEmail         = '';
    this.nuevoPassword      = '';
    this.nuevoRol           = 1;
    this.errorMensaje       = '';
    this.errores            = {nombre: '', email: '', password: ''};
  }
  
  validarFormulario(): boolean {
    let valido = true;
    this.errores = {nombre: '', email: '', password: ''};

    if (!this.nuevoNombre || this.nuevoNombre.length < 3) {
      this.errores.nombre = 'El nommbre debe tener al menos 3 carcteres';
      valido = false;
    }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!this.nuevoEmail || !regex.test(this.nuevoEmail)){
    this.errores.email = 'Ingresa un correo valido';
    valido = false;
  }
  if (!this.nuevoPassword || this.nuevoPassword.length < 8){
    this.errores.password = 'La contraseña debe tener al menos 8 caracteres';
    valido = false;
    }
    return valido;
  }

  async crearUsuario() {
    if (!this.validarFormulario()) return;

    this.creando      = true;
    this.errorMensaje = '';
    try {
      await this.usuarioService.crearUsuario({
        nombre  : this.nuevoNombre.trim(),
        email   : this.nuevoEmail.trim(),
        password: this.nuevoPassword,
        id_rol  : Number(this.nuevoRol)
      });
      this.cerrarFormulario();
      await this.cargarUsuarios();
    } catch (error: any) {
      if (error.response?.status === 409) {
        this.errores.email = 'Este correo ya está registrado';
      } else {
        this.errorMensaje = 'Error al crear el usuario. Intenta de nuevo.';
      }
    } finally {
      this.creando = false;
    }
  }

  async cambiarRol(usuario: any) {
    try {
      await this.usuarioService.actualizarUsuario(usuario.id_usuario, {
        id_rol: Number(usuario.id_rol)
      });
    } catch (error) {
      console.error('Error cambiando rol:', error);
    }
  }

  async desactivarUsuario(usuario: any) {
    if (!confirm(`¿Desactivar a ${usuario.nombre}?`)) return;
    try {
      await this.usuarioService.desactivarUsuario(usuario.id_usuario);
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error desactivando usuario:', error);
    }
  }
}