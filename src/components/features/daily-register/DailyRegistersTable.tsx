import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  formatDateTime,
  formatShortTicketId,
  formatTime,
  getPaymentMethodLabel,
} from '../../../lib/format-register';
import { formatMoney } from '../../../lib/money';
import {
  TABLE_CELL_CLASS,
  TABLE_CELL_SECONDARY_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_HEAD_SECONDARY_CLASS,
  TABLE_SCROLL_CLASS,
} from '../../../lib/table-layout';
import type { DailyRegister } from '../../../types/daily-register.types';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { StatusBadge } from '../../ui/feedback/StatusBadge';

interface DailyRegistersTableProps {
  registers: DailyRegister[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onVoid?: (register: DailyRegister) => void;
}

export function DailyRegistersTable({
  registers,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  onVoid,
}: DailyRegistersTableProps) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const canVoid = Boolean(onVoid) && hasPermission(PERMISSIONS.DAILY_REGISTERS_VOID);
  const resolvedEmptyTitle = emptyTitle ?? t('pos:empty_title');
  const resolvedEmptyDescription = emptyDescription ?? t('pos:empty_description');

  if (isLoading) {
    return <EmptyState title={t('pos:loading')} dashed />;
  }

  if (registers.length === 0) {
    return (
      <EmptyState
        title={resolvedEmptyTitle}
        description={resolvedEmptyDescription}
        dashed
      />
    );
  }

  return (
    <div className="flex w-full min-h-[400px] flex-1 flex-col">
      <div className="space-y-3 md:hidden">
        {registers.map((register) => {
          const servicesSummary =
            (register.details ?? [])
              .map((detail) => `${detail.serviceName} x${detail.quantity}`)
              .join(', ') || '—';

          return (
            <article
              key={register.id}
              className="rounded-2xl border border-slate-border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                    {t('pos:ticket')} #{formatShortTicketId(register.id)}
                  </p>
                  <p className="mt-1 text-sm text-slate-body">
                    {formatTime(register.createdAt)}
                  </p>
                </div>
                <StatusBadge isActive activeLabel={t('pos:registered_status')} />
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold text-slate-heading">{register.clientName}</p>
                <p className="text-slate-body">
                  {t('pos:served_by')}: {register.mesaUserName ?? '—'}
                </p>
                <p className="text-slate-body">
                  {t('pos:payment_method')}: {getPaymentMethodLabel(register.paymentMethod)}
                </p>
                <p className="text-slate-body">{servicesSummary}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-border pt-3">
                <p className="font-outfit text-lg font-bold text-slate-heading">
                  {formatMoney(register.totalPaid)}
                </p>
                {canVoid ? (
                  <button
                    type="button"
                    onClick={() => onVoid?.(register)}
                    className="min-h-[44px] rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    {t('pos:void_action')}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden rounded-2xl border border-slate-border md:block">
        <div className={TABLE_SCROLL_CLASS}>
          <table className="min-w-full divide-y divide-slate-border">
            <thead className="bg-slate-50">
              <tr>
                <th className={TABLE_HEAD_CELL_CLASS}>{t('pos:datetime')}</th>
                <th className={TABLE_HEAD_CELL_CLASS}>{t('pos:client')}</th>
                <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('pos:mesa_manicurist')}</th>
                <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('pos:services_rendered')}</th>
                <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('pos:payment_method')}</th>
                <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('pos:total_charged')}</th>
                <th className={`${TABLE_HEAD_SECONDARY_CLASS} text-right`}>
                  {t('pos:manicurist_commission')}
                </th>
                <th className={TABLE_HEAD_CELL_CLASS}>{t('common:status')}</th>
                {canVoid ? (
                  <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('common:actions')}</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border bg-white">
              {registers.map((register) => (
                <tr key={register.id} className="hover:bg-slate-50/70">
                  <td className={`${TABLE_CELL_CLASS} text-slate-body`}>
                    {formatDateTime(register.createdAt)}
                  </td>
                  <td className={`${TABLE_CELL_CLASS} font-semibold text-slate-heading`}>
                    {register.clientName}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                    {register.mesaUserName ?? '—'}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                    {(register.details ?? [])
                      .map((detail) => `${detail.serviceName} x${detail.quantity}`)
                      .join(', ') || '—'}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                    {getPaymentMethodLabel(register.paymentMethod)}
                  </td>
                  <td className={`${TABLE_CELL_CLASS} text-right font-semibold text-slate-heading`}>
                    {formatMoney(register.totalPaid)}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-right font-semibold text-emerald-600`}>
                    {formatMoney(register.totalCommission)}
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <StatusBadge isActive activeLabel={t('pos:registered_status')} />
                  </td>
                  {canVoid ? (
                    <td className={`${TABLE_CELL_CLASS} text-right`}>
                      <button
                        type="button"
                        onClick={() => onVoid?.(register)}
                        className="min-h-[44px] rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        {t('pos:void_action')}
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
