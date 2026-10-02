import { formatMoney } from '../../../lib/money';
import { formatPayrollPeriodRange } from '../../../lib/payroll-week';
import { useTranslation } from 'react-i18next';
import type { Advance } from '../../../types/advance.types';
import type { Payroll } from '../../../types/payroll.types';
import { AdvanceStatusBadge } from '../advances/AdvanceStatusBadge';

interface PayrollReceiptCardProps {
  payroll: Payroll;
  deductedAdvances: Advance[];
}

export function PayrollReceiptCard({
  payroll,
  deductedAdvances,
}: PayrollReceiptCardProps) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
        {t('payroll:receipt')}
      </p>
      <h3 className="mt-2 font-outfit text-2xl font-bold text-slate-heading">
        {payroll.mesaUserName}
      </h3>
      <p className="text-sm text-slate-body">
        {formatPayrollPeriodRange(payroll.periodStart, payroll.periodEnd)}
      </p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-body">{t('payroll:gross_sales')}</dt>
          <dd className="font-semibold text-slate-heading">
            {formatMoney(payroll.grossSales)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-body">{t('payroll:base_commission')}</dt>
          <dd className="font-semibold text-slate-heading">
            {formatMoney(payroll.baseCommissionTotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-amber-800">{t('payroll:weekend_bonus_pct')}</dt>
          <dd className="font-semibold text-amber-800">
            {formatMoney(payroll.weekendBonusTotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-red-700">{t('payroll:advances_deduction')}</dt>
          <dd className="font-semibold text-red-700">
            {formatMoney(payroll.advancesDeductionTotal)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-border pt-3">
          <dt className="font-bold text-emerald-800">{t('payroll:net_payable')}</dt>
          <dd className="font-outfit text-2xl font-bold text-emerald-700">
            {formatMoney(payroll.netPayable)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-slate-heading">
          {t('payroll:deducted_vouchers')}
        </p>
        {deductedAdvances.length === 0 ? (
          <p className="text-sm text-slate-body">
            {t('payroll:no_deducted')}
          </p>
        ) : (
          <ul className="space-y-2">
            {deductedAdvances.map((advance) => (
              <li
                key={advance.id}
                className="flex items-center justify-between rounded-xl border border-slate-border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-heading">
                    {advance.reason || t('vouchers:cash_advance')}
                  </p>
                  <AdvanceStatusBadge status={advance.status} />
                </div>
                <p className="text-sm font-bold text-red-700">
                  {formatMoney(advance.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
