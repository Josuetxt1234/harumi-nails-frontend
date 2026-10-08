import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../lib/access-token-store';
import {
  clearStoredSession,
  getRememberMePreference,
  markSessionActive,
} from '../lib/auth-storage';
import { notifyAuthSessionExpired } from '../lib/auth-session';
import type { LoginResponse } from '../types/auth.types';

function resolveApiBaseUrl(raw: string | undefined): string {
  let trimmed = (raw ?? 'http://localhost:3000/api').trim().replace(/\/+$/, '');

  if (!trimmed) {
    return 'http://localhost:3000/api';
  }

  // Without a scheme, Axios treats the host as a path on the Vercel origin
  // and POST /login hits the SPA (405) instead of Railway.
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

export const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_URL);
const baseURL = apiBaseUrl;

const api = axios.create({
  baseURL,
  // Required so the HttpOnly refresh cookie travels with /auth requests.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

let refreshPromise: Promise<LoginResponse | null> | null = null;

async function performRefresh(): Promise<LoginResponse> {
  // Raw Axios, not the `api` instance: a 401 here must not re-enter the
  // response interceptor and rotate the cookie a second time.
  const { data } = await axios.post<LoginResponse>(
    `${baseURL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!data?.accessToken || !data.user?.id) {
    throw new Error('Refresh response is missing the access token.');
  }

  setAccessToken(data.accessToken);
  markSessionActive(getRememberMePreference(), data.user.email);

  return data;
}

/**
 * One in-flight refresh for the whole tab. React StrictMode runs the boot
 * effect twice; a second POST would reuse a rotated token and revoke the session.
 */
export function refreshSessionSingleFlight(options?: {
  expireOnFailure?: boolean;
}): Promise<LoginResponse | null> {
  if (!refreshPromise) {
    const expireOnFailure = options?.expireOnFailure === true;

    refreshPromise = performRefresh()
      .catch(() => {
        clearAccessToken();
        clearStoredSession();

        if (expireOnFailure) {
          notifyAuthSessionExpired();
        }

        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshed = await refreshSessionSingleFlight({
      expireOnFailure: true,
    });
    const newAccessToken = refreshed?.accessToken ?? null;

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  },
);

export default api;
