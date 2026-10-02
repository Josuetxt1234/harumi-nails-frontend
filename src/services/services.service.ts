import { getApiErrorMessage } from '../lib/get-api-error';
import type {
  CreateServiceInput,
  PaginatedServicesResponse,
  SalonService,
  ServicesListResult,
  ServicesQueryParams,
  UpdateServiceInput,
} from '../types/service.types';
import api from './api';

export async function getServices(
  params?: ServicesQueryParams,
): Promise<ServicesListResult> {
  try {
    const { data } = await api.get<PaginatedServicesResponse>('/services', {
      params: {
        search: params?.search || undefined,
        category: params?.category || undefined,
        isActive: params?.isActive,
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
      },
    });

    return {
      services: data.data,
      total: data.meta.total,
      page: data.meta.page,
      limit: data.meta.limit,
      totalPages: data.meta.totalPages,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'errors:services_load'));
  }
}

export async function createService(
  data: CreateServiceInput,
): Promise<SalonService> {
  try {
    const { data: created } = await api.post<SalonService>('/services', {
      name: data.name.trim(),
      category: data.category.trim(),
      price: data.price,
      commissionPercentage: data.commissionPercentage,
    });

    if (data.isActive === false) {
      return toggleServiceStatus(created.id, false);
    }

    return created;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'errors:services_create'));
  }
}

export async function updateService(
  id: string,
  data: UpdateServiceInput,
): Promise<SalonService> {
  try {
    const payload: UpdateServiceInput = {};

    if (data.name !== undefined) {
      payload.name = data.name.trim();
    }

    if (data.category !== undefined) {
      payload.category = data.category.trim();
    }

    if (data.price !== undefined) {
      payload.price = data.price;
    }

    if (data.commissionPercentage !== undefined) {
      payload.commissionPercentage = data.commissionPercentage;
    }

    const { data: updated } = await api.patch<SalonService>(
      `/services/${id}`,
      payload,
    );

    if (data.isActive !== undefined && data.isActive !== updated.isActive) {
      return toggleServiceStatus(id, data.isActive);
    }

    return updated;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'errors:services_update'));
  }
}

export async function toggleServiceStatus(
  id: string,
  isActive: boolean,
): Promise<SalonService> {
  try {
    const { data } = await api.patch<SalonService>(`/services/${id}/status`, {
      isActive,
    });
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'errors:services_status'),
    );
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await api.delete(`/services/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'errors:services_delete'));
  }
}
