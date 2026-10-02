import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdvances } from '../../hooks/useAdvances';
import { usePayroll } from '../../hooks/usePayroll';
import { PayrollListTable } from '../../components/features/payroll/PayrollListTable';
import { PayrollReceiptCard } from '../../components/features/payroll/PayrollReceiptCard';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import type { Payroll } from '../../types/payroll.types';

export function MesaPayrollPage() {
  const { t } = useTranslation('payroll');
  const { payrolls, isLoadingList, errorMessage } = usePayroll({
    scope: 'mine',
  });
  const { advances } = useAdvances({ scope: 'mine' });
  const [selected, setSelected] = useState<Payroll | null>(null);

  const activePayroll = selected ?? payrolls[0] ?? null;
  const deductedAdvances = useMemo(() => {
    if (!activePayroll) {
      return [];
    }

    return advances.filter(
      (advance) => advance.payrollId === activePayroll.id,
    );
  }, [activePayroll, advances]);

  return (
    <ModulePage
      title={t('my_title')}
      subtitle={t('my_subtitle')}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto lg:grid lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:overflow-hidden">
        <section className="min-h-0 overflow-y-auto rounded-[28px] border border-slate-border bg-white p-6">
          {errorMessage ? (
            <div className="mb-4">
              <AlertBanner message={errorMessage} />
            </div>
          ) : null}
          <PayrollListTable
            payrolls={payrolls}
            isLoading={isLoadingList}
            selectedId={activePayroll?.id}
            onSelect={setSelected}
          />
        </section>

        {activePayroll ? (
          <div className="min-h-0 overflow-y-auto">
            <PayrollReceiptCard
              payroll={activePayroll}
              deductedAdvances={deductedAdvances}
            />
          </div>
        ) : null}
      </div>
    </ModulePage>
  );
}
