export interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  isActive?: boolean;
  avatarFile?: File | null;
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  avatarFile?: File | null;
}

export interface RoleOption {
  id: string;
  name: string;
  description: string | null;
}

export interface PaginatedUsersResponse {
  data: ApiUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt?: string;
}

export type UserFormMode = 'create' | 'edit';

export interface UsersMetrics {
  total: number;
  active: number;
  inactive: number;
}

export interface UsersListResult {
  users: ManagedUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateMyProfileInput {
  phone?: string;
  avatarFile?: File | null;
}

export interface ChangeOwnPasswordInput {
  currentPassword: string;
  newPassword: string;
}
