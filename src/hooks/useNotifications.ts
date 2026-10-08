import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAccessToken,
  subscribeAccessToken,
} from '../lib/access-token-store';
import {
  consumeNotificationStream,
  type NotificationReadSync,
} from '../lib/notification-stream';
import { NOTIFICATIONS_CHANGED_EVENT } from '../lib/notifications-sync';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notifications.service';
import type { AuditNotification } from '../types/notification.types';

function mergeFeed(
  unread: AuditNotification[],
  recent: AuditNotification[],
): AuditNotification[] {
  const byId = new Map<string, AuditNotification>();

  for (const item of [...unread, ...recent]) {
    byId.set(item.id, item);
  }

  return [...byId.values()].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function useNotifications() {
  const { user } = useAuth();
  const [unread, setUnread] = useState<AuditNotification[]>([]);
  const [items, setItems] = useState<AuditNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setUnread([]);
      setItems([]);
      return;
    }

    setIsLoading(true);

    try {
      const feed = await getNotifications();
      setUnread(feed.unread.filter((item) => !item.isRead));
      setItems(mergeFeed(feed.unread, feed.recent));
    } catch {
      setUnread([]);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const applyReadSync = useCallback((event: NotificationReadSync) => {
    const readIds = new Set(event.notificationIds);
    setItems((current) =>
      current.map((item) =>
        readIds.has(item.id) ? { ...item, isRead: true } : item,
      ),
    );
    setUnread((current) => current.filter((item) => !readIds.has(item.id)));
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    function handleChanged() {
      void loadNotifications();
    }

    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, handleChanged);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, handleChanged);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let stopped = false;
    let abortController: AbortController | null = null;
    let retryTimer: number | undefined;

    const connect = () => {
      const token = getAccessToken();
      if (!token || stopped) {
        return;
      }

      abortController?.abort();
      abortController = new AbortController();
      const { signal } = abortController;

      void consumeNotificationStream(
        token,
        signal,
        (event) => {
          applyReadSync(event);
          void loadNotifications();
        },
        () => {
          void loadNotifications();
        },
      ).then(
        () => {
          if (!stopped && !signal.aborted) {
            retryTimer = window.setTimeout(connect, 2000);
          }
        },
        () => {
          if (!stopped && !signal.aborted) {
            retryTimer = window.setTimeout(connect, 2000);
          }
        },
      );
    };

    connect();
    const unsubscribe = subscribeAccessToken(() => {
      window.clearTimeout(retryTimer);
      connect();
    });

    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      abortController?.abort();
      unsubscribe();
    };
  }, [applyReadSync, loadNotifications, user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!id) {
      return;
    }

    try {
      const updated = await markNotificationAsRead(id);
      setItems((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, isRead: true } : item,
        ),
      );
      setUnread((current) => current.filter((item) => item.id !== updated.id));
    } catch {
      // Sigue como no leída hasta que el servidor confirme el cambio.
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (unread.length === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch {
      // El listado se mantiene; el usuario puede reintentar.
    }
  }, [loadNotifications, unread.length]);

  return {
    unread,
    items,
    unreadCount: unread.length,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}
