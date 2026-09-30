import { useState } from 'react';
import { Search } from 'lucide-react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { SYSTEM_ROLES, SystemRole } from '../../../constants/roles.constants';
import { useAuth } from '../../../context/AuthContext';
import { useUsersManager } from '../../../hooks/useUsersManager';
import type { ManagedUser, UserFormMode } from '../../../types/user.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { PageHeader } from '../../ui/layout/PageHeader';
import {
  ConfirmDialog,
  ConfirmDialogType,
} from '../../ui/overlay/ConfirmDialog';
import { ChangePasswordModal } from './ChangePasswordModal';
import { UserFormModal } from './UserFormModal';
import { UsersMetricsCards } from './UsersMetricsCards';
import { UsersTable } from './UsersTable';
import { UsersToolbar } from './UsersToolbar';

export interface UsersManagementViewProps {
  title: string;
  subtitle: string;
  listTitle?: string;
  createLabel?: string;
  searchPlaceholder?: string;
  fixedRole?: SystemRole;
  showRoleFilter?: boolean;
  showDeleteAction?: boolean;
  showMetrics?: boolean;
  allowedRoles?: SystemRole[];
  showHeader?: boolean;
}

export function UsersManagementView({
  title,
  subtitle,
  listTitle,
  createLabel,
  searchPlaceholder,
  fixedRole,
  showRoleFilter = true,
  showDeleteAction = true,
  showMetrics = true,
  allowedRoles,
  showHeader = true,
}: UsersManagementViewProps) {
  const { user: authUser, refreshProfile, hasPermission } = useAuth();
  const {
    users,
    metrics,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    errorMessage,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    changeUserPassword,
  } = useUsersManager({
    fixedRole,
    showMetrics,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<UserFormMode>('create');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<ManagedUser | null>(null);
  const [confirmState, setConfirmState] = useState<{
    type: ConfirmDialogType;
    user: ManagedUser;
  } | null>(null);
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: ManagedUser) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (
    userId: string,
    input: Parameters<typeof updateUser>[1],
    currentRole: string,
  ) => {
    const updatedUser = await updateUser(userId, input, currentRole);

    if (authUser?.id === userId) {
      await refreshProfile();
    }

    return updatedUser;
  };

  const handleToggleStatusRequest = (user: ManagedUser) => {
    setConfirmState({
      type: user.isActive ? 'deactivate' : 'activate',
      user,
    });
  };

  const handleDeleteRequest = (user: ManagedUser) => {
    setConfirmState({
      type: 'delete',
      user,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmState) {
      return;
    }

    setIsConfirmSubmitting(true);

    try {
      if (confirmState.type === 'delete') {
        await deleteUser(confirmState.user.id);
      } else {
        await toggleUserStatus(confirmState.user.id);
      }

      setConfirmState(null);
    } catch {
      // Error message is handled in the hook.
    } finally {
      setIsConfirmSubmitting(false);
    }
  };

  const resolvedAllowedRoles =
    allowedRoles ??
    (fixedRole
      ? [fixedRole]
      : [
          SYSTEM_ROLES.SUPER_ADMIN,
          SYSTEM_ROLES.ADMIN,
          SYSTEM_ROLES.MESA,
        ]);

  const canListUsers = hasPermission(PERMISSIONS.USERS_LIST);
  const canCreateUsers = hasPermission(PERMISSIONS.USERS_CREATE);
  const canDeleteUsers =
    showDeleteAction && hasPermission(PERMISSIONS.USERS_DELETE);
  const shouldShowMetrics = showMetrics && canListUsers;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showHeader ? (
        <PageHeader
          title={title}
          subtitle={subtitle}
          searchPlaceholder={searchPlaceholder}
          searchValue={search}
          onSearchChange={setSearch}
        />
      ) : searchPlaceholder ? (
        <div className="mb-4 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      ) : null}

      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:p-8">
        {shouldShowMetrics ? (
          <UsersMetricsCards
            total={metrics.total}
            active={metrics.active}
            inactive={metrics.inactive}
          />
        ) : null}

        <UsersToolbar
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onStatusFilterChange={setStatusFilter}
          onRoleFilterChange={setRoleFilter}
          onCreateClick={openCreateModal}
          showRoleFilter={showRoleFilter && !fixedRole}
          createLabel={createLabel}
          listTitle={listTitle}
          showCreateButton={canCreateUsers}
        />

        {errorMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <EmptyState title="Loading users..." dashed />
            ) : (
              <UsersTable
                users={users}
                showDeleteAction={canDeleteUsers}
                onEdit={openEditModal}
                onChangePassword={setPasswordUser}
                onToggleStatus={handleToggleStatusRequest}
                onDelete={handleDeleteRequest}
              />
            )}
          </div>
        </div>
      </section>

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        allowedRoles={resolvedAllowedRoles}
        defaultRole={fixedRole}
        onClose={closeModal}
        onCreate={createUser}
        onUpdate={handleUpdateUser}
      />

      <ChangePasswordModal
        isOpen={Boolean(passwordUser)}
        userName={
          passwordUser
            ? `${passwordUser.firstName} ${passwordUser.lastName}`
            : ''
        }
        onClose={() => setPasswordUser(null)}
        onSubmit={async (newPassword) => {
          if (!passwordUser) {
            return;
          }

          await changeUserPassword(passwordUser.id, newPassword);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmState)}
        type={confirmState?.type ?? 'deactivate'}
        subjectName={
          confirmState
            ? `${confirmState.user.firstName} ${confirmState.user.lastName}`
            : ''
        }
        isSubmitting={isConfirmSubmitting}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
