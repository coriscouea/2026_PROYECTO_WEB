// =============================================================
// guards/auth.guard.ts — Guard de Autenticación
// HelpDesk Web | Feature 013 · Frontend Login
// =============================================================
// Responsabilidad: verifica que el usuario tenga token válido
// antes de acceder a rutas protegidas. Si no hay token,
// redirige al login automáticamente.
// =============================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  const autenticado = await authService.isAuthenticated();

  if (!autenticado) {

    // Conserva la URL pretendida para redirigir tras el login

    router.navigate(['/login'], {
      queryParams: { redirectUrl: state.url}
    });
    
    return false;
  }

  return true;
};
