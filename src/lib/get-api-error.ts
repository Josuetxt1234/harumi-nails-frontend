import axios from 'axios';

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please verify that the backend is running.';
  }

  return fallback;
}
