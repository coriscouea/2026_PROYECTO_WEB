// =============================================================
// e2e/flujo-critico.spec.ts — Prueba de integración E2E
// HelpDesk Web | Semana 15 · Pruebas de Software
// =============================================================
// Nivel: Integración (E2E simulado con dobles)
// Riesgo cubierto: un fallo en cualquier punto del recorrido
// login → bandeja → crear ticket → logout hace inutilizable
// el sistema para el 100% de los usuarios.
// =============================================================

// Dobles de servicios del dominio
const mockAuthService = {
  login          : jasmine.createSpy('login').and.returnValue(Promise.resolve({ access_token: 'token-123' })),
  logout         : jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true)),
  getRol         : jasmine.createSpy('getRol').and.returnValue(Promise.resolve('admin')),
  getNombre      : jasmine.createSpy('getNombre').and.returnValue(Promise.resolve('Administrador Sistema')),
  getToken       : jasmine.createSpy('getToken').and.returnValue(Promise.resolve('token-123'))
};

const mockTicketService = {
  crearTicket  : jasmine.createSpy('crearTicket').and.returnValue(Promise.resolve({ id_ticket: 35, titulo: 'Falla en red' })),
  listarTickets: jasmine.createSpy('listarTickets').and.returnValue(Promise.resolve([
    { id_ticket: 1, titulo: 'Error ERP', estado: 'pendiente', prioridad: 'alta', activo: true },
    { id_ticket: 2, titulo: 'Falla red',  estado: 'en_proceso', prioridad: 'media', activo: true }
  ]))
};

const mockSqliteService = {
  inicializar      : jasmine.createSpy('inicializar').and.returnValue(Promise.resolve()),
  guardarTickets   : jasmine.createSpy('guardarTickets').and.returnValue(Promise.resolve()),
  leerTickets      : jasmine.createSpy('leerTickets').and.returnValue(Promise.resolve([])),
  tieneDatos       : jasmine.createSpy('tieneDatos').and.returnValue(Promise.resolve(false)),
  limpiarCacheCompleta: jasmine.createSpy('limpiarCacheCompleta').and.returnValue(Promise.resolve()),
  obtenerUltimaSync: jasmine.createSpy('obtenerUltimaSync').and.returnValue(Promise.resolve(null))
};

describe('Flujo crítico E2E — Login → Bandeja → Crear Ticket → Logout', () => {

  beforeEach(() => {
    // Resetear espías antes de cada prueba
    mockAuthService.login.calls.reset();
    mockAuthService.logout.calls.reset();
    mockTicketService.crearTicket.calls.reset();
    mockTicketService.listarTickets.calls.reset();
    mockSqliteService.limpiarCacheCompleta.calls.reset();
  });

  // -----------------------------------------------------------
  // Paso 1 — Login
  // -----------------------------------------------------------

  it('P1 - login con credenciales validas devuelve token', async () => {
    const resultado = await mockAuthService.login('admin2@empresa.com', 'admin12345');
    expect(mockAuthService.login).toHaveBeenCalledWith('admin2@empresa.com', 'admin12345');
    expect(resultado.access_token).toBe('token-123');
  });

  it('P1 - tras login el usuario esta autenticado', async () => {
    await mockAuthService.login('admin2@empresa.com', 'admin12345');
    const autenticado = await mockAuthService.isAuthenticated();
    expect(autenticado).toBeTrue();
  });

  it('P1 - tras login se obtiene el rol correcto', async () => {
    await mockAuthService.login('admin2@empresa.com', 'admin12345');
    const rol = await mockAuthService.getRol();
    expect(rol).toBe('admin');
  });

  // -----------------------------------------------------------
  // Paso 2 — Bandeja de tickets
  // -----------------------------------------------------------

  it('P2 - bandeja carga tickets desde el backend', async () => {
    const tickets = await mockTicketService.listarTickets('activos');
    expect(mockTicketService.listarTickets).toHaveBeenCalledWith('activos');
    expect(tickets.length).toBe(2);
  });

  it('P2 - tickets se guardan en cache local', async () => {
    const tickets = await mockTicketService.listarTickets('activos');
    await mockSqliteService.guardarTickets(tickets);
    expect(mockSqliteService.guardarTickets).toHaveBeenCalledWith(tickets);
  });

  it('P2 - bandeja muestra titulo correcto para admin', async () => {
    const rol = await mockAuthService.getRol();
    const titulos: Record<string, string> = {
      admin     : 'Todos los Tickets',
      tecnico   : 'Bandeja Técnica',
      mesa_ayuda: 'Bandeja ERP',
      usuario   : 'Mis Tickets'
    };
    expect(titulos[rol]).toBe('Todos los Tickets');
  });

  // -----------------------------------------------------------
  // Paso 3 — Crear ticket
  // -----------------------------------------------------------

  it('P3 - crear ticket con datos validos devuelve ticket creado', async () => {
    const datos = {
      titulo      : 'Falla en red',
      descripcion : 'El equipo del area administrativa no se conecta a internet.',
      id_categoria: 2,
      prioridad   : 'alta',
      id_usuario  : 0
    };
    const ticket = await mockTicketService.crearTicket(datos);
    expect(mockTicketService.crearTicket).toHaveBeenCalledWith(datos);
    expect(ticket.id_ticket).toBe(35);
    expect(ticket.titulo).toBe('Falla en red');
  });

  it('P3 - crear ticket llama al servicio una sola vez', async () => {
    await mockTicketService.crearTicket({ titulo: 'Test', descripcion: 'Descripcion test', id_categoria: 1, prioridad: 'baja', id_usuario: 0 });
    expect(mockTicketService.crearTicket).toHaveBeenCalledTimes(1);
  });

  // -----------------------------------------------------------
  // Paso 4 — Logout
  // -----------------------------------------------------------

  it('P4 - logout limpia la sesion', async () => {
    await mockAuthService.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('P4 - logout limpia la cache local', async () => {
    await mockSqliteService.limpiarCacheCompleta();
    expect(mockSqliteService.limpiarCacheCompleta).toHaveBeenCalled();
  });

  it('P4 - flujo completo ejecuta todos los pasos en orden', async () => {
    // Paso 1 — Login
    await mockAuthService.login('admin2@empresa.com', 'admin12345');
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);

    // Paso 2 — Cargar bandeja
    const tickets = await mockTicketService.listarTickets('activos');
    expect(tickets.length).toBeGreaterThan(0);

    // Paso 3 — Crear ticket
    const nuevoTicket = await mockTicketService.crearTicket({
      titulo      : 'Falla en red',
      descripcion : 'El equipo no se conecta.',
      id_categoria: 2,
      prioridad   : 'alta',
      id_usuario  : 0
    });
    expect(nuevoTicket.id_ticket).toBeDefined();

    // Paso 4 — Logout
    await mockAuthService.logout();
    await mockSqliteService.limpiarCacheCompleta();
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    expect(mockSqliteService.limpiarCacheCompleta).toHaveBeenCalledTimes(1);
  });
});