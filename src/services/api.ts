import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getRememberMePreference,
  saveAuthSession,
} from '../lib/auth-storage';
import { notifyAuthSessionExpired } from '../lib/auth-session';
import type { LoginResponse } from '../types/auth.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
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
  clearAuthSession();
  notifyAuthSessionExpired();
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    expireAuthSession();
    return null;
  }

  const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

  const { data } = await axios.post<LoginResponse>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  saveAuthSession(
    data.accessToken,
    data.refreshToken,
    getRememberMePreference(),
    data.user.email,
  );

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
