import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www',
  // El backend de desarrollo se expone por HTTP en la red local. Usar el
  // mismo esquema dentro del WebView evita que Android bloquee las llamadas
  // como contenido mixto.
  server: {
    androidScheme: 'http'
  }
};

export default config;
