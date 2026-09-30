export const PERMISSIONS = {
  PROFILE_READ: 'profile.read',
  PROFILE_UPDATE: 'profile.update',
  PROFILE_CHANGE_PASSWORD: 'profile.change_password',

  USERS_LIST: 'users.list',
  USERS_READ: 'users.read',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_ACTIVATE: 'users.activate',
  USERS_DEACTIVATE: 'users.deactivate',
  USERS_FORCE_PASSWORD_RESET: 'users.force_password_reset',
  USERS_ASSIGN_ROLE: 'users.assign_role',
  USERS_REVOKE_ROLE: 'users.revoke_role',

  ROLES_LIST: 'roles.list',
  ROLES_READ: 'roles.read',

  PERMISSIONS_LIST: 'permissions.list',
  PERMISSIONS_READ: 'permissions.read',
  PERMISSIONS_ASSIGN_TO_ROLE: 'permissions.assign_to_role',

  SERVICES_LIST: 'services.list',
  DAILY_REGISTERS_CREATE: 'daily_registers.create',
  DAILY_REGISTERS_LIST: 'daily_registers.list',
  DAILY_REGISTERS_READ: 'daily_registers.read',
  DAILY_REGISTERS_VOID: 'daily_registers.void',
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
