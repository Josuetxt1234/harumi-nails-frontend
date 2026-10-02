export type NotificationType =
  | 'VOUCHER_CREATED'
  | 'VOUCHER_CANCELLED'
  | 'SYSTEM';

export type NotificationRole = 'SUPER_ADMIN' | 'ADMIN' | 'MESA';

export interface AuditNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  targetRole: NotificationRole;
  createdAt: string;
}

export interface NotificationsFeed {
  unread: AuditNotification[];
  recent: AuditNotification[];
}
