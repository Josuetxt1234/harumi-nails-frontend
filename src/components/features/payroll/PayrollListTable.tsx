import { formatDateTime } from '../../../lib/format-register';
import { formatMoney } from '../../../lib/money';
import { formatPayrollPeriodRange } from '../../../lib/payroll-week';
import {
  TABLE_CELL_CLASS,
  TABLE_CELL_SECONDARY_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_HEAD_SECONDARY_CLASS,
  TABLE_SCROLL_CLASS,
} from '../../../lib/table-layout';
import type { Payroll } from '../../../types/payroll.types';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { useTranslation } from 'react-i18next';

const STATUS_KEYS: Record<Payroll['status'], string> = {
  DRAFT: 'draft',
  CLOSED: 'closed',
  PAID: 'paid',
};

interface PayrollListTableProps {
  payrolls: Payroll[];
  isLoading?: boolean;
  onSelect?: (payroll: Payroll) => void;
  selectedId?: string;
}

export function PayrollListTable({
  payrolls,
  isLoading = false,
  onSelect,
  selectedId,
}: PayrollListTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <EmptyState title={t('payroll:loading')} dashed />;
  }

  if (payrolls.length === 0) {
    return (
      <EmptyState
        title={t('payroll:empty')}
        description={t('payroll:empty_hint')}
        dashed
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {payrolls.map((payroll) => (
          <article
            key={payroll.id}
            className={[
              'rounded-2xl border bg-white p-4 shadow-sm',
              onSelect ? 'cursor-pointer' : '',
              selectedId === payroll.id ? 'border-brand bg-brand/5' : 'border-slate-border',
            ].join(' ')}
            onClick={() => onSelect?.(payroll)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-outfit text-sm font-semibold text-slate-heading">
                  {payroll.mesaUserName}
                </p>
                <p className="mt-1 text-xs text-slate-body">
                  {formatPayrollPeriodRange(payroll.periodStart, payroll.periodEnd)}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-heading">
                {t(`status:${STATUS_KEYS[payroll.status]}`)}
              </span>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-body">{t('payroll:base_commission')}</dt>
                <dd className="font-semibold text-slate-heading">
                  {formatMoney(payroll.baseCommissionTotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-body">{t('payroll:advances_deduction')}</dt>
                <dd className="font-semibold text-slate-heading">
                  {formatMoney(payroll.advancesDeductionTotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-body">{t('payroll:weekend_bonus')}</dt>
                <dd className="font-semibold text-slate-heading">
                  {formatMoney(payroll.weekendBonusTotal)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-slate-border pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                {t('payroll:net_payable')}
              </p>
              <p className="mt-1 font-outfit text-2xl font-bold text-emerald-700">
                {formatMoney(payroll.netPayable)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-border md:block">
      <div className={TABLE_SCROLL_CLASS}>
        <table className="min-w-full divide-y divide-slate-border">
          <thead className="bg-slate-50">
            <tr>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('payroll:period')}</th>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('common:manicurist')}</th>
              <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('payroll:net_payable')}</th>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('common:status')}</th>
              <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('payroll:generated_at')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border bg-white">
            {payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className={[
                  'hover:bg-slate-50/70',
                  onSelect ? 'cursor-pointer' : '',
                  selectedId === payroll.id ? 'bg-brand/5' : '',
                ].join(' ')}
                onClick={() => onSelect?.(payroll)}
              >
                <td className={`${TABLE_CELL_CLASS} text-slate-body`}>
                  {formatPayrollPeriodRange(payroll.periodStart, payroll.periodEnd)}
                </td>
                <td className={`${TABLE_CELL_CLASS} font-semibold text-slate-heading`}>
                  {payroll.mesaUserName}
                </td>
                <td className={`${TABLE_CELL_CLASS} text-right font-bold text-emerald-700`}>
                  {formatMoney(payroll.netPayable)}
                </td>
                <td className={`${TABLE_CELL_CLASS} text-slate-body`}>
                  {t(`status:${STATUS_KEYS[payroll.status]}`)}
                </td>
                <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                  {formatDateTime(payroll.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
