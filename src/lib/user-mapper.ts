import type { ApiUser, ManagedUser } from '../types/user.types';

export function mapApiUserToManagedUser(user: ApiUser): ManagedUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    roles: user.roles,
    role: user.roles[0] ?? 'MESA',
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
