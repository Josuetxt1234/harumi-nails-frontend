import {
  clearAccessToken,
  setAccessToken,
} from '../lib/access-token-store';
import {
  clearStoredSession,
  getRememberMePreference,
  hasStoredSession,
  markSessionActive,
} from '../lib/auth-storage';
import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types';
import api from './api';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);

  setAccessToken(data.accessToken);
  markSessionActive(payload.rememberMe, payload.email);

  return data;
}

export async function refreshSession(): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/refresh');

  setAccessToken(data.accessToken);
  markSessionActive(getRememberMePreference(), data.user.email);

  return data;
}

export async function restoreSession(): Promise<LoginResponse | null> {
  if (!hasStoredSession()) {
    return null;
  }

  try {
    return await refreshSession();
  } catch {
    clearAccessToken();
    clearStoredSession();
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Session is cleared locally even if the backend request fails.
  }

  clearAccessToken();
  clearStoredSession();
}
