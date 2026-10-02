export type AdvanceStatus = 'PENDING' | 'APPLIED' | 'CANCELLED';

export interface Advance {
  id: string;
  mesaUserId: string;
  mesaUserName: string;
  amount: number;
  reason: string | null;
  date: string;
  status: AdvanceStatus;
  payrollId: string | null;
  createdById: string;
  createdByName: string;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancelledByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvanceInput {
  mesaUserId: string;
  amount: number;
  reason?: string;
  date?: string;
}

export interface ListAdvancesParams {
  mesaUserId?: string;
  status?: AdvanceStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAdvances {
  data: Advance[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
