const ACCESS_TOKEN_KEY = 'harumi_access_token';
const REFRESH_TOKEN_KEY = 'harumi_refresh_token';
const REMEMBER_ME_KEY = 'harumi_remember_me';
const REMEMBERED_EMAIL_KEY = 'harumi_remembered_email';

function getPersistentStorage(): Storage {
  return localStorage;
}

function getTemporaryStorage(): Storage {
  return sessionStorage;
}

function getActiveStorage(rememberMe: boolean): Storage {
  return rememberMe ? getPersistentStorage() : getTemporaryStorage();
}

export function getRememberMePreference(): boolean {
  return getPersistentStorage().getItem(REMEMBER_ME_KEY) === 'true';
}

export function getRememberedEmail(): string {
  if (!getRememberMePreference()) {
    return '';
  }

  return getPersistentStorage().getItem(REMEMBERED_EMAIL_KEY) ?? '';
}

export function saveAuthSession(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean,
  email?: string,
): void {
  clearAuthSession();

  getPersistentStorage().setItem(REMEMBER_ME_KEY, String(rememberMe));

  if (rememberMe && email) {
    getPersistentStorage().setItem(REMEMBERED_EMAIL_KEY, email);
  } else {
    getPersistentStorage().removeItem(REMEMBERED_EMAIL_KEY);
  }

  const storage = getActiveStorage(rememberMe);
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return (
    getPersistentStorage().getItem(ACCESS_TOKEN_KEY) ??
    getTemporaryStorage().getItem(ACCESS_TOKEN_KEY)
  );
}

export function getRefreshToken(): string | null {
  return (
    getPersistentStorage().getItem(REFRESH_TOKEN_KEY) ??
    getTemporaryStorage().getItem(REFRESH_TOKEN_KEY)
  );
}

export function clearAuthSession(): void {
  getPersistentStorage().removeItem(ACCESS_TOKEN_KEY);
  getPersistentStorage().removeItem(REFRESH_TOKEN_KEY);
  getTemporaryStorage().removeItem(ACCESS_TOKEN_KEY);
  getTemporaryStorage().removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredSession(): boolean {
  return Boolean(getRefreshToken());
}
