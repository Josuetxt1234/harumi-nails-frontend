import type { PermissionSummary } from '../types/permission.types';

export interface PermissionGroup {
  key: string;
  permissions: PermissionSummary[];
}

export function groupPermissionsByResource(
  permissions: PermissionSummary[],
): PermissionGroup[] {
  const groups = new Map<string, PermissionSummary[]>();

  for (const permission of permissions) {
    const [resource] = permission.name.split('.');

    if (!groups.has(resource)) {
      groups.set(resource, []);
    }

    groups.get(resource)?.push(permission);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, groupPermissions]) => ({
      key,
      permissions: groupPermissions.sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    }));
}
