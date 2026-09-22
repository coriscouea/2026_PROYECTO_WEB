import { ErrorService } from './error';

describe('ErrorService', () => {

  let service: ErrorService;

  beforeEach(() => {
    service = new ErrorService();
  });

  it('400 - datos invalidos', () => {
    const r = service.traducir({ response: { status: 400 } });
    expect(r.mensaje).toBe('Los datos enviados no son válidos.');
    expect(r.accion).toBe('corregir');
    expect(r.puedeReintentar).toBeFalse();
  });

  it('401 - sesion expirada', () => {
    const r = service.traducir({ response: { status: 401 } });
    expect(r.mensaje).toBe('Tu sesión ha expirado.');
    expect(r.accion).toBe('login');
    expect(r.puedeReintentar).toBeFalse();
  });

  it('403 - sin permiso', () => {
    const r = service.traducir({ response: { status: 403 } });
    expect(r.mensaje).toBe('No tienes permiso para realizar esta acción.');
    expect(r.accion).toBe('ninguna');
    expect(r.puedeReintentar).toBeFalse();
  });

  it('404 - no existe', () => {
    const r = service.traducir({ response: { status: 404 } });
    expect(r.mensaje).toBe('El elemento ya no existe.');
    expect(r.accion).toBe('volver');
    expect(r.puedeReintentar).toBeFalse();
  });

  it('422 - errores formulario', () => {
    const r = service.traducir({ response: { status: 422 } });
    expect(r.mensaje).toBe('Hay errores en el formulario.');
    expect(r.accion).toBe('corregir');
    expect(r.puedeReintentar).toBeFalse();
  });

  it('429 - demasiados intentos', () => {
    const r = service.traducir({ response: { status: 429 } });
    expect(r.mensaje).toBe('Demasiados intentos.');
    expect(r.accion).toBe('esperar');
    expect(r.puedeReintentar).toBeTrue();
  });

  it('500 - error servidor', () => {
    const r = service.traducir({ response: { status: 500 } });
    expect(r.mensaje).toBe('Error del servidor.');
    expect(r.accion).toBe('reintentar');
    expect(r.puedeReintentar).toBeTrue();
  });

  it('0 - sin conexion', () => {
    const r = service.traducir({ response: { status: 0 } });
    expect(r.mensaje).toBe('Sin conexión.');
    expect(r.accion).toBe('reintentar');
    expect(r.puedeReintentar).toBeTrue();
  });

  it('sin response - red caida', () => {
    const r = service.traducir({});
    expect(r.mensaje).toBe('Sin conexión.');
    expect(r.puedeReintentar).toBeTrue();
  });

  it('503 - codigo desconocido', () => {
    const r = service.traducir({ response: { status: 503 } });
    expect(r.mensaje).toBe('Ocurrió un error inesperado.');
    expect(r.puedeReintentar).toBeTrue();
    expect(r.accion).toBe('reintentar');
  });
});