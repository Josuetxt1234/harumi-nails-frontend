export type PayrollStatus = 'DRAFT' | 'CLOSED' | 'PAID';

export interface PayrollTotals {
  grossSales: number;
  baseCommissionTotal: number;
  weekendBonusTotal: number;
  advancesDeductionTotal: number;
  netPayable: number;
}

export interface GeneratePayrollInput {
  mesaUserId: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface PayrollPreview extends PayrollTotals {
  mesaUserId: string;
  mesaUserName: string;
  periodStart: string;
  periodEnd: string;
  registerIds: string[];
  advanceIds: string[];
  registersCount: number;
  advancesCount: number;
}

export interface Payroll extends PayrollTotals {
  id: string;
  mesaUserId: string;
  mesaUserName: string;
  periodStart: string;
  periodEnd: string;
  status: PayrollStatus;
  closedAt: string | null;
  closedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListPayrollParams {
  mesaUserId?: string;
  status?: PayrollStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedPayrolls {
  data: Payroll[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
