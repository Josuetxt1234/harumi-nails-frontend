import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import { useServicesManager } from '../../../hooks/useServicesManager';
import type { SalonService, ServiceFormMode } from '../../../types/service.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { ConfirmDialog, ConfirmDialogType } from '../../ui/overlay/ConfirmDialog';
import { ServiceFormModal } from './ServiceFormModal';
import { ServicesTable } from './ServicesTable';
import { ServicesToolbar } from './ServicesToolbar';
import { useTranslation } from 'react-i18next';

export function ServicesManagementView() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const {
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
    createService,
    updateService,
    toggleServiceStatus,
    deleteService,
  } = useServicesManager();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ServiceFormMode>('create');
  const [selectedService, setSelectedService] = useState<SalonService | null>(
    null,
  );
  const [confirmState, setConfirmState] = useState<{
    type: ConfirmDialogType;
    service: SalonService;
  } | null>(null);
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);

  const canCreate = hasPermission(PERMISSIONS.SERVICES_CREATE);
  const categoryOptions = useMemo(
    () => [...new Set(services.map((service) => service.category))],
    [services],
  );

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: SalonService) => {
    setModalMode('edit');
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmState) {
      return;
    }

    setIsConfirmSubmitting(true);

    try {
      if (confirmState.type === 'delete') {
        await deleteService(confirmState.service.id);
      } else {
        await toggleServiceStatus(confirmState.service.id);
      }

      setConfirmState(null);
    } catch {
      // El mensaje de error se maneja en el hook.
    } finally {
      setIsConfirmSubmitting(false);
    }
  };

  const confirmCopy =
    confirmState?.type === 'delete'
      ? {
          title: t('services:delete_title'),
          description: t('services:delete_body'),
          confirmLabel: t('services:delete_action'),
        }
      : confirmState?.type === 'deactivate'
        ? {
            title: t('services:deactivate_title'),
            description: t('services:deactivate_body'),
            confirmLabel: t('services:deactivate'),
          }
        : {
            title: t('services:activate_title'),
            description: t('services:activate_body'),
            confirmLabel: t('services:activate'),
          };

  return (
    <div className="flex flex-1 flex-col lg:min-h-0">
      <div className="mb-4 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('services:search_placeholder')}
            className="w-full rounded-full border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <section className="flex flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:min-h-0 lg:p-8">
        <ServicesToolbar
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          categoryOptions={categoryOptions}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateClick={openCreateModal}
          showCreateButton={canCreate}
        />

        {errorMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col overflow-y-auto lg:min-h-0 lg:overflow-hidden">
          <div className="flex-1 lg:min-h-0 lg:overflow-y-auto">
            {isLoading ? (
              <EmptyState title={t('services:loading')} dashed />
            ) : (
              <ServicesTable
                services={services}
                onEdit={openEditModal}
                onToggleStatus={(service) =>
                  setConfirmState({
                    type: service.isActive ? 'deactivate' : 'activate',
                    service,
                  })
                }
                onDelete={(service) =>
                  setConfirmState({ type: 'delete', service })
                }
              />
            )}
          </div>
        </div>

        {totalPages > 1 ? (
          <div className="mt-4 flex shrink-0 items-center justify-between text-sm text-slate-body">
            <p>
              {t('services:page_of', { page, totalPages, total })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-slate-border px-4 py-2 font-semibold text-slate-heading transition hover:bg-slate-50 disabled:opacity-50"
              >
                {t('services:previous')}
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="rounded-xl border border-slate-border px-4 py-2 font-semibold text-slate-heading transition hover:bg-slate-50 disabled:opacity-50"
              >
                {t('services:next')}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <ServiceFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        service={selectedService}
        categorySuggestions={categoryOptions}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onCreate={createService}
        onUpdate={updateService}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmState)}
        type={confirmState?.type ?? 'deactivate'}
        subjectName={confirmState?.service.name ?? ''}
        title={confirmCopy.title}
        description={confirmCopy.description}
        confirmLabel={confirmCopy.confirmLabel}
        isSubmitting={isConfirmSubmitting}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
