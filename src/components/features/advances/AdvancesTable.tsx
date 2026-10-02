import { Lock } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '../../../lib/format-register';
import { formatMoney } from '../../../lib/money';
import {
  TABLE_CELL_CLASS,
  TABLE_CELL_SECONDARY_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_HEAD_SECONDARY_CLASS,
  TABLE_SCROLL_CLASS,
} from '../../../lib/table-layout';
import { isToday } from '../../../lib/is-today';
import { useTranslation } from 'react-i18next';
import { SYSTEM_ROLES } from '../../../constants/roles.constants';
import { useAuth } from '../../../context/AuthContext';
import type { Advance } from '../../../types/advance.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { AdvanceStatusBadge } from './AdvanceStatusBadge';

interface AdvancesTableProps {
  advances: Advance[];
  isLoading?: boolean;
  showActions?: boolean;
  onCancel?: (advance: Advance) => void;
  onInspectCancelled?: (advance: Advance) => void;
}

export function AdvancesTable({
  advances,
  isLoading = false,
  showActions = false,
  onCancel,
  onInspectCancelled,
}: AdvancesTableProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [infoMessage, setInfoMessage] = useState('');
  const isAdminWithoutSuperAdmin =
    Boolean(user?.roles.includes(SYSTEM_ROLES.ADMIN)) &&
    !user?.roles.includes(SYSTEM_ROLES.SUPER_ADMIN);

  if (isLoading) {
    return <EmptyState title={t('vouchers:loading')} dashed />;
  }

  if (advances.length === 0) {
    return (
      <EmptyState
        title={t('vouchers:empty')}
        description={t('vouchers:empty_hint')}
        dashed
      />
    );
  }

  return (
    <div className="space-y-3">
      {infoMessage ? <AlertBanner message={infoMessage} tone="info" /> : null}

      <div className="space-y-3 md:hidden">
        {advances.map((advance) => (
          <article
            key={advance.id}
            className="rounded-2xl border border-slate-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-outfit text-sm font-semibold text-slate-heading">
                  {advance.mesaUserName}
                </p>
                <p className="mt-1 text-xs text-slate-body">{formatDateTime(advance.date)}</p>
              </div>
              <AdvanceStatusBadge
                status={advance.status}
                title={
                  advance.status === 'CANCELLED'
                    ? t('vouchers:cancellation_tooltip', {
                        by: advance.cancelledByName || '—',
                        reason: advance.cancellationReason || '—',
                      })
                    : undefined
                }
                onClick={
                  advance.status === 'CANCELLED'
                    ? () => onInspectCancelled?.(advance)
                    : undefined
                }
              />
            </div>
            {advance.reason ? (
              <p className="mt-2 text-sm text-slate-body">{advance.reason}</p>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-border pt-3">
              <p className="font-outfit text-lg font-bold text-slate-heading">
                {formatMoney(advance.amount)}
              </p>
              {showActions ? (
                <CancelAdvanceButton
                  advance={advance}
                  isAdminWithoutSuperAdmin={isAdminWithoutSuperAdmin}
                  onCancel={onCancel}
                  onLocked={() =>
                    setInfoMessage(t('vouchers:previous_day_cancel_locked'))
                  }
                />
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-border md:block">
      <div className={TABLE_SCROLL_CLASS}>
      <table className="min-w-full divide-y divide-slate-border">
        <thead className="bg-slate-50">
          <tr>
            <th className={TABLE_HEAD_CELL_CLASS}>{t('common:date')}</th>
            <th className={TABLE_HEAD_CELL_CLASS}>{t('common:manicurist')}</th>
            <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('vouchers:amount')}</th>
            <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('vouchers:reason')}</th>
            <th className={TABLE_HEAD_CELL_CLASS}>{t('common:status')}</th>
            <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('common:created_by')}</th>
            {showActions ? (
              <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('common:actions')}</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-border bg-white">
          {advances.map((advance) => (
            <tr key={advance.id} className="hover:bg-slate-50/70">
              <td className={`${TABLE_CELL_CLASS} text-slate-body`}>
                {formatDateTime(advance.date)}
              </td>
              <td className={`${TABLE_CELL_CLASS} font-semibold text-slate-heading`}>
                {advance.mesaUserName}
              </td>
              <td className={`${TABLE_CELL_CLASS} text-right font-semibold text-slate-heading`}>
                {formatMoney(advance.amount)}
              </td>
              <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                {advance.reason || '—'}
              </td>
              <td className={TABLE_CELL_CLASS}>
                <AdvanceStatusBadge
                  status={advance.status}
                  title={
                    advance.status === 'CANCELLED'
                      ? t('vouchers:cancellation_tooltip', {
                          by: advance.cancelledByName || '—',
                          reason: advance.cancellationReason || '—',
                        })
                      : undefined
                  }
                  onClick={
                    advance.status === 'CANCELLED'
                      ? () => onInspectCancelled?.(advance)
                      : undefined
                  }
                />
              </td>
              <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                {advance.createdByName}
              </td>
              {showActions ? (
                <td className={`${TABLE_CELL_CLASS} text-right`}>
                  <CancelAdvanceButton
                    advance={advance}
                    isAdminWithoutSuperAdmin={isAdminWithoutSuperAdmin}
                    onCancel={onCancel}
                    onLocked={() =>
                      setInfoMessage(t('vouchers:previous_day_cancel_locked'))
                    }
                  />
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

function CancelAdvanceButton({
  advance,
  isAdminWithoutSuperAdmin,
  onCancel,
  onLocked,
}: {
  advance: Advance;
  isAdminWithoutSuperAdmin: boolean;
  onCancel?: (advance: Advance) => void;
  onLocked: () => void;
}) {
  const { t } = useTranslation();
  const isPending = advance.status === 'PENDING';
  const isLockedPreviousDay =
    isPending && isAdminWithoutSuperAdmin && !isToday(advance.createdAt);
  const previousDayHint = t('vouchers:previous_day_cancel_locked');

  if (isLockedPreviousDay) {
    return (
      <button
        type="button"
        title={previousDayHint}
        aria-label={previousDayHint}
        onClick={onLocked}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-border px-3 py-2 text-xs font-semibold text-slate-muted"
      >
        <Lock className="h-3.5 w-3.5" strokeWidth={2} />
        {t('vouchers:cancel_voucher')}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!isPending}
      onClick={() => onCancel?.(advance)}
      className="min-h-[44px] rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-border disabled:text-slate-muted disabled:hover:bg-transparent"
    >
      {t('vouchers:cancel_voucher')}
    </button>
  );
}
