import { useCallback, useEffect, useMemo, useState } from 'react';
import { SYSTEM_ROLES, SystemRole } from '../constants/roles.constants';
import {
  activateUser,
  changeUserPassword,
  createUser,
  deactivateUser,
  deleteUser,
  getUsersMetrics,
  listUsers,
  updateUser,
} from '../services/users.service';
import { getRoles } from '../services/roles.service';
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
  UsersMetrics,
} from '../types/user.types';

export interface UsersManagerConfig {
  fixedRole?: SystemRole;
  showMetrics?: boolean;
}

const ALL_USERS_LIMIT = 100;

export function useUsersManager(config: UsersManagerConfig = {}) {
  const fixedRole = config.fixedRole;

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all',
  );
  const [roleFilter, setRoleFilter] = useState<'all' | SystemRole>(
    fixedRole ?? 'all',
  );
  const [total, setTotal] = useState(0);
  const [metrics, setMetrics] = useState<UsersMetrics>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [roleIdMap, setRoleIdMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadRoles() {
      try {
        const roles = await getRoles();
        if (!isMounted) {
          return;
        }

        setRoleIdMap(
          Object.fromEntries(roles.map((role) => [role.name, role.id])),
        );
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load roles.');
        }
      }
    }

    loadRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedRoleId = useMemo(() => {
    if (fixedRole) {
      return roleIdMap[fixedRole];
    }

    if (roleFilter === 'all') {
      return undefined;
    }

    return roleIdMap[roleFilter];
  }, [fixedRole, roleFilter, roleIdMap]);

  const refreshUsers = useCallback(async () => {
    const response = await listUsers({
      search: debouncedSearch || undefined,
      isActive:
        statusFilter === 'all'
          ? undefined
          : statusFilter === 'active',
      roleId: resolvedRoleId,
      page: 1,
      limit: ALL_USERS_LIMIT,
    });

    setUsers(response.users);
    setTotal(response.total);
  }, [debouncedSearch, statusFilter, resolvedRoleId]);

  const refreshMetrics = useCallback(async () => {
    if (config.showMetrics === false) {
      return;
    }

    // Super Admin: system-wide totals. Admin staff: scoped to fixed role.
    const nextMetrics = await getUsersMetrics(
      fixedRole ? resolvedRoleId : undefined,
    );
    setMetrics(nextMetrics);
  }, [config.showMetrics, fixedRole, resolvedRoleId]);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        await Promise.all([refreshUsers(), refreshMetrics()]);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load users from the server.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (Object.keys(roleIdMap).length > 0 || fixedRole === undefined) {
      loadUsers();
    }

    return () => {
      isMounted = false;
    };
  }, [refreshUsers, refreshMetrics, roleIdMap, fixedRole]);

  const handleCreateUser = useCallback(
    async (input: CreateUserInput) => {
      try {
        await createUser({
          ...input,
          role: fixedRole ?? input.role,
        });
        await Promise.all([refreshUsers(), refreshMetrics()]);
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to create user.';
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [fixedRole, refreshUsers, refreshMetrics],
  );

  const handleUpdateUser = useCallback(
    async (userId: string, input: UpdateUserInput, currentRole: string) => {
      try {
        const updatedUser = await updateUser(userId, input, currentRole);
        await Promise.all([refreshUsers(), refreshMetrics()]);
        setErrorMessage('');
        return updatedUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to update user.';
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [refreshUsers, refreshMetrics],
  );

  const handleToggleUserStatus = useCallback(
    async (userId: string) => {
      const user = users.find((item) => item.id === userId);

      if (!user) {
        return;
      }

      try {
        if (user.isActive) {
          await deactivateUser(userId);
        } else {
          await activateUser(userId);
        }

        await Promise.all([refreshUsers(), refreshMetrics()]);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to update user status.',
        );
        throw error;
      }
    },
    [users, refreshUsers, refreshMetrics],
  );

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        await deleteUser(userId);
        await Promise.all([refreshUsers(), refreshMetrics()]);
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to delete user.';
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [refreshUsers, refreshMetrics],
  );

  const handleChangePassword = useCallback(
    async (userId: string, newPassword: string) => {
      try {
        await changeUserPassword(userId, newPassword);
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to change password.';
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [],
  );

  const handleStatusFilterChange = useCallback(
    (value: 'all' | 'active' | 'inactive') => {
      setStatusFilter(value);
    },
    [],
  );

  const handleRoleFilterChange = useCallback((value: 'all' | SystemRole) => {
    setRoleFilter(value);
  }, []);

  return {
    users,
    metrics,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    roleFilter: fixedRole ?? roleFilter,
    setRoleFilter: handleRoleFilterChange,
    total,
    errorMessage,
    setErrorMessage,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    toggleUserStatus: handleToggleUserStatus,
    deleteUser: handleDeleteUser,
    changeUserPassword: handleChangePassword,
    fixedRole,
    allowedRoles: fixedRole
      ? [fixedRole]
      : [SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.MESA, SYSTEM_ROLES.SUPER_ADMIN],
  };
}
