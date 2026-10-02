import i18n from '../i18n';

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MESA: 'MESA',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

const ROLE_I18N_KEYS: Record<string, string> = {
  SUPER_ADMIN: 'nav:role_super_admin',
  ADMIN: 'nav:role_admin',
  MESA: 'nav:role_mesa',
};

export function getRoleLabel(role: string): string {
  const key = ROLE_I18N_KEYS[role];
  return key ? i18n.t(key) : role;
}

export const ROLE_OPTIONS: { value: SystemRole }[] = [
  { value: SYSTEM_ROLES.SUPER_ADMIN },
  { value: SYSTEM_ROLES.ADMIN },
  { value: SYSTEM_ROLES.MESA },
];
