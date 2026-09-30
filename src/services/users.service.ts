import { getApiErrorMessage } from '../lib/get-api-error';
import { mapApiUserToManagedUser } from '../lib/user-mapper';
import type {
  ApiUser,
  ChangeOwnPasswordInput,
  CreateUserInput,
  ManagedUser,
  PaginatedUsersResponse,
  UpdateMyProfileInput,
  UpdateUserInput,
  UsersListResult,
  UsersMetrics,
} from '../types/user.types';
import api from './api';
import { getRoles } from './roles.service';

async function resolveRoleId(roleName: string): Promise<string> {
  const roles = await getRoles();
  const role = roles.find((item) => item.name === roleName);

  if (!role) {
    throw new Error(`Role "${roleName}" was not found.`);
  }

  return role.id;
}

function buildCreateFormData(input: CreateUserInput, roleId: string): FormData {
  const formData = new FormData();
  formData.append('firstName', input.firstName.trim());
  formData.append('lastName', input.lastName.trim());
  formData.append('email', input.email.trim());
  formData.append('password', input.password);
  formData.append('roleIds', JSON.stringify([roleId]));

  if (input.phone?.trim()) {
    formData.append('phone', input.phone.trim());
  }

  if (input.isActive !== undefined) {
    formData.append('isActive', String(input.isActive));
  }

  if (input.avatarFile) {
    formData.append('avatar', input.avatarFile);
  }

  return formData;
}

function buildUpdateFormData(input: UpdateUserInput): FormData {
  const formData = new FormData();
  formData.append('firstName', input.firstName.trim());
  formData.append('lastName', input.lastName.trim());

  if (input.phone !== undefined) {
    formData.append('phone', input.phone.trim());
  }

  if (input.password?.trim()) {
    formData.append('password', input.password);
  }

  if (input.avatarFile) {
    formData.append('avatar', input.avatarFile);
  }

  return formData;
}

function buildMyProfileFormData(input: UpdateMyProfileInput): FormData {
  const formData = new FormData();

  if (input.phone !== undefined) {
    formData.append('phone', input.phone.trim());
  }

  if (input.avatarFile) {
    formData.append('avatar', input.avatarFile);
  }

  return formData;
}

export async function listUsers(params?: {
  search?: string;
  isActive?: boolean;
  roleId?: string;
  page?: number;
  limit?: number;
}): Promise<UsersListResult> {
  const { data } = await api.get<PaginatedUsersResponse>('/users', {
    params: {
      search: params?.search || undefined,
      isActive: params?.isActive,
      roleId: params?.roleId || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    },
  });

  return {
    users: data.data.map(mapApiUserToManagedUser),
    total: data.meta.total,
    page: data.meta.page,
    limit: data.meta.limit,
    totalPages: data.meta.totalPages,
  };
}

export async function getUsersMetrics(roleId?: string): Promise<UsersMetrics> {
  const { data } = await api.get<UsersMetrics>('/users/metrics', {
    params: {
      roleId: roleId || undefined,
    },
  });

  return data;
}

export async function createUser(input: CreateUserInput): Promise<ManagedUser> {
  try {
    const roleId = await resolveRoleId(input.role);
    const formData = buildCreateFormData(input, roleId);

    const { data } = await api.post<ApiUser>('/users', formData);
    return mapApiUserToManagedUser(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create user.'));
  }
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
  currentRole: string,
): Promise<ManagedUser> {
  try {
    const formData = buildUpdateFormData(input);
    const { data } = await api.patch<ApiUser>(`/users/${userId}`, formData);

    if (input.role && input.role !== currentRole) {
      const roles = await getRoles();
      const nextRole = roles.find((role) => role.name === input.role);
      const previousRole = roles.find((role) => role.name === currentRole);

      if (nextRole) {
        await api.post(`/users/${userId}/roles`, { roleId: nextRole.id });
      }

      if (previousRole) {
        try {
          await api.delete(`/users/${userId}/roles/${previousRole.id}`);
        } catch {
          // Keep the newly assigned role even if revoke fails.
        }
      }
    }

    let updatedUser = mapApiUserToManagedUser(data);

    if (input.isActive !== undefined && input.isActive !== updatedUser.isActive) {
      updatedUser = input.isActive
        ? await activateUser(userId)
        : await deactivateUser(userId);
    } else if (input.role && input.role !== currentRole) {
      const refreshed = await api.get<ApiUser>(`/users/${userId}`);
      updatedUser = mapApiUserToManagedUser(refreshed.data);
    }

    return updatedUser;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to update user.'));
  }
}

export async function activateUser(userId: string): Promise<ManagedUser> {
  try {
    const { data } = await api.patch<ApiUser>(`/users/${userId}/activate`);
    return mapApiUserToManagedUser(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to activate user.'));
  }
}

export async function deactivateUser(userId: string): Promise<ManagedUser> {
  try {
    const { data } = await api.patch<ApiUser>(`/users/${userId}/deactivate`);
    return mapApiUserToManagedUser(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to deactivate user.'));
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to delete user.'));
  }
}

export async function changeUserPassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  try {
    await api.patch(`/users/${userId}/password`, { newPassword });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to change password.'));
  }
}

export async function getMyProfile(): Promise<ManagedUser> {
  try {
    const { data } = await api.get<ApiUser>('/users/me');
    return mapApiUserToManagedUser(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load profile.'));
  }
}

export async function updateMyProfile(
  input: UpdateMyProfileInput,
): Promise<ManagedUser> {
  try {
    const formData = buildMyProfileFormData(input);
    const { data } = await api.patch<ApiUser>('/users/me', formData);
    return mapApiUserToManagedUser(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to update profile.'));
  }
}

export async function changeMyPassword(
  input: ChangeOwnPasswordInput,
): Promise<void> {
  try {
    await api.patch('/users/me/password', input);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to change password.'));
  }
}
