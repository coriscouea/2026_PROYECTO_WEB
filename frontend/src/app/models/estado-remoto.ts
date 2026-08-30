// =============================================================
// models/estado-remoto.ts — Tipo cerrado de estado remoto
// HelpDesk Web | Semana 11 · Manejo de estado
// =============================================================
// Responsabilidad: modela los estados de una operación remota
// con casos mutuamente excluyentes. Garantiza que la interfaz
// siempre muestra exactamente uno de los cuatro estados posibles.
// =============================================================

// Los cuatro estados de cualquier operación remota
export type EstadoRemoto<T> =
  | { tipo: 'cargando' }
  | { tipo: 'exito';   datos: T }
  | { tipo: 'vacio' }
  | { tipo: 'error';   mensaje: string; puedeReintentar: boolean };

// Constructores para crear cada estado de forma explícita
export const EstadoRemoto = {

  // Estado inicial — operación en curso
  cargando: (): EstadoRemoto<never> =>
    ({ tipo: 'cargando' }),

  // Estado de éxito con datos disponibles
  exito: <T>(datos: T): EstadoRemoto<T> =>
    ({ tipo: 'exito', datos }),

  // Estado de lista vacía — operación exitosa sin resultados
  vacio: (): EstadoRemoto<never> =>
    ({ tipo: 'vacio' }),

  // Estado de error con mensaje y opción de reintento
  error: (mensaje: string, puedeReintentar: boolean = true): EstadoRemoto<never> =>
    ({ tipo: 'error', mensaje, puedeReintentar })
};