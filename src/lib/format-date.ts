import { SALON_TIMEZONE } from './salon-timezone';

export function formatRegistrationDate(value: string): string {
  return new Date(value).toLocaleDateString('es-EC', {
    timeZone: SALON_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
