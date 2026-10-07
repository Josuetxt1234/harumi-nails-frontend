const SESSION_FLAG_KEY = 'harumi_has_session';
const REMEMBER_ME_KEY = 'harumi_remember_me';
const REMEMBERED_EMAIL_KEY = 'harumi_remembered_email';
const LEGACY_TOKEN_KEYS = ['harumi_access_token', 'harumi_refresh_token'];

function getPersistentStorage(): Storage {
  return localStorage;
}

function getTemporaryStorage(): Storage {
  return sessionStorage;
}

function getActiveStorage(rememberMe: boolean): Storage {
  return rememberMe ? getPersistentStorage() : getTemporaryStorage();
}

// Tokens used to be persisted by older builds; drop anything left behind.
for (const key of LEGACY_TOKEN_KEYS) {
  getPersistentStorage().removeItem(key);
  getTemporaryStorage().removeItem(key);
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

/**
 * Records that a refresh cookie should exist, so the app only attempts a
 * silent restore when there is something to restore. It holds no credentials.
 */
export function markSessionActive(rememberMe: boolean, email?: string): void {
  clearStoredSession();

  getPersistentStorage().setItem(REMEMBER_ME_KEY, String(rememberMe));

  if (rememberMe && email) {
    getPersistentStorage().setItem(REMEMBERED_EMAIL_KEY, email);
  } else {
    getPersistentStorage().removeItem(REMEMBERED_EMAIL_KEY);
  }

  getActiveStorage(rememberMe).setItem(SESSION_FLAG_KEY, 'true');
}

export function hasStoredSession(): boolean {
  return (
    getPersistentStorage().getItem(SESSION_FLAG_KEY) === 'true' ||
    getTemporaryStorage().getItem(SESSION_FLAG_KEY) === 'true'
  );
}

export function clearStoredSession(): void {
  getPersistentStorage().removeItem(SESSION_FLAG_KEY);
  getTemporaryStorage().removeItem(SESSION_FLAG_KEY);
}
