import { Lock, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../lib/money';
import type { MesaUserOption } from '../../../types/daily-register.types';
import type { Payroll, PayrollPreview } from '../../../types/payroll.types';
import { PayrollWeekSelector } from './PayrollWeekSelector';

interface PayrollBreakdownCardProps {
  weekStart: string;
  weekEnd: string;
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  mesaUsers: MesaUserOption[];
  mesaUserId: string;
  onMesaUserChange: (mesaUserId: string) => void;
  totals: Pick<
    PayrollPreview,
    | 'grossSales'
    | 'baseCommissionTotal'
    | 'weekendBonusTotal'
    | 'advancesDeductionTotal'
    | 'netPayable'
    | 'registersCount'
    | 'advancesCount'
  >;
  generatedPayroll: Payroll | null;
  isLoadingPreview: boolean;
  isSubmitting: boolean;
  onGenerate: () => void;
  onClose: () => void;
}

export function PayrollBreakdownCard({
  weekStart,
  weekEnd,
  weekOffset,
  onWeekOffsetChange,
  mesaUsers,
  mesaUserId,
  onMesaUserChange,
  totals,
  generatedPayroll,
  isLoadingPreview,
  isSubmitting,
  onGenerate,
  onClose,
}: PayrollBreakdownCardProps) {
  const { t } = useTranslation();
  const canClose = generatedPayroll?.status === 'DRAFT';
  const isClosed =
    generatedPayroll?.status === 'CLOSED' || generatedPayroll?.status === 'PAID';

  return (
    <section className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
            {t('payroll:period_label')}
          </p>
          <PayrollWeekSelector
            weekStart={weekStart}
            weekEnd={weekEnd}
            weekOffset={weekOffset}
            onWeekOffsetChange={onWeekOffsetChange}
          />
        </div>

        <label className="flex w-full min-w-0 flex-col gap-2 text-sm sm:min-w-[240px]">
          <span className="font-semibold text-slate-heading">{t('common:manicurist')}</span>
          <select
            value={mesaUserId}
            onChange={(event) => onMesaUserChange(event.target.value)}
            className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="">{t('payroll:select_mesa')}</option>
            {mesaUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-body">
            {t('payroll:gross_sales')}
          </p>
          <p className="mt-1 font-outfit text-xl font-bold text-slate-heading">
            {formatMoney(totals.grossSales)}
          </p>
          <p className="mt-1 text-xs text-slate-body">
            {t(
              totals.registersCount === 1
                ? 'payroll:tickets_count'
                : 'payroll:tickets_count_plural',
              { count: totals.registersCount },
            )}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-border bg-white px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-body">
            {t('payroll:base_commission')}
          </p>
          <p className="mt-1 font-outfit text-xl font-bold text-slate-heading">
            {formatMoney(totals.baseCommissionTotal)}
          </p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">
            {t('payroll:weekend_bonus_pct')}
          </p>
          <p className="mt-1 font-outfit text-xl font-bold text-amber-800">
            {formatMoney(totals.weekendBonusTotal)}
          </p>
          <p className="mt-1 text-xs text-amber-800/80">{t('payroll:weekend_days')}</p>
        </article>
        <article className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700">
            {t('payroll:advances_deduction')}
          </p>
          <p className="mt-1 font-outfit text-xl font-bold text-red-700">
            {formatMoney(totals.advancesDeductionTotal)}
          </p>
          <p className="mt-1 text-xs text-red-700/80">
            {t(
              totals.advancesCount === 1
                ? 'payroll:vouchers_count'
                : 'payroll:vouchers_count_plural',
              { count: totals.advancesCount },
            )}
          </p>
        </article>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
            {t('payroll:net_headline')}
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-900">
            {t('payroll:net_formula', {
              amount: formatMoney(totals.advancesDeductionTotal),
            })}
          </p>
          <p className="mt-1 font-outfit text-4xl font-bold text-emerald-700">
            {isLoadingPreview ? '…' : formatMoney(totals.netPayable)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!mesaUserId || isSubmitting || isClosed}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            <Settings2 className="h-4 w-4" />
            {generatedPayroll?.status === 'DRAFT'
              ? t('payroll:update_draft')
              : t('payroll:generate')}
          </button>
          {canClose || isClosed ? (
            <button
              type="button"
              onClick={onClose}
              disabled={!canClose || isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-heading px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              {isClosed ? t('payroll:closed_label') : t('payroll:close')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
