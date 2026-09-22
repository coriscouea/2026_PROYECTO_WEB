// =============================================================
// crear-ticket.page.spec.ts — Pruebas unitarias de validadores
// HelpDesk Web | Semana 15 · Pruebas de Software
// =============================================================
// Nivel: Unitario
// Riesgo cubierto: datos inválidos llegan al backend produciendo
// errores 422 difíciles de rastrear para el usuario.
// Ejecuta sin conexión, sin emulador, en cualquier orden.
// =============================================================

import { CrearTicketPage } from './crear-ticket.page';

// Doble mínimo para las dependencias del componente
const mockTicketService    = jasmine.createSpyObj('TicketService', ['crearTicket']);
const mockRouter           = jasmine.createSpyObj('Router', ['navigate']);
const mockErrorService     = jasmine.createSpyObj('ErrorService', ['traducir']);
const mockToastCtrl        = jasmine.createSpyObj('ToastController', ['create']);
const mockCameraService    = jasmine.createSpyObj('CameraService', ['estaDisponible', 'tomarFoto', 'elegirFoto', 'abrirAjustes']);

describe('CrearTicketPage — validadores', () => {

  let page: CrearTicketPage;

  beforeEach(() => {
    mockCameraService.estaDisponible.and.returnValue(false);
    page = new CrearTicketPage(
      mockTicketService,
      mockRouter,
      mockErrorService,
      mockToastCtrl,
      mockCameraService
    );
  });

  // -----------------------------------------------------------
  // validarTitulo
  // -----------------------------------------------------------

  it('titulo vacio → error obligatorio', () => {
    page.titulo = '';
    page.validarTitulo();
    expect(page.errores['titulo']).toBe('El título es obligatorio');
  });

  it('titulo muy corto (3 chars) → error minimo', () => {
    page.titulo = 'abc';
    page.validarTitulo();
    expect(page.errores['titulo']).toBe('El título debe tener al menos 5 caracteres');
  });

  it('titulo muy largo (151 chars) → error maximo', () => {
    page.titulo = 'a'.repeat(151);
    page.validarTitulo();
    expect(page.errores['titulo']).toBe('El título no puede superar 150 caracteres');
  });

  it('titulo valido (10 chars) → sin error', () => {
    page.titulo = 'Falla grave';
    page.validarTitulo();
    expect(page.errores['titulo']).toBe('');
  });

  // -----------------------------------------------------------
  // validarDescripcion
  // -----------------------------------------------------------

  it('descripcion vacia → error obligatorio', () => {
    page.descripcion = '';
    page.validarDescripcion();
    expect(page.errores['descripcion']).toBe('La descripción es obligatoria');
  });

  it('descripcion muy corta (5 chars) → error minimo', () => {
    page.descripcion = 'corta';
    page.validarDescripcion();
    expect(page.errores['descripcion']).toBe('La descripción debe tener al menos 10 caracteres');
  });

  it('descripcion valida → sin error', () => {
    page.descripcion = 'El equipo no enciende al presionar el botón de encendido.';
    page.validarDescripcion();
    expect(page.errores['descripcion']).toBe('');
  });

  // -----------------------------------------------------------
  // validarCategoria
  // -----------------------------------------------------------

  it('categoria no seleccionada → error', () => {
    page.idCategoria = 0;
    page.validarCategoria();
    expect(page.errores['categoria']).toBe('Selecciona una categoría');
  });

  it('categoria seleccionada → sin error', () => {
    page.idCategoria = 1;
    page.validarCategoria();
    expect(page.errores['categoria']).toBe('');
  });

  // -----------------------------------------------------------
  // validarPrioridad
  // -----------------------------------------------------------

  it('prioridad no seleccionada → error', () => {
    page.prioridad = '';
    page.validarPrioridad();
    expect(page.errores['prioridad']).toBe('Selecciona una prioridad');
  });

  it('prioridad seleccionada → sin error', () => {
    page.prioridad = 'alta';
    page.validarPrioridad();
    expect(page.errores['prioridad']).toBe('');
  });

  // -----------------------------------------------------------
  // formularioValido
  // -----------------------------------------------------------

  it('formulario incompleto → invalido', () => {
    page.titulo      = '';
    page.descripcion = '';
    page.idCategoria = 0;
    page.prioridad   = '';
    expect(page.formularioValido()).toBeFalse();
  });

  it('formulario completo y valido → valido', () => {
    page.titulo      = 'Falla en equipo de computo';
    page.descripcion = 'El equipo del area administrativa no enciende correctamente.';
    page.idCategoria = 1;
    page.prioridad   = 'alta';
    expect(page.formularioValido()).toBeTrue();
  });

  it('titulo valido pero descripcion corta → formulario invalido', () => {
    page.titulo      = 'Falla en red';
    page.descripcion = 'corta';
    page.idCategoria = 1;
    page.prioridad   = 'media';
    expect(page.formularioValido()).toBeFalse();
  });
});