import { usePayroll } from '../../hooks/usePayroll';
import { useTranslation } from 'react-i18next';
import { PayrollBreakdownCard } from '../../components/features/payroll/PayrollBreakdownCard';
import { PayrollListTable } from '../../components/features/payroll/PayrollListTable';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';

export function PayrollManagementPage() {
  const { t } = useTranslation('payroll');
  const {
    week,
    weekOffset,
    setWeekOffset,
    mesaUsers,
    mesaUserId,
    setMesaUserId,
    generatedPayroll,
    payrolls,
    totals,
    isLoadingPreview,
    isLoadingList,
    isSubmitting,
    errorMessage,
    successMessage,
    generate,
    close,
  } = usePayroll({ scope: 'admin' });

  return (
    <ModulePage
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto lg:min-h-0">
        {errorMessage ? <AlertBanner message={errorMessage} /> : null}
        {successMessage ? (
          <AlertBanner message={successMessage} tone="success" />
        ) : null}

        <PayrollBreakdownCard
          weekStart={week.startDate}
          weekEnd={week.endDate}
          weekOffset={weekOffset}
          onWeekOffsetChange={setWeekOffset}
          mesaUsers={mesaUsers}
          mesaUserId={mesaUserId}
          onMesaUserChange={setMesaUserId}
          totals={totals}
          generatedPayroll={generatedPayroll}
          isLoadingPreview={isLoadingPreview}
          isSubmitting={isSubmitting}
          onGenerate={() => void generate()}
          onClose={() => void close()}
        />

        <section className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-outfit text-lg font-bold text-slate-heading">
            {t('list_title')}
          </h3>
          <PayrollListTable payrolls={payrolls} isLoading={isLoadingList} />
        </section>
      </div>
    </ModulePage>
  );
}
