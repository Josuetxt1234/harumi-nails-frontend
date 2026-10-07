// The access token lives only in this module's closure: never in localStorage,
// sessionStorage or cookies readable by scripts. It is rebuilt on reload from
// the HttpOnly refresh cookie.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}
