import { Bell } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SYSTEM_ROLES } from '../../../constants/roles.constants';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime } from '../../../lib/format-register';
import {
  getNotifications,
  markAllNotificationsAsRead,
} from '../../../services/notifications.service';
import type { AuditNotification } from '../../../types/notification.types';

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

export function NotificationBell() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isSuperAdmin = Boolean(user?.roles.includes(SYSTEM_ROLES.SUPER_ADMIN));
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState<AuditNotification[]>([]);
  const [items, setItems] = useState<AuditNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const unreadCount = unread.length;

  const loadNotifications = useCallback(async () => {
    if (!isSuperAdmin) {
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
  }, [isSuperAdmin]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadNotifications();

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, loadNotifications]);

  const handleMarkAllAsRead = async () => {
    if (!isSuperAdmin || unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch {
      // El listado se mantiene; el usuario puede reintentar.
    }
  };

  const emptyLabel = useMemo(() => {
    if (!isSuperAdmin) {
      return t('notifications:inbox_empty');
    }

    if (isLoading) {
      return t('common:loading');
    }

    return t('notifications:inbox_empty');
  }, [isLoading, isSuperAdmin, t]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={t('common:notifications')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-border bg-white text-slate-body transition hover:text-brand"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-border px-4 py-3">
            <p className="text-sm font-semibold text-slate-heading">
              {t('common:notifications')}
            </p>
            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={() => void handleMarkAllAsRead()}
              className="min-h-[44px] px-2 text-xs font-semibold text-brand disabled:cursor-not-allowed disabled:text-slate-muted"
            >
              {t('notifications:mark_all_read')}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-body">{emptyLabel}</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={[
                      'border-b border-slate-border px-4 py-3 last:border-b-0',
                      item.isRead ? 'bg-white' : 'bg-brand/5',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-heading">
                        {item.title}
                      </p>
                      <span
                        className={[
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                          item.isRead
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-red-50 text-red-600',
                        ].join(' ')}
                      >
                        {item.isRead
                          ? t('notifications:read')
                          : t('notifications:unread')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-body">{item.message}</p>
                    <p className="mt-2 text-xs text-slate-muted">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
