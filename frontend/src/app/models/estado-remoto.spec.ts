// =============================================================
// models/estado-remoto.spec.ts — Pruebas unitarias EstadoRemoto
// HelpDesk Web | Semana 15 · Pruebas de Software
// =============================================================
// Nivel: Unitario
// Riesgo cubierto: un estado inválido en la bandeja principal
// puede mostrar spinner indefinidamente o pantalla vacía,
// bloqueando el acceso a todos los tickets del sistema.
// Ejecuta sin conexión, sin emulador, en cualquier orden.
// =============================================================

import { EstadoRemoto } from './estado-remoto';

describe('EstadoRemoto — modelo de estado de la bandeja', () => {

  // -----------------------------------------------------------
  // Estado cargando
  // -----------------------------------------------------------

  it('cargando → tipo es cargando', () => {
    const estado = EstadoRemoto.cargando();
    expect(estado.tipo).toBe('cargando');
  });

  it('cargando → no tiene datos ni mensaje', () => {
    const estado = EstadoRemoto.cargando();
    expect((estado as any).datos).toBeUndefined();
    expect((estado as any).mensaje).toBeUndefined();
  });

  // -----------------------------------------------------------
  // Estado exito
  // -----------------------------------------------------------

  it('exito → tipo es exito', () => {
    const estado = EstadoRemoto.exito([]);
    expect(estado.tipo).toBe('exito');
  });

  it('exito → contiene los datos recibidos', () => {
    const tickets = [{ id_ticket: 1, titulo: 'Falla en red' }];
    const estado  = EstadoRemoto.exito(tickets);
    if (estado.tipo === 'exito') {
      expect(estado.datos).toEqual(tickets);
      expect(estado.datos.length).toBe(1);
    }
  });

  it('exito con lista vacia → datos es array vacio', () => {
    const estado = EstadoRemoto.exito([]);
    if (estado.tipo === 'exito') {
      expect(estado.datos).toEqual([]);
    }
  });

  // -----------------------------------------------------------
  // Estado vacio
  // -----------------------------------------------------------

  it('vacio → tipo es vacio', () => {
    const estado = EstadoRemoto.vacio();
    expect(estado.tipo).toBe('vacio');
  });

  it('vacio → no tiene datos ni mensaje', () => {
    const estado = EstadoRemoto.vacio();
    expect((estado as any).datos).toBeUndefined();
    expect((estado as any).mensaje).toBeUndefined();
  });

  // -----------------------------------------------------------
  // Estado error
  // -----------------------------------------------------------

  it('error → tipo es error', () => {
    const estado = EstadoRemoto.error('Sin conexión');
    expect(estado.tipo).toBe('error');
  });

  it('error → contiene el mensaje', () => {
    const estado = EstadoRemoto.error('Sin conexión');
    if (estado.tipo === 'error') {
      expect(estado.mensaje).toBe('Sin conexión');
    }
  });

  it('error → puedeReintentar es true por defecto', () => {
    const estado = EstadoRemoto.error('Error del servidor');
    if (estado.tipo === 'error') {
      expect(estado.puedeReintentar).toBeTrue();
    }
  });

  it('error → puedeReintentar puede ser false', () => {
    const estado = EstadoRemoto.error('Sin permiso', false);
    if (estado.tipo === 'error') {
      expect(estado.puedeReintentar).toBeFalse();
    }
  });

  // -----------------------------------------------------------
  // Mutua exclusión — solo un tipo activo a la vez
  // -----------------------------------------------------------

  it('los 4 estados tienen tipos distintos', () => {
    const tipos = [
      EstadoRemoto.cargando().tipo,
      EstadoRemoto.exito([]).tipo,
      EstadoRemoto.vacio().tipo,
      EstadoRemoto.error('error').tipo
    ];
    const tiposUnicos = new Set(tipos);
    expect(tiposUnicos.size).toBe(4);
  });

  it('cargando y exito son estados distintos', () => {
    const cargando = EstadoRemoto.cargando();
    const exito    = EstadoRemoto.exito([]);
    expect(cargando.tipo).not.toBe(exito.tipo);
  });

  it('vacio y error son estados distintos', () => {
    const vacio = EstadoRemoto.vacio();
    const error = EstadoRemoto.error('error');
    expect(vacio.tipo).not.toBe(error.tipo);
  });
});