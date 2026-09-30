export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MESA: 'MESA',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const ROLE_OPTIONS: { value: SystemRole; label: string }[] = [
  { value: SYSTEM_ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: SYSTEM_ROLES.ADMIN, label: 'Admin' },
  { value: SYSTEM_ROLES.MESA, label: 'Mesa' },
];

export function getRoleLabel(role: string): string {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}
