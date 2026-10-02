import { useCallback, useEffect, useState } from 'react';
import i18n from '../i18n';
import {
  createService,
  deleteService,
  getServices,
  toggleServiceStatus,
  updateService,
} from '../services/services.service';
import type {
  CreateServiceInput,
  SalonService,
  UpdateServiceInput,
} from '../types/service.types';

const PAGE_LIMIT = 20;

export function useServicesManager() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all',
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, statusFilter]);

  const refreshServices = useCallback(async () => {
    const response = await getServices({
      search: debouncedSearch || undefined,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      isActive:
        statusFilter === 'all'
          ? undefined
          : statusFilter === 'active',
      page,
      limit: PAGE_LIMIT,
    });

    setServices(response.services);
    setTotal(response.total);
    setTotalPages(Math.max(1, response.totalPages));
  }, [debouncedSearch, categoryFilter, statusFilter, page]);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      setIsLoading(true);

      try {
        setErrorMessage('');
        await refreshServices();
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : i18n.t('errors:services_load'),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, [refreshServices]);

  const handleCreateService = useCallback(
    async (input: CreateServiceInput) => {
      try {
        await createService(input);
        await refreshServices();
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : i18n.t('errors:services_create');
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [refreshServices],
  );

  const handleUpdateService = useCallback(
    async (serviceId: string, input: UpdateServiceInput) => {
      try {
        const updated = await updateService(serviceId, input);
        await refreshServices();
        setErrorMessage('');
        return updated;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : i18n.t('errors:services_update');
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [refreshServices],
  );

  const handleToggleServiceStatus = useCallback(
    async (serviceId: string) => {
      const service = services.find((item) => item.id === serviceId);

      if (!service) {
        return;
      }

      try {
        await toggleServiceStatus(serviceId, !service.isActive);
        await refreshServices();
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : i18n.t('errors:services_status');
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [services, refreshServices],
  );

  const handleDeleteService = useCallback(
    async (serviceId: string) => {
      try {
        await deleteService(serviceId);
        await refreshServices();
        setErrorMessage('');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : i18n.t('errors:services_delete');
        setErrorMessage(message);
        throw new Error(message);
      }
    },
    [refreshServices],
  );

  return {
    services,
    isLoading,
    errorMessage,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    total,
    createService: handleCreateService,
    updateService: handleUpdateService,
    toggleServiceStatus: handleToggleServiceStatus,
    deleteService: handleDeleteService,
  };
}
