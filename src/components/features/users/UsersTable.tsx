import { getRoleLabel } from '../../../constants/roles.constants';
import { formatRegistrationDate } from '../../../lib/format-date';
import type { ManagedUser } from '../../../types/user.types';
import { UserAvatar } from '../../ui/display/UserAvatar';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { StatusBadge } from '../../ui/feedback/StatusBadge';
import { UserRowActions } from './UserRowActions';
import { useTranslation } from 'react-i18next';

interface UsersTableProps {
  users: ManagedUser[];
  showDeleteAction?: boolean;
  onEdit: (user: ManagedUser) => void;
  onChangePassword: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

export function UsersTable({
  users,
  showDeleteAction = true,
  onEdit,
  onChangePassword,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  const { t } = useTranslation();

  if (users.length === 0) {
    return (
      <EmptyState
        title={t('users:empty')}
        description={t('users:empty_hint')}
        dashed
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-2xl border border-slate-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  avatarUrl={user.avatarUrl}
                />
                <div className="min-w-0">
                  <p className="truncate font-outfit text-sm font-semibold text-slate-heading">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-body">{user.email}</p>
                </div>
              </div>
              <UserRowActions
                user={user}
                showDelete={showDeleteAction}
                onEdit={onEdit}
                onChangePassword={onChangePassword}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {getRoleLabel(user.role)}
              </span>
              <StatusBadge isActive={user.isActive} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-border bg-white shadow-sm md:block">
      <div className="overflow-x-auto -mx-4 sm:mx-0 shadow-[inset_-12px_0_16px_-16px_rgba(15,23,42,0.22)]">
        <table className="min-w-full divide-y divide-slate-border">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('users:user')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('auth:email')}
              </th>
              <th className="hidden px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-xs">
                {t('users:phone')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('users:role')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('common:status')}
              </th>
              <th className="hidden px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-xs">
                {t('users:registered')}
              </th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('common:actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border">
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-slate-50/70">
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      avatarUrl={user.avatarUrl}
                    />
                    <div>
                      <p className="font-outfit text-xs font-semibold text-slate-heading sm:text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-slate-body sm:px-6 sm:py-4 sm:text-sm">{user.email}</td>
                <td className="hidden px-2 py-2 text-xs text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  {user.phone || t('users:no_phone')}
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <StatusBadge isActive={user.isActive} />
                </td>
                <td className="hidden px-2 py-2 text-xs text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  {formatRegistrationDate(user.createdAt)}
                </td>
                <td className="px-2 py-2 text-right sm:px-6 sm:py-4">
                  <UserRowActions
                    user={user}
                    showDelete={showDeleteAction}
                    onEdit={onEdit}
                    onChangePassword={onChangePassword}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
