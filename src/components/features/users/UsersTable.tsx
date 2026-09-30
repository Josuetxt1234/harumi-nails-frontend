import { getRoleLabel } from '../../../constants/roles.constants';
import { formatRegistrationDate } from '../../../lib/format-date';
import type { ManagedUser } from '../../../types/user.types';
import { UserAvatar } from '../../ui/display/UserAvatar';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { StatusBadge } from '../../ui/feedback/StatusBadge';
import { UserRowActions } from './UserRowActions';

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
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try adjusting your search or create a new user."
        dashed
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-border">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                Registered
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-body">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border">
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      avatarUrl={user.avatarUrl}
                    />
                    <div>
                      <p className="font-outfit text-sm font-semibold text-slate-heading">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-body">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-body">
                  {user.phone || 'No phone'}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={user.isActive} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-body">
                  {formatRegistrationDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
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
  );
}
