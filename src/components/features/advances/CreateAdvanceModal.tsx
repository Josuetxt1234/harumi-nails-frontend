import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MesaUserOption } from '../../../types/daily-register.types';
import { MesaSelector } from '../daily-register/MesaSelector';
import { Modal } from '../../ui/overlay/Modal';

interface CreateAdvanceModalProps {
  isOpen: boolean;
  mesaUsers: MesaUserOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: {
    mesaUserId: string;
    amount: number;
    reason?: string;
  }) => Promise<void>;
}

export function CreateAdvanceModal({
  isOpen,
  mesaUsers,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateAdvanceModalProps) {
  const { t } = useTranslation();
  const [mesaUserId, setMesaUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);

    if (!mesaUserId) {
      setLocalError(t('vouchers:select_station'));
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0.01) {
      setLocalError(t('vouchers:amount_invalid'));
      return;
    }

    setLocalError('');

    try {
      await onSubmit({
        mesaUserId,
        amount: parsedAmount,
        reason: reason.trim() || undefined,
      });
      setMesaUserId('');
      setAmount('');
      setReason('');
    } catch {
      // El hook muestra el error de API.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('vouchers:create')}
      subtitle={t('vouchers:create_subtitle')}
    >
      <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
        <MesaSelector
          mesaUsers={mesaUsers}
          selectedMesaUserId={mesaUserId}
          onChange={setMesaUserId}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('vouchers:amount')} ($)
          </span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="0.00"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('vouchers:reason')}
          </span>
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder={t('common:optional')}
          />
        </label>

        {localError ? (
          <p className="text-sm font-medium text-red-600">{localError}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
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
            className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting ? t('vouchers:issuing') : t('vouchers:create_submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
