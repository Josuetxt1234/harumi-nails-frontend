import { useCallback, useEffect, useState } from 'react';
import i18n from '../i18n';
import { getApiErrorMessage } from '../lib/get-api-error';
import {
  createCategory,
  createMaterial,
  getCategories,
  getMaterials,
  registerMovement,
  updateMaterial,
} from '../services/inventory.service';
import type {
  CreateCategoryInput,
  CreateMaterialInput,
  CreateMovementInput,
  InventoryCategory,
  Material,
  UpdateMaterialInput,
} from '../types/inventory.types';

export function useInventory() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [listResponse, alertsResponse] = await Promise.all([
        getMaterials({
          search: search.trim() || undefined,
          categoryId: categoryId || undefined,
          lowStockOnly,
          page: 1,
          limit: 100,
        }),
        getMaterials({
          lowStockOnly: true,
          page: 1,
          limit: 1,
        }),
      ]);

      setMaterials(Array.isArray(listResponse.data) ? listResponse.data : []);
      setLowStockCount(alertsResponse.meta.total);
    } catch (error) {
      setMaterials([]);
      setLowStockCount(0);
      setErrorMessage(
        getApiErrorMessage(error, 'errors:inventory_load'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, lowStockOnly, search]);

  const refreshCategories = useCallback(async () => {
    try {
      const items = await getCategories();
      setCategories(Array.isArray(items) ? items : []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  const create = useCallback(
    async (input: CreateMaterialInput) => {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await createMaterial(input);
        setSuccessMessage(i18n.t('notifications:material_created'));
        await refresh();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:inventory_create'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, input: UpdateMaterialInput) => {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await updateMaterial(id, input);
        setSuccessMessage(i18n.t('notifications:material_updated'));
        await refresh();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:inventory_update'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh],
  );

  const move = useCallback(
    async (input: CreateMovementInput) => {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await registerMovement(input);
        setSuccessMessage(i18n.t('notifications:movement_registered'));
        await refresh();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:inventory_move'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh],
  );

  const addCategory = useCallback(
    async (input: CreateCategoryInput) => {
      const created = await createCategory(input);
      await refreshCategories();
      return created;
    },
    [refreshCategories],
  );

  return {
    materials,
    categories,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    lowStockOnly,
    setLowStockOnly,
    lowStockCount,
    isLoading,
    isSubmitting,
    errorMessage,
    successMessage,
    create,
    update,
    move,
    addCategory,
  };
}
