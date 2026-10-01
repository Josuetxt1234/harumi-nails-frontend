type AuthSessionExpiredListener = () => void;

const listeners = new Set<AuthSessionExpiredListener>();

export function subscribeAuthSessionExpired(
  listener: AuthSessionExpiredListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyAuthSessionExpired(): void {
  listeners.forEach((listener) => listener());
}
