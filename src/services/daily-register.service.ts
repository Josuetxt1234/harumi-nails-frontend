import type {
  CreateDailyRegisterInput,
  DailyRegister,
  ListDailyRegistersParams,
  MesaUserOption,
  PaginatedDailyRegisters,
} from '../types/daily-register.types';
import api from './api';

export async function listMesaUsers(): Promise<MesaUserOption[]> {
  const { data } = await api.get<MesaUserOption[]>('/daily-registers/mesa-users');
  return data;
}

export async function createDailyRegister(
  input: CreateDailyRegisterInput,
): Promise<DailyRegister> {
  const { data } = await api.post<DailyRegister>('/daily-registers', input);
  return data;
}

export async function listTodayDailyRegisters(): Promise<DailyRegister[]> {
  const { data } = await api.get<DailyRegister[]>('/daily-registers/today');
  return data;
}

export async function listDailyRegisters(
  params?: ListDailyRegistersParams,
): Promise<PaginatedDailyRegisters> {
  const { data } = await api.get<PaginatedDailyRegisters>('/daily-registers', {
    params: {
      dateRange: params?.dateRange ?? 'TODAY',
      startDate: params?.startDate || undefined,
      endDate: params?.endDate || undefined,
      mesaUserId:
        params?.mesaUserId && params.mesaUserId !== 'all'
          ? params.mesaUserId
          : undefined,
      paymentMethod:
        params?.paymentMethod && params.paymentMethod !== 'all'
          ? params.paymentMethod
          : undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}

export async function voidDailyRegister(registerId: string): Promise<void> {
  await api.delete(`/daily-registers/${registerId}`);
}
