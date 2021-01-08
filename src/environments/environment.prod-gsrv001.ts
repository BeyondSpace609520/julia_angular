import { createEnvironmentSettings } from '@/environments/create-environment-settings';

export const environment = createEnvironmentSettings({
  production: true,
  remoteUrl: 'https://gsrv001.easy-booking.at/',
  apiUrl: 'https://gsrv001.easy-booking.at/easybooking/index.php/juliaAngular',
  legacyContentUrl: 'https://gsrv001.easy-booking.at',
  loginUrl: 'https://www.easy-booking.at/login/',
});
