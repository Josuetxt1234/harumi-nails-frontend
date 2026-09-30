import type { RoleOption } from '../types/user.types';
import type { RolePermissionSummary } from '../types/permission.types';
import api from './api';

export async function getRoles(): Promise<RoleOption[]> {
  const { data } = await api.get<RoleOption[]>('/roles');
  return data;
}

export async function getRolePermissions(
  roleId: string,
): Promise<RolePermissionSummary[]> {
  const { data } = await api.get<RolePermissionSummary[]>(
    `/roles/${roleId}/permissions`,
  );
  return data;
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string,
): Promise<RolePermissionSummary[]> {
  const { data } = await api.post<RolePermissionSummary[]>(
    `/roles/${roleId}/permissions`,
    { permissionId },
  );
  return data;
}

export async function revokePermissionFromRole(
  roleId: string,
  permissionId: string,
): Promise<void> {
  await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
}
