import i18n from '../i18n';
import { SALON_TIMEZONE } from './salon-timezone';

const PAYMENT_METHOD_KEYS: Record<string, string> = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card',
};

export function getPaymentMethodLabel(method: string): string {
  const key = PAYMENT_METHOD_KEYS[method];
  return key ? i18n.t(`pos:${key}`) : method;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const locale = i18n.resolvedLanguage?.startsWith('es') ? 'es-EC' : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    timeZone: SALON_TIMEZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatTime(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const locale = i18n.resolvedLanguage?.startsWith('es') ? 'es-EC' : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    timeZone: SALON_TIMEZONE,
    timeStyle: 'short',
  }).format(date);
}

export function formatShortTicketId(id: string): string {
  const compact = id.replace(/-/g, '');
  return compact.slice(-8).toUpperCase();
}
