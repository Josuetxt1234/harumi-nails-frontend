import { Bell } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../../hooks/useNotifications';
import { formatDateTime } from '../../../lib/format-register';

export function NotificationBell() {
  const { t } = useTranslation();
  const {
    items,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const emptyLabel = useMemo(() => {
    if (isLoading) {
      return t('common:loading');
    }

    return t('notifications:inbox_empty');
  }, [isLoading, t]);

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
        <div className="fixed inset-x-4 top-16 z-30 mx-auto max-w-sm overflow-hidden rounded-2xl border border-slate-border bg-white shadow-lg md:absolute md:inset-x-auto md:top-auto md:right-0 md:mx-0 md:mt-2 md:w-[min(22rem,calc(100vw-1.5rem))] md:max-w-none">
          <div className="flex items-center justify-between border-b border-slate-border px-4 py-3">
            <p className="text-sm font-semibold text-slate-heading">
              {t('common:notifications')}
            </p>
            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={() => void markAllAsRead()}
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
                    className="border-b border-slate-border last:border-b-0"
                  >
                    <button
                      type="button"
                      disabled={item.isRead}
                      onClick={() => void markAsRead(item.id)}
                      className={[
                        'w-full px-4 py-3 text-left',
                        item.isRead
                          ? 'cursor-default bg-white'
                          : 'bg-brand/5 hover:bg-brand/10',
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
                    </button>
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
