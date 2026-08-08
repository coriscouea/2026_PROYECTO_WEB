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
  IonBackButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, peopleOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector   : 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls  : ['./usuarios.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon
  ]
})
export class UsuariosPage implements OnInit {

  usuarios: any[]   = [];
  cargando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router        : Router
  ) {
    addIcons({ trashOutline, peopleOutline });
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