import { SYSTEM_ROLES } from '../constants/roles.constants';

export function getDefaultRouteForRoles(roles: string[]): string {
  if (roles.includes(SYSTEM_ROLES.SUPER_ADMIN)) {
    return '/dashboard/users';
  }

  if (roles.includes(SYSTEM_ROLES.ADMIN)) {
    return '/admin/staff';
  }

  if (roles.includes(SYSTEM_ROLES.MESA)) {
    return '/mesa/registro-diario';
  }

  return '/profile';
}
