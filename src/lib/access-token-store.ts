// The access token lives only in this module's closure: never in localStorage,
// sessionStorage or cookies readable by scripts. It is rebuilt on reload from
// the HttpOnly refresh cookie.
let accessToken: string | null = null;

type AccessTokenListener = (token: string | null) => void;

const listeners = new Set<AccessTokenListener>();

function emitAccessToken(): void {
  for (const listener of listeners) {
    listener(accessToken);
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  if (accessToken === token) {
    return;
  }

  accessToken = token;
  emitAccessToken();
}

export function clearAccessToken(): void {
  if (accessToken === null) {
    return;
  }

  accessToken = null;
  emitAccessToken();
}

export function subscribeAccessToken(listener: AccessTokenListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
