import { apiBaseUrl } from '../services/api';

export interface NotificationReadSync {
  notificationIds: string[];
  unreadCount: number;
}

export function isNotificationRefresh(
  value: unknown,
): value is { refresh: true } {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as { refresh?: unknown }).refresh === true
  );
}

export function isNotificationReadSync(
  value: unknown,
): value is NotificationReadSync {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    Array.isArray(record.notificationIds) &&
    record.notificationIds.every((id) => typeof id === 'string') &&
    typeof record.unreadCount === 'number' &&
    Number.isFinite(record.unreadCount)
  );
}

/**
 * Reads the Nest SSE stream with the in-memory access token.
 * The browser EventSource API cannot send Authorization.
 */
export async function consumeNotificationStream(
  token: string,
  signal: AbortSignal,
  onSync: (event: NotificationReadSync) => void,
  onRefresh: () => void,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/notifications/stream`, {
    method: 'GET',
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    signal,
  });

  if (response.status === 401 || response.status === 403) {
    return;
  }

  if (!response.ok || !response.body) {
    throw new Error(`Notification stream failed (${response.status}).`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const data = frame
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n');

      if (!data || data === '{}') {
        continue;
      }

      try {
        const parsed: unknown = JSON.parse(data);
        if (isNotificationRefresh(parsed)) {
          onRefresh();
          continue;
        }
        if (isNotificationReadSync(parsed)) {
          onSync(parsed);
        }
      } catch {
        // Ignore a truncated or non-JSON heartbeat frame.
      }
    }
  }
}
