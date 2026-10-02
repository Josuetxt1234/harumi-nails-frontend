import type {
  AuditNotification,
  NotificationsFeed,
} from '../types/notification.types';
import api from './api';

export async function getNotifications(): Promise<NotificationsFeed> {
  const { data } = await api.get<NotificationsFeed>('/notifications');
  return {
    unread: Array.isArray(data?.unread) ? data.unread : [],
    recent: Array.isArray(data?.recent) ? data.recent : [],
  };
}

export async function markNotificationAsRead(
  id: string,
): Promise<AuditNotification> {
  const { data } = await api.patch<AuditNotification>(
    `/notifications/${id}/read`,
  );
  return data;
}

export async function markAllNotificationsAsRead(): Promise<{
  updated: number;
}> {
  const { data } = await api.patch<{ updated: number }>(
    '/notifications/read-all',
  );
  return data;
}
