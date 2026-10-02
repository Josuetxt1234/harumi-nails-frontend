import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../lib/money';

interface PosDaySummaryBarProps {
  operatorName: string;
  totalPaidToday: number;
  commissionToday: number;
  historyPath: string;
}

export function PosDaySummaryBar({
  operatorName,
  totalPaidToday,
  commissionToday,
  historyPath,
}: PosDaySummaryBarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('pos');

  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-2xl border border-slate-border bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
          {t('active_operator')}
        </p>
        <p className="truncate font-outfit text-lg font-bold text-slate-heading">
          {operatorName}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="rounded-xl bg-slate-50 px-4 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-body">
            {t('charged_today')}
          </p>
          <p className="font-outfit text-lg font-bold text-slate-heading">
            {formatMoney(totalPaidToday)}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {t('commission_today')}
          </p>
          <p className="font-outfit text-lg font-bold text-emerald-700">
            {formatMoney(commissionToday)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(historyPath)}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          <ClipboardList className="h-4 w-4" strokeWidth={2} />
          {t('view_history')}
        </button>
      </div>
    </section>
  );
}
