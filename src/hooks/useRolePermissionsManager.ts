import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPermissions } from '../services/permissions.service';
import {
  assignPermissionToRole,
  getRolePermissions,
  getRoles,
  revokePermissionFromRole,
} from '../services/roles.service';
import type { PermissionSummary } from '../types/permission.types';
import type { RoleOption } from '../types/user.types';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return String(message[0]);
    }
  }

  return fallback;
}

interface UseRolePermissionsManagerOptions {
  enabled?: boolean;
}

export function useRolePermissionsManager(
  options: UseRolePermissionsManagerOptions = {},
) {
  const enabled = options.enabled ?? true;
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionSummary[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<Set<string>>(
    new Set(),
  );
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRolePermissionsLoading, setIsRolePermissionsLoading] = useState(false);
  const [togglingPermissionId, setTogglingPermissionId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadInitialData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      const sortedRoles = [...rolesResponse].sort((left, right) =>
        left.name.localeCompare(right.name),
      );

      setRoles(sortedRoles);
      setAllPermissions(permissionsResponse);
      setSelectedRoleId((currentRoleId) => currentRoleId ?? sortedRoles[0]?.id ?? null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load roles and permissions.'));
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const loadRolePermissions = useCallback(async (roleId: string) => {
    if (!enabled) {
      return;
    }

    setIsRolePermissionsLoading(true);
    setErrorMessage('');

    try {
      const rolePermissions = await getRolePermissions(roleId);
      setAssignedPermissionIds(new Set(rolePermissions.map((item) => item.id)));
    } catch (error) {
      setAssignedPermissionIds(new Set());
      setErrorMessage(getErrorMessage(error, 'Unable to load role permissions.'));
    } finally {
      setIsRolePermissionsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    loadInitialData();
  }, [enabled, loadInitialData]);

  useEffect(() => {
    if (!enabled || !selectedRoleId) {
      return;
    }

    loadRolePermissions(selectedRoleId);
  }, [enabled, selectedRoleId, loadRolePermissions]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const filteredPermissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return allPermissions;
    }

    return allPermissions.filter((permission) => {
      const haystack = `${permission.name} ${permission.description ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [allPermissions, search]);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const togglePermission = useCallback(
    async (permissionId: string, shouldAssign: boolean): Promise<boolean> => {
      if (!selectedRoleId || togglingPermissionId) {
        return false;
      }

      setTogglingPermissionId(permissionId);
      setErrorMessage('');
      setSuccessMessage('');

      const previousAssignments = new Set(assignedPermissionIds);

      setAssignedPermissionIds((currentAssignments) => {
        const nextAssignments = new Set(currentAssignments);

        if (shouldAssign) {
          nextAssignments.add(permissionId);
        } else {
          nextAssignments.delete(permissionId);
        }

        return nextAssignments;
      });

      try {
        if (shouldAssign) {
          const updatedPermissions = await assignPermissionToRole(
            selectedRoleId,
            permissionId,
          );
          setAssignedPermissionIds(new Set(updatedPermissions.map((item) => item.id)));
        } else {
          await revokePermissionFromRole(selectedRoleId, permissionId);
        }

        setSuccessMessage('Role permissions updated.');
        return true;
      } catch (error) {
        setAssignedPermissionIds(previousAssignments);
        setErrorMessage(getErrorMessage(error, 'Unable to update role permissions.'));
        return false;
      } finally {
        setTogglingPermissionId(null);
      }
    },
    [assignedPermissionIds, selectedRoleId, togglingPermissionId],
  );

  return {
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
  };
}
