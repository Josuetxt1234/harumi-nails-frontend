export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD';

export interface SalonService {
  id: string;
  name: string;
  category: string;
  price: number;
  commissionPercentage: number;
  isActive: boolean;
}

export interface CartItem {
  serviceId: string;
  name: string;
  category: string;
  unitPrice: number;
  commissionRate: number;
  quantity: number;
}

export interface CreateDailyRegisterInput {
  mesaUserId?: string;
  clientName: string;
  paymentMethod: PaymentMethod;
  discountAmount?: number;
  hasCardFee?: boolean;
  items: Array<{
    serviceId: string;
    quantity: number;
  }>;
}

export interface DailyRegisterDetail {
  id: string;
  serviceId: string;
  serviceName: string;
  unitPrice: number;
  commissionRate: number;
  quantity: number;
  lineSubtotal: number;
  lineCommission: number;
}

export interface DailyRegister {
  id: string;
  clientName: string;
  paymentMethod: PaymentMethod;
  subtotalBase: number;
  discountAmount: number;
  cardFeeAmount: number;
  totalPaid: number;
  totalCommission: number;
  mesaUserId: string;
  mesaUserName?: string;
  createdById: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  details: DailyRegisterDetail[];
}

export interface MesaUserOption {
  id: string;
  firstName: string;
  lastName: string;
}

export type DateRangePreset =
  | 'TODAY'
  | 'YESTERDAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'CUSTOM';

export interface ListDailyRegistersParams {
  dateRange?: DateRangePreset;
  startDate?: string;
  endDate?: string;
  mesaUserId?: string;
  paymentMethod?: PaymentMethod | 'all';
  page?: number;
  limit?: number;
}

export interface PaginatedDailyRegisters {
  data: DailyRegister[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalPaid: number;
    totalCommission: number;
    servicesCount: number;
  };
}

export interface RegisterTotals {
  subtotalBase: number;
  discountAmount: number;
  amountAfterDiscount: number;
  cardFeeAmount: number;
  totalPaid: number;
  totalCommission: number;
}
