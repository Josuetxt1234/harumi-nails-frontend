import type { TFunction } from 'i18next';

export function getPermissionLabel(
  t: TFunction,
  permissionName: string,
  fallbackDescription?: string | null,
): string {
  const [resource, action] = permissionName.split('.');

  if (resource && action) {
    const translated = t(`perm.${resource}.${action}`, {
      defaultValue: '',
    });

    if (translated) {
      return translated;
    }
  }

  const trimmed = fallbackDescription?.trim();
  if (trimmed) {
    return trimmed;
  }

  return formatPermissionFallback(permissionName);
}

function formatPermissionFallback(name: string): string {
  const [resource, ...actionParts] = name.split('.');
  const action = actionParts.join(' ').replace(/_/g, ' ');

  if (!action) {
    return name;
  }

  const capitalizedAction =
    action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();

  return `${capitalizedAction} ${resource}`;
}
