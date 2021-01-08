import { createEnvironmentSettings } from '@/environments/create-environment-settings';

export const environment = createEnvironmentSettings({
  production: true,
  apiUrl: 'https://test-eb-3.easy-booking.at/easybooking/index.php/juliaAngular',
  loginUrl: 'https://test-eb-3.easy-booking.at/login/beta/'
});
