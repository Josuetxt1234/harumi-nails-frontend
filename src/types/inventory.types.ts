export type CatalogStatus = 'ACTIVE' | 'INACTIVE';

export type MaterialUnit =
  | 'UNIT'
  | 'ML'
  | 'GRAMS'
  | 'PAIR'
  | 'BOX'
  | 'BOTTLE';

export type InventoryMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryCategory {
  id: string;
  name: string;
  description: string | null;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  unit: MaterialUnit;
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  status: CatalogStatus;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export interface MaterialDetail extends Material {
  movements: InventoryMovement[];
}

export interface PaginatedMaterials {
  data: Material[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListMaterialsParams {
  search?: string;
  categoryId?: string;
  lowStockOnly?: boolean;
  status?: CatalogStatus;
  page?: number;
  limit?: number;
}

export interface CreateMaterialInput {
  code: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: MaterialUnit;
  minimumStock: number;
  costPrice: number;
  initialStock?: number;
}

export interface UpdateMaterialInput {
  code?: string;
  name?: string;
  description?: string | null;
  categoryId?: string;
  unit?: MaterialUnit;
  minimumStock?: number;
  costPrice?: number;
  status?: CatalogStatus;
}

export interface CreateMovementInput {
  materialId: string;
  type: InventoryMovementType;
  quantity: number;
  reason: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}
