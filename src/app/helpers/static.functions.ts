import qs from 'query-string';

import { environment } from '@/environments/environment';

export function redirectToCustomer(customerId: number): void {
  window.location.href = `${location.origin}${location.pathname}?customer=${customerId}${location.hash}`;
}

export function redirectToLogin(parameters?: string[]): void {
  window.location.href = createLoginUrl(parameters);
}

function createLoginUrl(parameters?: string[]): string {
  const baseUrl = environment.loginUrl;
  const divider = baseUrl.match(/\?/) ? '&' : '?';
  return baseUrl + (parameters && parameters.length > 0 ? divider + parameters : '');
}

export function getParam(key: string, checkLocalStorage?: boolean): string | undefined {
  let value = qs.parse(location.search)[key];

  if (!value && checkLocalStorage) {
    value = localStorage.getItem(key);
  }

  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    value = value[0];
  }

  return value;
}

export function getNumericParam(key: string, checkLocalStorage?: boolean): number | undefined {
  const value = getParam(key, checkLocalStorage);
  if (value) {
    return +value;
  }
  return undefined;
}
