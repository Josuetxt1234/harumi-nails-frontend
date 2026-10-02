export interface SalonService {
  id: string;
  name: string;
  category: string;
  price: number;
  commissionPercentage: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedServicesResponse {
  data: SalonService[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ServicesListResult {
  services: SalonService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServicesQueryParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateServiceInput {
  name: string;
  category: string;
  price: number;
  commissionPercentage: number;
  isActive?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  category?: string;
  price?: number;
  commissionPercentage?: number;
  isActive?: boolean;
}

export type ServiceFormMode = 'create' | 'edit';
