export function hasPermission(
  permissions: string[] | undefined,
  permission: string,
): boolean {
  return Boolean(permissions?.includes(permission));
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(permissions, permission),
  );
}

export function hasAllPermissions(
  permissions: string[] | undefined,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(permissions, permission),
  );
}
