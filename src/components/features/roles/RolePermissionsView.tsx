import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import { groupPermissionsByResource } from '../../../lib/group-permissions';
import { useRolePermissionsManager } from '../../../hooks/useRolePermissionsManager';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { PageHeader } from '../../ui/layout/PageHeader';
import { PermissionGroupCard } from './PermissionGroupCard';
import { RoleSelector } from './RoleSelector';

export interface RolePermissionsViewProps {
  showHeader?: boolean;
  enabled?: boolean;
}

export function RolePermissionsView({
  showHeader = true,
  enabled = true,
}: RolePermissionsViewProps) {
  const { user, refreshProfile, hasPermission } = useAuth();
  const {
    roles,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    filteredPermissions,
    assignedPermissionIds,
    search,
    setSearch,
    isLoading,
    isRolePermissionsLoading,
    togglingPermissionId,
    errorMessage,
    successMessage,
    togglePermission,
  } = useRolePermissionsManager({ enabled });

  const canEdit = hasPermission(PERMISSIONS.PERMISSIONS_ASSIGN_TO_ROLE);
  const permissionGroups = useMemo(
    () => groupPermissionsByResource(filteredPermissions),
    [filteredPermissions],
  );

  const affectsCurrentUser = Boolean(
    selectedRole && user?.roles?.includes(selectedRole.name),
  );

  const handleToggle = async (permissionId: string, shouldAssign: boolean) => {
    const wasUpdated = await togglePermission(permissionId, shouldAssign);

    if (wasUpdated && affectsCurrentUser) {
      await refreshProfile();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showHeader ? (
        <PageHeader
          title="Role Permissions"
          subtitle="Assign capabilities to each role. Users inherit permissions from their assigned roles."
          searchPlaceholder="Search permissions..."
          searchValue={search}
          onSearchChange={setSearch}
        />
      ) : (
        <div className="mb-4 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar permisos..."
              className="w-full rounded-full border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      )}

      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:p-8">
        {errorMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={successMessage} tone="success" />
          </div>
        ) : null}

        {isLoading ? (
          <EmptyState title="Loading roles and permissions..." dashed />
        ) : (
          <>
            <div className="mb-6 shrink-0">
              <p className="mb-3 text-sm font-semibold text-slate-heading">
                Select role
              </p>
              <RoleSelector
                roles={roles}
                selectedRoleId={selectedRoleId}
                onSelectRole={setSelectedRoleId}
              />
            </div>

            {affectsCurrentUser ? (
              <div className="mb-4 shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You belong to this role. Permission changes update your session
                immediately.
              </div>
            ) : null}

            {!canEdit ? (
              <div className="mb-4 shrink-0 rounded-xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-body">
                You can review permissions, but only users with{' '}
                <span className="font-mono text-xs">permissions.assign_to_role</span>{' '}
                can modify them.
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {isRolePermissionsLoading ? (
                <EmptyState title="Loading role permissions..." dashed />
              ) : permissionGroups.length === 0 ? (
                <EmptyState
                  title="No permissions found"
                  description="Try adjusting your search."
                  dashed
                />
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {permissionGroups.map((group) => (
                    <PermissionGroupCard
                      key={group.key}
                      group={group}
                      assignedPermissionIds={assignedPermissionIds}
                      canEdit={canEdit}
                      togglingPermissionId={togglingPermissionId}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
