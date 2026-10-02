import type {
  Advance,
  CreateAdvanceInput,
  ListAdvancesParams,
  PaginatedAdvances,
} from '../types/advance.types';
import api from './api';

export async function getAdvances(
  params?: ListAdvancesParams,
): Promise<PaginatedAdvances> {
  const { data } = await api.get<PaginatedAdvances>('/advances', {
    params: {
      mesaUserId: params?.mesaUserId || undefined,
      status: params?.status || undefined,
      startDate: params?.startDate || undefined,
      endDate: params?.endDate || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}

export async function getMyAdvances(
  params?: Omit<ListAdvancesParams, 'mesaUserId'>,
): Promise<PaginatedAdvances> {
  const { data } = await api.get<PaginatedAdvances>('/advances/me', {
    params: {
      status: params?.status || undefined,
      startDate: params?.startDate || undefined,
      endDate: params?.endDate || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}

export async function createAdvance(
  input: CreateAdvanceInput,
): Promise<Advance> {
  const { data } = await api.post<Advance>('/advances', input);
  return data;
}

export async function cancelAdvance(
  id: string,
  reason: string,
): Promise<Advance> {
  const { data } = await api.patch<Advance>(`/advances/${id}/cancel`, {
    reason,
  });
  return data;
}

export async function deleteAdvance(id: string): Promise<void> {
  await api.delete(`/advances/${id}`);
}
