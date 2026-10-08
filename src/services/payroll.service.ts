import type {
  GeneratePayrollInput,
  PaginatedPayrolls,
  Payroll,
  PayrollDetail,
  PayrollPreview,
  ListPayrollParams,
} from '../types/payroll.types';
import api from './api';

export async function getPayrollPreview(
  input: GeneratePayrollInput,
): Promise<PayrollPreview> {
  const { data } = await api.post<PayrollPreview>('/payroll/preview', input);
  return data;
}

export async function generatePayroll(
  input: GeneratePayrollInput,
): Promise<Payroll> {
  const { data } = await api.post<Payroll>('/payroll/generate', input);
  return data;
}

export async function closePayroll(id: string): Promise<Payroll> {
  const { data } = await api.patch<Payroll>(`/payroll/${id}/close`, {
    payrollId: id,
  });
  return data;
}

export async function getPayrolls(
  params?: ListPayrollParams,
): Promise<PaginatedPayrolls> {
  const { data } = await api.get<PaginatedPayrolls>('/payroll', {
    params: {
      mesaUserId: params?.mesaUserId || undefined,
      status: params?.status || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}

export async function getMyPayroll(id: string): Promise<PayrollDetail> {
  const { data } = await api.get<PayrollDetail>(`/payroll/me/${id}`);
  return data;
}

export async function getMyPayrolls(
  params?: Omit<ListPayrollParams, 'mesaUserId'>,
): Promise<PaginatedPayrolls> {
  const { data } = await api.get<PaginatedPayrolls>('/payroll/me', {
    params: {
      status: params?.status || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}
