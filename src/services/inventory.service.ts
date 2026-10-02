import type {
  CreateCategoryInput,
  CreateMaterialInput,
  CreateMovementInput,
  InventoryCategory,
  InventoryMovement,
  ListMaterialsParams,
  Material,
  MaterialDetail,
  PaginatedMaterials,
  UpdateMaterialInput,
} from '../types/inventory.types';
import api from './api';

export async function getMaterials(
  params?: ListMaterialsParams,
): Promise<PaginatedMaterials> {
  const { data } = await api.get<PaginatedMaterials>('/inventory/materials', {
    params: {
      search: params?.search || undefined,
      categoryId: params?.categoryId || undefined,
      lowStockOnly: params?.lowStockOnly === true ? true : undefined,
      status: params?.status || undefined,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });
  return data;
}

export async function getMaterialById(id: string): Promise<MaterialDetail> {
  const { data } = await api.get<MaterialDetail>(`/inventory/materials/${id}`);
  return data;
}

export async function createMaterial(
  input: CreateMaterialInput,
): Promise<Material> {
  const { data } = await api.post<Material>('/inventory/materials', input);
  return data;
}

export async function updateMaterial(
  id: string,
  input: UpdateMaterialInput,
): Promise<Material> {
  const { data } = await api.patch<Material>(`/inventory/materials/${id}`, input);
  return data;
}

export async function getCategories(): Promise<InventoryCategory[]> {
  const { data } = await api.get<InventoryCategory[]>('/inventory/categories');
  return data;
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<InventoryCategory> {
  const { data } = await api.post<InventoryCategory>(
    '/inventory/categories',
    input,
  );
  return data;
}

export async function registerMovement(
  input: CreateMovementInput,
): Promise<InventoryMovement> {
  const { data } = await api.post<InventoryMovement>(
    '/inventory/movements',
    input,
  );
  return data;
}

