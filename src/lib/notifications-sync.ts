export const NOTIFICATIONS_CHANGED_EVENT = 'harumi:notifications-changed';

/** Lets mutation hooks refresh the bell without importing the UI. */
export function notifyNotificationsChanged(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}
