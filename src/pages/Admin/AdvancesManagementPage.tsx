import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { useAuth } from '../../context/AuthContext';
import { useAdvances } from '../../hooks/useAdvances';
import { AdvancesTable } from '../../components/features/advances/AdvancesTable';
import { CancelAdvanceDialog } from '../../components/features/advances/CancelAdvanceDialog';
import { CancelledVoucherAuditModal } from '../../components/features/advances/CancelledVoucherAuditModal';
import { CreateAdvanceModal } from '../../components/features/advances/CreateAdvanceModal';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import type { Advance } from '../../types/advance.types';

export function AdvancesManagementPage() {
  const { t } = useTranslation('vouchers');
  const { hasPermission } = useAuth();
  const [advanceToInspect, setAdvanceToInspect] = useState<Advance | null>(null);
  const {
    advances,
    mesaUsers,
    isLoading,
    isSubmitting,
    isCreateOpen,
    setIsCreateOpen,
    advanceToCancel,
    setAdvanceToCancel,
    errorMessage,
    successMessage,
    create,
    cancel,
  } = useAdvances({ scope: 'admin' });

  const canCreate = hasPermission(PERMISSIONS.ADVANCES_CREATE);
  const canCancel = hasPermission(PERMISSIONS.ADVANCES_CANCEL);

  return (
    <ModulePage
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <section className="flex flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:min-h-0 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-body">
            {t('hint')}
          </p>
          {canCreate ? (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              {t('create')}
            </button>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="mb-4">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}
        {successMessage ? (
          <div className="mb-4">
            <AlertBanner message={successMessage} tone="success" />
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <AdvancesTable
            advances={advances}
            isLoading={isLoading}
            showActions={canCancel}
            onCancel={setAdvanceToCancel}
            onInspectCancelled={setAdvanceToInspect}
          />
        </div>
      </section>

      <CreateAdvanceModal
        isOpen={isCreateOpen}
        mesaUsers={mesaUsers}
        isSubmitting={isSubmitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={create}
      />

      <CancelAdvanceDialog
        isOpen={Boolean(advanceToCancel)}
        manicuristName={advanceToCancel?.mesaUserName ?? ''}
        amount={advanceToCancel?.amount ?? 0}
        isSubmitting={isSubmitting}
        onClose={() => setAdvanceToCancel(null)}
        onConfirm={async (reason) => {
          if (advanceToCancel) {
            await cancel(advanceToCancel.id, reason);
          }
        }}
      />

      <CancelledVoucherAuditModal
        isOpen={Boolean(advanceToInspect)}
        advance={advanceToInspect}
        onClose={() => setAdvanceToInspect(null)}
      />
    </ModulePage>
  );
}
