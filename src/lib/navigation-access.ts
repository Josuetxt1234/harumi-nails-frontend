import { PERMISSIONS } from '../constants/permissions.constants';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import type { NavItem } from '../constants/navigation.constants';

export const DAILY_REGISTER_NAV_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_CREATE,
  PERMISSIONS.SERVICES_LIST,
];

export const DAILY_REGISTERS_LIST_NAV_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_LIST,
];

export function canAccessNavItem(
  item: NavItem,
  roles: string[],
  permissions: string[] | undefined,
): boolean {
  if (!item.enabled) {
    return true;
  }

  const isElevated =
    roles.includes(SYSTEM_ROLES.SUPER_ADMIN) ||
    roles.includes(SYSTEM_ROLES.ADMIN);

  if (!item.requiredAnyPermission?.length) {
    return true;
  }

  if (isElevated) {
    return true;
  }

  return item.requiredAnyPermission.some((permission) =>
    permissions?.includes(permission),
  );
}
