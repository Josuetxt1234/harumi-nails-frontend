import axios from 'axios';
import i18n from '../i18n';

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
}

const EXACT_MESSAGE_KEYS: Record<string, string> = {
  'Invalid credentials': 'auth:invalid_credentials',
  'Invalid email or password.': 'auth:invalid_credentials',
  'Insufficient stock to perform output movement':
    'notifications:insufficient_stock',
  'Material code already exists.': 'errors:material_code_exists',
  'A material with this code already exists.': 'errors:material_code_exists',
  'Voucher already applied or cancelled': 'errors:voucher_applied',
  'Voucher cannot be cancelled': 'errors:voucher_cannot_cancel',
  'Payroll has already been generated': 'errors:payroll_already_generated',
  'Only a DRAFT payroll can be closed.': 'errors:payroll_not_draft',
  'Only a PENDING voucher can be cancelled.': 'errors:voucher_not_pending',
  'Only Super Admin can cancel vouchers from previous days':
    'errors:voucher_cancel_previous_day',
  'Advance not found.': 'errors:voucher_not_found',
  'Material not found.': 'errors:material_not_found',
  'Category not found.': 'errors:category_not_found',
  'Unauthorized access.': 'errors:unauthorized',
  'This session has been revoked.': 'auth:session_expired',
  'This session has been revoked for security reasons. Please log in again.':
    'auth:session_expired',
  'Invalid or expired refresh token.': 'auth:session_expired',
};

export function getApiErrorMessage(
  error: unknown,
  fallbackKey = 'notifications:error',
): string {
  const fallback = i18n.t(fallbackKey);

  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    if (error instanceof Error && error.message) {
      return translateKnownMessage(error.message, fallback);
    }
    return fallback;
  }

  if (error.message === 'Network Error') {
    return i18n.t('errors:network');
  }

  const message = error.response?.data?.message;
  const raw = Array.isArray(message) ? message[0] : message;

  if (typeof raw === 'string' && raw.length > 0) {
    return translateKnownMessage(raw, raw);
  }

  return fallback;
}

function translateKnownMessage(message: string, fallback: string): string {
  const mapped = EXACT_MESSAGE_KEYS[message];
  if (mapped) {
    return i18n.t(mapped);
  }

  const lower = message.toLowerCase();
  if (lower.includes('insufficient stock')) {
    return i18n.t('notifications:insufficient_stock');
  }
  if (lower.includes('invalid credential') || lower.includes('invalid email')) {
    return i18n.t('auth:invalid_credentials');
  }
  if (lower.includes('already been generated') || lower.includes('same period')) {
    return i18n.t('errors:payroll_already_generated');
  }

  return fallback;
}
