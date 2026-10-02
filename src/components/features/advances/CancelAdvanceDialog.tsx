import { FormEvent, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/overlay/Modal';
import { formatMoney } from '../../../lib/money';

interface CancelAdvanceDialogProps {
  isOpen: boolean;
  manicuristName: string;
  amount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

const MIN_REASON_LENGTH = 10;

export function CancelAdvanceDialog({
  isOpen,
  manicuristName,
  amount,
  isSubmitting = false,
  onClose,
  onConfirm,
}: CancelAdvanceDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setLocalError('');
    }
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = reason.trim();

    if (trimmed.length < MIN_REASON_LENGTH) {
      setLocalError(t('vouchers:cancel_reason_min'));
      return;
    }

    setLocalError('');
    await onConfirm(trimmed);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('vouchers:cancel_voucher')}
      subtitle={manicuristName}
      icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <p className="text-sm text-slate-body">
          {t('vouchers:cancel_body', { amount: formatMoney(amount) })}
        </p>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('vouchers:cancel_reason')}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
            minLength={MIN_REASON_LENGTH}
            rows={4}
            placeholder={t('vouchers:cancel_reason_placeholder')}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        {localError ? (
          <p className="text-sm font-medium text-red-600">{localError}</p>
        ) : null}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading hover:bg-slate-50"
          >
            {t('common:cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-70"
          >
            {isSubmitting ? t('vouchers:cancelling') : t('vouchers:cancel_voucher')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
