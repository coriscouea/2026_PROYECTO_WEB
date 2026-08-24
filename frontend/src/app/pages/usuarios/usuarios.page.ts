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
  IonBackButton, IonSpinner, IonIcon, IonButton, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, peopleOutline, personAddOutline, keyOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario';
import { ErrorService } from '../../services/error';

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

  // propiedades cambio de contraseña

  mostrarCambioPassword: boolean = false;
  usuarioSeleccionado  : any     = null;
  nuevaPassword        : string  = '';
  errorPassword        : string  = '';
  cambiandoPassword    : boolean = false;
  mostrarNuevaPassword : boolean = false;

  solicitudes: any[] = [];

  errores     : any = {
    nombre    : '',
    email     : '',
    password  : ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router        : Router,
    private toastCtrl   : ToastController,
    private errorService: ErrorService
  ) {
    addIcons({ trashOutline, peopleOutline, personAddOutline, keyOutline });
  }

  async ngOnInit() {
    await this.cargarUsuarios();
    await this.cargarSolicitudes();
  }

  ionViewWillEnter() {
    this.cargarUsuarios();
    this.cargarSolicitudes();
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

  // password solo se valida si se ingresó

  if (this.nuevoPassword && this.nuevoPassword.length < 8) {
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
      const datos: any = {
            nombre: this.nuevoNombre.trim(),
            email : this.nuevoEmail.trim(),
            id_rol: Number(this.nuevoRol)
          };
          if (this.nuevoPassword) {
            datos.password = this.nuevoPassword;
          }
          await this.usuarioService.crearUsuario(datos);

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

  // Método toast reutilizable
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message : mensaje,
      duration: 2000,
      position: 'bottom',
      color   : color
    });
    await toast.present();
  }

  async cambiarRol(usuario: any) {
    try {
      await this.usuarioService.actualizarUsuario(usuario.id_usuario, {
        id_rol: Number(usuario.id_rol)
      });
      await this.mostrarToast('✅ Rol actualizado correctamente');
    } catch (error: any) {
      const err = this.errorService.traducir(error);
      await this.mostrarToast(err.mensaje, 'danger');
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

  // cambio de contraseña

  abrirCambioPassword(usuario: any) {
    this.usuarioSeleccionado  = usuario;
    this.nuevaPassword        = '';
    this.errorPassword        = '';
    this.mostrarNuevaPassword = false;
    this.mostrarCambioPassword = true;
  }

  cerrarCambioPassword() {
    this.mostrarCambioPassword = false;
    this.usuarioSeleccionado   = null;
    this.nuevaPassword         = '';
    this.errorPassword         = '';
  }

  async cambiarPassword() {
    if (!this.nuevaPassword || this.nuevaPassword.length < 8) {
      this.errorPassword = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.cambiandoPassword = true;
    this.errorPassword     = '';

    try {
      await this.usuarioService.actualizarUsuario(
        this.usuarioSeleccionado.id_usuario,
        { password: this.nuevaPassword }
      );
      alert(`✅ Contraseña actualizada correctamente.\n\nRecuerda comunicar la nueva contraseña a ${this.usuarioSeleccionado.nombre} por WhatsApp de Mesa de Ayuda.`);
      this.cerrarCambioPassword();
    } catch (error) {
      this.errorPassword = 'Error al cambiar la contraseña. Intenta de nuevo.';
    } finally {
      this.cambiandoPassword = false;
    }
  }

  // solicitud de cambio de contraseña
  
  async cargarSolicitudes() {
    try {
      this.solicitudes = await this.usuarioService.listarSolicitudes();
    } catch (error) {
      this.solicitudes = [];
    }
  }

  async atenderSolicitud(solicitud: any) {
    try {
      await this.usuarioService.atenderSolicitud(solicitud.id_solicitud);
      await this.mostrarToast('✅ Solicitud atendida — comunica la nueva contraseña por WhatsApp de Mesa de Ayuda');
      await this.cargarSolicitudes();
    } catch (error: any) {
    const err = this.errorService.traducir(error);
    await this.mostrarToast(err.mensaje, 'danger');
    }
  }
}