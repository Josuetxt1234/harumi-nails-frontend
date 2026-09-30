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

export function filterManagedUsers(
  users: ManagedUser[],
  search: string,
  statusFilter: 'all' | 'active' | 'inactive',
): ManagedUser[] {
  const normalizedSearch = search.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      !normalizedSearch ||
      user.firstName.toLowerCase().includes(normalizedSearch) ||
      user.lastName.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.role.toLowerCase().includes(normalizedSearch) ||
      user.roles.some((role) => role.toLowerCase().includes(normalizedSearch));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesStatus;
  });
}
