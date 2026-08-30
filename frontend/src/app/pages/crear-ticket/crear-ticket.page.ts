// =============================================================
// crear-ticket.page.ts — Lógica de Crear Ticket
// HelpDesk Web | Feature 014 · Frontend Tickets
// =============================================================
// Responsabilidad: gestiona el formulario de creación de ticket
// con validación al abandonar cada campo y al enviar.
// Mapea errores 422 del backend al campo correspondiente.
// =============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { TicketService } from '../../services/ticket';
import { ErrorService } from '../../services/error';

@Component({
  selector   : 'app-crear-ticket',
  templateUrl: './crear-ticket.page.html',
  styleUrls  : ['./crear-ticket.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonSpinner
  ]
})
export class CrearTicketPage {

  private readonly FORM_KEY = 'crear_ticket_draft';

  // Estado efímero — datos del formulario, se pierden al cerrar la pantalla
  titulo      : string = '';
  descripcion : string = '';
  idCategoria : number = 0;
  prioridad   : string = '';
  enviando    : boolean = false;
  private ticketGuardado: boolean = false; 

  // Errores por campo — mapeados desde validación local y respuesta 422
  errores: Record<string, string> = {
    titulo     : '',
    descripcion: '',
    categoria  : '',
    prioridad  : ''
  };

  // Campos tocados — activa la validación al abandonar el campo
  tocados: Record<string, boolean> = {
    titulo     : false,
    descripcion: false
  };

  categorias = [
    { id: 1, label: '⚙ Técnica' },
    { id: 2, label: '🌐 Redes'  },
    { id: 3, label: '📊 ERP'    }
  ];

  constructor(
    private ticketService: TicketService,
    private router       : Router,
    private errorService : ErrorService,
    private toastCtrl   : ToastController,
  ) {}

  // Valida el título al abandonar el campo
  validarTitulo() {
    this.tocados['titulo'] = true;
    if (!this.titulo.trim()) {
      this.errores['titulo'] = 'El título es obligatorio';
    } else if (this.titulo.trim().length < 5) {
      this.errores['titulo'] = 'El título debe tener al menos 5 caracteres';
    } else if (this.titulo.trim().length > 150) {
      this.errores['titulo'] = 'El título no puede superar 150 caracteres';
    } else {
      this.errores['titulo'] = '';
    }
  }

  // Valida la descripción al abandonar el campo
  validarDescripcion() {
    this.tocados['descripcion'] = true;
    if (!this.descripcion.trim()) {
      this.errores['descripcion'] = 'La descripción es obligatoria';
    } else if (this.descripcion.trim().length < 10) {
      this.errores['descripcion'] = 'La descripción debe tener al menos 10 caracteres';
    } else {
      this.errores['descripcion'] = '';
    }
  }

  // Valida la categoría al seleccionar
  validarCategoria() {
    if (!this.idCategoria) {
      this.errores['categoria'] = 'Selecciona una categoría';
    } else {
      this.errores['categoria'] = '';
    }
  }

  // Valida la prioridad al seleccionar
  validarPrioridad() {
    if (!this.prioridad) {
      this.errores['prioridad'] = 'Selecciona una prioridad';
    } else {
      this.errores['prioridad'] = '';
    }
  }

  // Verifica si el formulario es válido para habilitar el botón
  formularioValido(): boolean {
    return (
      this.titulo.trim().length >= 5 &&
      this.descripcion.trim().length >= 10 &&
      !!this.idCategoria &&
      !!this.prioridad
    );
  }

  // Muestra toast de feedback al usuario
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message : mensaje,
      duration: 2000,
      position: 'bottom',
      color   : color
    });
    await toast.present();
  }

  async crearTicket() {

    // Valida todos los campos antes de enviar
    this.validarTitulo();
    this.validarDescripcion();
    this.validarCategoria();
    this.validarPrioridad();

    // Detiene el envío si hay errores
    if (!this.formularioValido()) return;

    this.enviando = true;

    try {
      // Obtiene el id del usuario desde el token almacenado
      const tokenResult = await Preferences.get({ key: 'access_token' });
      const token       = tokenResult.value || '';
      const payload     = JSON.parse(atob(token.split('.')[1]));
      const idUsuario   = parseInt(payload.sub);

      await this.ticketService.crearTicket({
        titulo      : this.titulo.trim(),
        descripcion : this.descripcion.trim(),
        id_categoria: this.idCategoria,
        prioridad   : this.prioridad,
        id_usuario  : idUsuario
      });

      await this.mostrarToast('✅ Ticket creado correctamente');
      this.ticketGuardado = true;      // marca que el ticket fue guardado
      await this.limpiarBorrador();   // elimina el borrador tras crear exitosamente
      this.router.navigate(['/tickets']);


    } catch (error: any) {

      // Mapea errores 422 del backend al campo correspondiente
      if (error.response?.status === 422) {
        const detalles = error.response?.data?.detail || [];
        if (Array.isArray(detalles)) {
          detalles.forEach((err: any) => {
            const campo = err.loc?.[err.loc.length - 1];
            if (campo === 'titulo')      this.errores['titulo']      = err.msg;
            if (campo === 'descripcion') this.errores['descripcion'] = err.msg;
            if (campo === 'id_categoria') this.errores['categoria']  = err.msg;
            if (campo === 'prioridad')   this.errores['prioridad']   = err.msg;
          });
        } else {
          await this.mostrarToast('Verifica los datos ingresados', 'warning');
        }
      } else {
        const err = this.errorService.traducir(error);
        await this.mostrarToast(err.mensaje, 'danger');
      }
    } finally {
      this.enviando = false;
    }
  }

  // Guarda el estado actual del formulario en Preferences
  async guardarBorrador() {
    await Preferences.set({
      key  : this.FORM_KEY,
      value: JSON.stringify({
        titulo     : this.titulo,
        descripcion: this.descripcion,
        idCategoria: this.idCategoria,
        prioridad  : this.prioridad
      })
    });
  }

  // Restaura el borrador guardado al entrar a la pantalla
  async restaurarBorrador() {
    const result = await Preferences.get({ key: this.FORM_KEY });
    if (result.value) {
      const borrador   = JSON.parse(result.value);
      this.titulo      = borrador.titulo      || '';
      this.descripcion = borrador.descripcion || '';
      this.idCategoria = borrador.idCategoria || 0;
      this.prioridad   = borrador.prioridad   || '';
    }
  }
  // Elimina el borrador al crear el ticket exitosamente
  async limpiarBorrador() {
    await Preferences.remove({ key: this.FORM_KEY });
  }

  // Restaura el borrador al entrar a la pantalla
  async ionViewWillEnter() {
    await this.restaurarBorrador();
  }

  // Guarda el borrador al salir de la pantalla
  async ionViewWillLeave() {
    if (!this.ticketGuardado){
    await this.guardarBorrador();
    }
  }
}