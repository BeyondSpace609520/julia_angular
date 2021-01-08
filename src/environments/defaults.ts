import { EnvironmentSettings } from '@/environments/models';

export const environmentDefaults: EnvironmentSettings = {
  production: false,
  remoteUrl: 'https://test-eb-3.easy-booking.at/',
  apiUrl: '/api',
  legacyContentUrl: 'https://test-eb-3.easy-booking.at',
  calendarUrl: '/easybookingBackend_prod/calendars/bookings',
  mediaUrl: 'https://media.easy-booking.at',
  mockServer: false,
  loginUrl: 'https://test-eb-3.easy-booking.at/login_DEV/',
  startupWindow: 'calendarHTML',
  livezillaId: '1bd28104c466d9f78b0b025a6469e56f'
};
