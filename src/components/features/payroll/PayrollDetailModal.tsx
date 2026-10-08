import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../lib/format-register';
import { formatMoney } from '../../../lib/money';
import { formatPayrollPeriodRange } from '../../../lib/payroll-week';
import type { PayrollDetail } from '../../../types/payroll.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { Modal } from '../../ui/overlay/Modal';
import { AdvanceStatusBadge } from '../advances/AdvanceStatusBadge';

interface PayrollDetailModalProps {
  isOpen: boolean;
  isLoading: boolean;
  errorMessage: string;
  detail: PayrollDetail | null;
  onClose: () => void;
}

export function PayrollDetailModal({
  isOpen,
  isLoading,
  errorMessage,
  detail,
  onClose,
}: PayrollDetailModalProps) {
  const { t } = useTranslation();
  const isDraft = detail?.status === 'DRAFT';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        isDraft ? t('payroll:draft_review') : t('payroll:detail_title')
      }
      subtitle={
        detail
          ? formatPayrollPeriodRange(detail.periodStart, detail.periodEnd)
          : undefined
      }
    >
      {isLoading ? (
        <p className="text-sm text-slate-body">{t('common:loading')}</p>
      ) : null}
      {errorMessage ? <AlertBanner message={errorMessage} /> : null}
      {detail && !isLoading ? (
        <div className="space-y-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-body">
                {t('payroll:gross_sales')}
              </dt>
              <dd className="mt-1 font-semibold text-slate-heading">
                {formatMoney(detail.grossSales)}
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-border px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-body">
                {t('payroll:base_commission')}
              </dt>
              <dd className="mt-1 font-semibold text-slate-heading">
                {formatMoney(detail.baseCommissionTotal)}
              </dd>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                {t('payroll:weekend_bonus_pct')}
              </dt>
              <dd className="mt-1 font-semibold text-amber-800">
                {formatMoney(detail.weekendBonusTotal)}
              </dd>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-red-700">
                {t('payroll:advances_deduction')}
              </dt>
              <dd className="mt-1 font-semibold text-red-700">
                {formatMoney(detail.advancesDeductionTotal)}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
              {t('payroll:net_payable')}
            </p>
            <p className="mt-1 font-outfit text-3xl font-bold text-emerald-700">
              {formatMoney(detail.netPayable)}
            </p>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-heading">
              {t('payroll:works')}
            </h3>
            {detail.registers.length === 0 ? (
              <p className="text-sm text-slate-body">{t('payroll:no_works')}</p>
            ) : (
              <ul className="space-y-3">
                {detail.registers.map((register) => (
                  <li
                    key={register.id}
                    className="rounded-2xl border border-slate-border px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-heading">
                          {register.clientName}
                        </p>
                        <p className="text-xs text-slate-body">
                          {formatDateTime(register.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-heading">
                        {formatMoney(register.totalPaid)}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {register.services.map((service, index) => (
                        <li
                          key={`${register.id}-${index}`}
                          className="flex items-center justify-between text-sm text-slate-body"
                        >
                          <span>
                            {service.serviceName} × {service.quantity}
                          </span>
                          <span>{formatMoney(service.lineCommission)}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-heading">
              {t('payroll:deducted_vouchers')}
            </h3>
            {detail.advances.length === 0 ? (
              <p className="text-sm text-slate-body">{t('payroll:no_deducted')}</p>
            ) : (
              <ul className="space-y-2">
                {detail.advances.map((advance) => (
                  <li
                    key={advance.id}
                    className="flex items-center justify-between rounded-xl border border-slate-border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-heading">
                        {advance.reason || t('vouchers:cash_advance')}
                      </p>
                      <p className="text-xs text-slate-body">
                        {formatDateTime(advance.date)}
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
          </section>
        </div>
      ) : null}
    </Modal>
  );
}
