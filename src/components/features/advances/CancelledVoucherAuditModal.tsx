import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../lib/format-register';
import type { Advance } from '../../../types/advance.types';
import { Modal } from '../../ui/overlay/Modal';

interface CancelledVoucherAuditModalProps {
  isOpen: boolean;
  advance: Advance | null;
  onClose: () => void;
}

export function CancelledVoucherAuditModal({
  isOpen,
  advance,
  onClose,
}: CancelledVoucherAuditModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('vouchers:cancellation_audit')}
      subtitle={advance?.mesaUserName}
    >
      {advance ? (
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-heading">
              {t('vouchers:cancelled_by')}
            </dt>
            <dd className="mt-1 text-slate-body">
              {advance.cancelledByName || t('common:empty')}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-heading">
              {t('vouchers:cancelled_at')}
            </dt>
            <dd className="mt-1 text-slate-body">
              {advance.cancelledAt
                ? formatDateTime(advance.cancelledAt)
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-heading">
              {t('vouchers:cancellation_reason')}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-body">
              {advance.cancellationReason || '—'}
            </dd>
          </div>
        </dl>
      ) : null}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading hover:bg-slate-50"
        >
          {t('common:close')}
        </button>
      </div>
    </Modal>
  );
}
