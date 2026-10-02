import { SYSTEM_ROLES } from '../constants/roles.constants';

export function getRegistersHistoryPath(roles: string[] = []): string {
  if (roles.includes(SYSTEM_ROLES.SUPER_ADMIN)) {
    return '/dashboard/registros';
  }

  if (roles.includes(SYSTEM_ROLES.ADMIN)) {
    return '/admin/registros';
  }

  return '/mesa/registros';
}
