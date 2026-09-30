import type { PermissionSummary } from '../types/permission.types';
import api from './api';

export async function getPermissions(): Promise<PermissionSummary[]> {
  const { data } = await api.get<PermissionSummary[]>('/permissions');
  return data;
}
