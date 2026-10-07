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
  const trimmed = (raw ?? 'http://localhost:3000/api').trim().replace(/\/+$/, '');

  if (!trimmed) {
    return 'http://localhost:3000/api';
  }

  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

const baseURL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

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

let refreshPromise: Promise<string | null> | null = null;

function expireAuthSession(): void {
  clearAccessToken();
  clearStoredSession();
  notifyAuthSessionExpired();
}

async function refreshAccessToken(): Promise<string | null> {
  // No body: the refresh token is read from the HttpOnly cookie.
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

  setAccessToken(data.accessToken);
  markSessionActive(getRememberMePreference(), data.user.email);

  return data.accessToken;
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

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
        .catch(() => {
          expireAuthSession();
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  },
);

export default api;
