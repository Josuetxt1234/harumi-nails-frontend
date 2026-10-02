import { useState } from 'react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import { useDailyRegistersHistory } from '../../../hooks/useDailyRegistersHistory';
import { formatMoney } from '../../../lib/money';
import type { DailyRegister } from '../../../types/daily-register.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { PageHeader } from '../../ui/layout/PageHeader';
import { HistoryFilterBar } from './DailyRegistersHistoryFilterBar';
import { DailyRegistersTable } from './DailyRegistersTable';
import { VoidRegisterDialog } from './VoidRegisterDialog';
import { useTranslation } from 'react-i18next';

export interface DailyRegistersHistoryViewProps {
  showHeader?: boolean;
  enabled?: boolean;
}

export function DailyRegistersHistoryView({
  showHeader = true,
  enabled = true,
}: DailyRegistersHistoryViewProps) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const {
    registers,
    mesaUsers,
    dateRange,
    startDate,
    endDate,
    rangeError,
    selectQuickRange,
    selectCustomRange,
    changeStartDate,
    changeEndDate,
    mesaUserId,
    setMesaUserId,
    canFilterByMesa,
    summary,
    isLoading,
    isVoiding,
    errorMessage,
    successMessage,
    voidRegister,
  } = useDailyRegistersHistory({ enabled });

  const [registerToVoid, setRegisterToVoid] = useState<DailyRegister | null>(
    null,
  );

  const canVoid = hasPermission(PERMISSIONS.DAILY_REGISTERS_VOID);

  const handleConfirmVoid = async () => {
    if (!registerToVoid) {
      return;
    }

    try {
      await voidRegister(registerToVoid.id);
      setRegisterToVoid(null);
    } catch {
      // El mensaje de error se maneja en el hook.
    }
  };

  return (
    <div className="flex flex-1 flex-col lg:min-h-0">
      {showHeader ? (
        <PageHeader
          title={t('history:title')}
          subtitle={t('history:subtitle')}
        />
      ) : null}

      <section className="flex flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:min-h-0 lg:p-8">
        <div className="mb-6 flex shrink-0 flex-col gap-4">
          <HistoryFilterBar
            dateRange={dateRange}
            startDate={startDate}
            endDate={endDate}
            rangeError={rangeError}
            mesaUserId={mesaUserId}
            mesaUsers={mesaUsers}
            canFilterByMesa={canFilterByMesa}
            onSelectQuickRange={selectQuickRange}
            onSelectCustomRange={selectCustomRange}
            onStartDateChange={changeStartDate}
            onEndDateChange={changeEndDate}
            onMesaUserChange={setMesaUserId}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-body">
                {t('history:total_charged')}
              </p>
              <p className="mt-1 font-outfit text-2xl font-bold text-slate-heading">
                {formatMoney(summary.totalPaid)}
              </p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                {t('history:total_commissions')}
              </p>
              <p className="mt-1 font-outfit text-2xl font-bold text-emerald-700">
                {formatMoney(summary.totalCommission)}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-border bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-body">
                {t('history:services_done')}
              </p>
              <p className="mt-1 font-outfit text-2xl font-bold text-slate-heading">
                {summary.servicesCount}
              </p>
            </article>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={successMessage} tone="success" />
          </div>
        ) : null}

        <div className="w-full min-h-[400px] flex-1">
          <DailyRegistersTable
            registers={registers}
            isLoading={isLoading}
            emptyTitle={t('pos:empty_title')}
            emptyDescription={t('history:empty_filter')}
            onVoid={canVoid ? setRegisterToVoid : undefined}
          />
        </div>
      </section>

      <VoidRegisterDialog
        isOpen={Boolean(registerToVoid)}
        clientName={registerToVoid?.clientName ?? ''}
        isSubmitting={isVoiding}
        onClose={() => setRegisterToVoid(null)}
        onConfirm={handleConfirmVoid}
      />
    </div>
  );
}
