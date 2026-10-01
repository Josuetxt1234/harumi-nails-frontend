import { PERMISSIONS } from '../constants/permissions.constants';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import { hasAnyPermission } from './has-permission';

export function getDefaultRouteForRoles(
  roles: string[],
  permissions: string[] = [],
): string {
  if (roles.includes(SYSTEM_ROLES.SUPER_ADMIN)) {
    if (hasAnyPermission(permissions, [PERMISSIONS.USERS_LIST])) {
      return '/dashboard/users';
    }

    if (
      hasAnyPermission(permissions, [
        PERMISSIONS.DAILY_REGISTERS_CREATE,
        PERMISSIONS.DAILY_REGISTERS_LIST,
      ])
    ) {
      return '/dashboard/registro-diario';
    }

    return '/profile';
  }

  if (roles.includes(SYSTEM_ROLES.ADMIN)) {
    if (hasAnyPermission(permissions, [PERMISSIONS.USERS_LIST])) {
      return '/admin/staff';
    }

    if (
      hasAnyPermission(permissions, [
        PERMISSIONS.DAILY_REGISTERS_CREATE,
        PERMISSIONS.DAILY_REGISTERS_LIST,
      ])
    ) {
      return '/admin/registro-diario';
    }

    return '/profile';
  }

  if (roles.includes(SYSTEM_ROLES.MESA)) {
    if (
      hasAnyPermission(permissions, [
        PERMISSIONS.DAILY_REGISTERS_CREATE,
        PERMISSIONS.SERVICES_LIST,
      ])
    ) {
      return '/mesa/registro-diario';
    }

    return '/profile';
  }

  return '/profile';
}
