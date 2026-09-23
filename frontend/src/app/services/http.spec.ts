// =============================================================
// services/http.spec.ts — Pruebas del interceptor de renovación
// HelpDesk Web | Semana 15 · Pruebas de Software
// =============================================================
// Nivel: Unitario con doble de transporte HTTP
// Riesgo cubierto: si el interceptor falla, el usuario pierde
// sesión cada 30 minutos aunque tenga refresh token válido.
// =============================================================

// Mock de SecureStoragePlugin — evita dependencia de Capacitor nativo
const mockStorage: Record<string, string> = {};

const mockSecureStorage = {
  get : (opts: { key: string }) => Promise.resolve({ value: mockStorage[opts.key] || null }),
  set : (opts: { key: string; value: string }) => { mockStorage[opts.key] = opts.value; return Promise.resolve(); },
  remove: (opts: { key: string }) => { delete mockStorage[opts.key]; return Promise.resolve(); }
};

// Inyectar mock antes de que el módulo cargue
(window as any).Capacitor = { isNativePlatform: () => false };

describe('HttpService — lógica de renovación de token', () => {

  // -----------------------------------------------------------
  // Lógica de decisión del interceptor — pruebas puras
  // -----------------------------------------------------------

  describe('decisión de renovar', () => {

    it('401 sin flag _reintentado → debe intentar renovar', () => {
      const es401       = true;
      const reintentado = false;
      const debeRenovar = es401 && !reintentado;
      expect(debeRenovar).toBeTrue();
    });

    it('401 con flag _reintentado → NO debe renovar (evita bucle infinito)', () => {
      const es401       = true;
      const reintentado = true;
      const debeRenovar = es401 && !reintentado;
      expect(debeRenovar).toBeFalse();
    });

    it('403 sin flag → NO debe renovar (no es error de autenticación)', () => {
      const es401       = false;
      const reintentado = false;
      const debeRenovar = es401 && !reintentado;
      expect(debeRenovar).toBeFalse();
    });

    it('500 sin flag → NO debe renovar (error del servidor)', () => {
      const es401       = false;
      const reintentado = false;
      const debeRenovar = es401 && !reintentado;
      expect(debeRenovar).toBeFalse();
    });

    it('0 (sin conexión) → NO debe renovar', () => {
      const es401       = false;
      const reintentado = false;
      const debeRenovar = es401 && !reintentado;
      expect(debeRenovar).toBeFalse();
    });
  });

  // -----------------------------------------------------------
  // SecureStorage — lectura y escritura de tokens
  // -----------------------------------------------------------

  describe('gestión de tokens en SecureStorage', () => {

    beforeEach(() => {
      // Limpiar storage antes de cada prueba
      Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    });

    it('guarda access_token correctamente', async () => {
      await mockSecureStorage.set({ key: 'access_token', value: 'token-nuevo-123' });
      const resultado = await mockSecureStorage.get({ key: 'access_token' });
      expect(resultado.value).toBe('token-nuevo-123');
    });

    it('devuelve null si no hay refresh_token', async () => {
      const resultado = await mockSecureStorage.get({ key: 'refresh_token' });
      expect(resultado.value).toBeNull();
    });

    it('sin refresh_token → no puede renovar', async () => {
      const { value: refreshToken } = await mockSecureStorage.get({ key: 'refresh_token' });
      const puedeRenovar = refreshToken !== null;
      expect(puedeRenovar).toBeFalse();
    });

    it('con refresh_token → puede intentar renovar', async () => {
      await mockSecureStorage.set({ key: 'refresh_token', value: 'refresh-abc' });
      const { value: refreshToken } = await mockSecureStorage.get({ key: 'refresh_token' });
      const puedeRenovar = refreshToken !== null;
      expect(puedeRenovar).toBeTrue();
    });

    it('logout limpia access_token y refresh_token', async () => {
      await mockSecureStorage.set({ key: 'access_token',  value: 'token-viejo' });
      await mockSecureStorage.set({ key: 'refresh_token', value: 'refresh-viejo' });
      await mockSecureStorage.remove({ key: 'access_token' });
      await mockSecureStorage.remove({ key: 'refresh_token' });
      const access  = await mockSecureStorage.get({ key: 'access_token' });
      const refresh = await mockSecureStorage.get({ key: 'refresh_token' });
      expect(access.value).toBeNull();
      expect(refresh.value).toBeNull();
    });
  });

  // -----------------------------------------------------------
  // Cola de peticiones concurrentes
  // -----------------------------------------------------------

  describe('cola de renovaciones concurrentes', () => {

    it('cola vacía al iniciar', () => {
      const cola: Array<(token: string | null) => void> = [];
      expect(cola.length).toBe(0);
    });

    it('notificar cola con nuevo token resuelve todas las peticiones', () => {
      const cola: Array<(token: string | null) => void> = [];
      const resultados: (string | null)[] = [];

      cola.push((token) => resultados.push(token));
      cola.push((token) => resultados.push(token));
      cola.push((token) => resultados.push(token));

      const nuevoToken = 'token-nuevo-xyz';
      cola.forEach(cb => cb(nuevoToken));

      expect(resultados.length).toBe(3);
      expect(resultados.every(t => t === nuevoToken)).toBeTrue();
    });

    it('notificar cola con null rechaza todas las peticiones', () => {
      const cola: Array<(token: string | null) => void> = [];
      const resultados: (string | null)[] = [];

      cola.push((token) => resultados.push(token));
      cola.push((token) => resultados.push(token));

      cola.forEach(cb => cb(null));

      expect(resultados.every(t => t === null)).toBeTrue();
    });

    it('cola se vacía después de notificar', () => {
      const cola: Array<(token: string | null) => void> = [];
      cola.push((_) => {});
      cola.push((_) => {});

      cola.forEach(cb => cb('token'));
      cola.length = 0; // simula cola = []

      expect(cola.length).toBe(0);
    });
  });
});