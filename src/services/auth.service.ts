import {
  clearAuthSession,
  getRefreshToken,
  getRememberMePreference,
  saveAuthSession,
} from '../lib/auth-storage';
import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types';
import api from './api';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);

  saveAuthSession(
    data.accessToken,
    data.refreshToken,
    payload.rememberMe,
    payload.email,
  );

  return data;
}

export async function refreshSession(): Promise<LoginResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  const { data } = await api.post<LoginResponse>('/auth/refresh', {
    refreshToken,
  });

  saveAuthSession(
    data.accessToken,
    data.refreshToken,
    getRememberMePreference(),
    data.user.email,
  );

  return data;
}

export async function restoreSession(): Promise<LoginResponse | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    return await refreshSession();
  } catch {
    clearAuthSession();
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Session is cleared locally even if the backend request fails.
    }
  }

  clearAuthSession();
}
