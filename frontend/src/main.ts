import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { APP_INITIALIZER, ErrorHandler, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import * as Sentry from '@sentry/capacitor';
import * as SentryAngular from '@sentry/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// =============================================================
// Inicialización de Sentry — Monitoreo de fallos en producción
// =============================================================
// Solo activo en producción — no registra en desarrollo
// Filtra el header Authorization para no registrar tokens JWT
// Usa identificador interno de usuario — nunca email ni DNI
// =============================================================

Sentry.init(
  {
    dsn    : 'https://070ba2eaa862fbeb671669bb6cb7f6dd@o4512133201985536.ingest.us.sentry.io/4512133220728832',
    enabled: environment.production,
    environment: environment.production ? 'production' : 'development',
    release: '1.0.0',

    // Filtrar datos sensibles — nunca registrar tokens ni datos personales
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['authorization'];
      }
      return event;
    },

    // Muestreo — captura el 100% de errores en producción
    tracesSampleRate: 0.0  // Sin trazado de rendimiento — solo errores
  },
  SentryAngular.init
);

// PRUEBA SENTRY — eliminar después de verificar
/*Sentry.captureException(new Error('HelpDesk Web — prueba de monitoreo Sentry OK'));*/

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // Integración de Sentry con el ErrorHandler de Angular
    {
      provide: ErrorHandler,
      useValue: SentryAngular.createErrorHandler({ showDialog: false })
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Router],
      multi: true
    }
  ],
});