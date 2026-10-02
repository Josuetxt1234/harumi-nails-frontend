import type { NavItem } from '../constants/navigation.constants';
import { hasAnyPermission } from './has-permission';

export function canAccessNavItem(
  item: NavItem,
  permissions: string[] | undefined,
): boolean {
  if (!item.requiredAnyPermission?.length) {
    return true;
  }

  return hasAnyPermission(permissions, item.requiredAnyPermission);
}
