import { useState } from 'react';
import { useAdvances } from '../../hooks/useAdvances';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../lib/money';
import { AdvanceStatusBadge } from '../../components/features/advances/AdvanceStatusBadge';
import { CancelledVoucherAuditModal } from '../../components/features/advances/CancelledVoucherAuditModal';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { EmptyState } from '../../components/ui/feedback/EmptyState';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { formatDateTime } from '../../lib/format-register';
import type { Advance } from '../../types/advance.types';

export function MesaAdvancesPage() {
  const { t } = useTranslation('vouchers');
  const {
    advances,
    isLoading,
    errorMessage,
    pendingTotal,
  } = useAdvances({ scope: 'mine' });
  const [advanceToInspect, setAdvanceToInspect] = useState<Advance | null>(
    null,
  );

  return (
    <ModulePage
      title={t('my_vouchers')}
      subtitle={t('my_subtitle')}
    >
      <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
        <article className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">
            {t('pending_total')}
          </p>
          <p className="mt-1 font-outfit text-3xl font-bold text-amber-800">
            {formatMoney(pendingTotal)}
          </p>
        </article>

        {errorMessage ? <AlertBanner message={errorMessage} /> : null}

        <section className="flex-1 overflow-y-auto rounded-[28px] border border-slate-border bg-white p-6 lg:min-h-0">
          {isLoading ? (
            <EmptyState title={t('loading')} dashed />
          ) : advances.length === 0 ? (
            <EmptyState
              title={t('mine_empty')}
              description={t('mine_empty_hint')}
              dashed
            />
          ) : (
            <ul className="space-y-3">
              {advances.map((advance) => (
                <li
                  key={advance.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-heading">
                      {advance.reason || t('cash_advance')}
                    </p>
                    <p className="text-sm text-slate-body">
                      {formatDateTime(advance.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdvanceStatusBadge
                      status={advance.status}
                      title={
                        advance.status === 'CANCELLED'
                          ? t('cancellation_tooltip', {
                              by: advance.cancelledByName || '—',
                              reason: advance.cancellationReason || '—',
                            })
                          : undefined
                      }
                      onClick={
                        advance.status === 'CANCELLED'
                          ? () => setAdvanceToInspect(advance)
                          : undefined
                      }
                    />
                    <p className="font-outfit text-lg font-bold text-slate-heading">
                      {formatMoney(advance.amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <CancelledVoucherAuditModal
        isOpen={Boolean(advanceToInspect)}
        advance={advanceToInspect}
        onClose={() => setAdvanceToInspect(null)}
      />
    </ModulePage>
  );
}
