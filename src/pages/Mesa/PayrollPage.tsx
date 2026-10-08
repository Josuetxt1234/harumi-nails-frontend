import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PayrollDetailModal } from '../../components/features/payroll/PayrollDetailModal';
import { PayrollListTable } from '../../components/features/payroll/PayrollListTable';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { usePayroll } from '../../hooks/usePayroll';
import { getApiErrorMessage } from '../../lib/get-api-error';
import { formatMoney } from '../../lib/money';
import {
  formatPayrollPeriodRange,
  getCurrentPayrollWeek,
  toSalonDateKey,
  toSalonPeriodEndDateKey,
} from '../../lib/payroll-week';
import { getMyPayroll } from '../../services/payroll.service';
import type { Payroll, PayrollDetail } from '../../types/payroll.types';

export function MesaPayrollPage() {
  const { t } = useTranslation('payroll');
  const { payrolls, isLoadingList, errorMessage } = usePayroll({
    scope: 'mine',
  });
  const currentWeek = useMemo(() => getCurrentPayrollWeek(0), []);
  const [detail, setDetail] = useState<PayrollDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const currentDraft = useMemo(
    () =>
      payrolls.find(
        (payroll) =>
          payroll.status === 'DRAFT' &&
          toSalonDateKey(payroll.periodStart) === currentWeek.startDate &&
          toSalonPeriodEndDateKey(payroll.periodEnd) === currentWeek.endDate,
      ) ?? null,
    [currentWeek.endDate, currentWeek.startDate, payrolls],
  );
  const history = useMemo(
    () => payrolls.filter((payroll) => payroll.id !== currentDraft?.id),
    [currentDraft?.id, payrolls],
  );

  async function openDetail(payroll: Payroll) {
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailError('');
    setDetail(null);

    try {
      setDetail(await getMyPayroll(payroll.id));
    } catch (error) {
      setDetailError(getApiErrorMessage(error, 'errors:payroll_detail'));
    } finally {
      setIsDetailLoading(false);
    }
  }

  return (
    <ModulePage title={t('my_title')} subtitle={t('my_subtitle')}>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto lg:min-h-0">
        {errorMessage ? <AlertBanner message={errorMessage} /> : null}

        {currentDraft ? (
          <button
            type="button"
            onClick={() => void openDetail(currentDraft)}
            className="rounded-[28px] border border-brand/30 bg-brand/5 p-6 text-left shadow-sm transition hover:border-brand"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {t('draft_review')}
            </p>
            <p className="mt-2 font-outfit text-2xl font-bold text-slate-heading">
              {formatMoney(currentDraft.netPayable)}
            </p>
            <p className="mt-1 text-sm text-slate-body">
              {formatPayrollPeriodRange(
                currentDraft.periodStart,
                currentDraft.periodEnd,
              )}
            </p>
            <p className="mt-3 text-sm text-slate-body">{t('draft_review_hint')}</p>
          </button>
        ) : null}

        <section className="min-h-0 overflow-y-auto rounded-[28px] border border-slate-border bg-white p-6">
          <h2 className="font-outfit text-lg font-bold text-slate-heading">
            {t('history')}
          </h2>
          <p className="mb-4 mt-1 text-sm text-slate-body">{t('history_hint')}</p>
          <PayrollListTable
            payrolls={history}
            isLoading={isLoadingList}
            onSelect={(payroll) => void openDetail(payroll)}
          />
        </section>
      </div>

      <PayrollDetailModal
        isOpen={isDetailOpen}
        isLoading={isDetailLoading}
        errorMessage={detailError}
        detail={detail}
        onClose={() => setIsDetailOpen(false)}
      />
    </ModulePage>
  );
}
