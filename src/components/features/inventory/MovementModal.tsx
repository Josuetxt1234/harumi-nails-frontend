import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '../../../lib/get-api-error';
import {
  parseDecimalInput,
  sanitizeDecimalInput,
} from '../../../lib/parse-decimal-input';
import type {
  CreateMovementInput,
  InventoryMovementType,
  Material,
} from '../../../types/inventory.types';
import { Modal } from '../../ui/overlay/Modal';

interface MovementModalProps {
  isOpen: boolean;
  material: Material | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateMovementInput) => Promise<void>;
}

export function MovementModal({
  isOpen,
  material,
  isSubmitting,
  onClose,
  onSubmit,
}: MovementModalProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<InventoryMovementType>('IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setType('IN');
    setQuantity('');
    setReason('');
    setLocalError('');
  }, [isOpen, material?.id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!material) {
      return;
    }

    const parsedQuantity = parseDecimalInput(quantity);
    if (parsedQuantity === null || parsedQuantity <= 0) {
      setLocalError(t('inventory:quantity_invalid'));
      return;
    }

    if (!reason.trim()) {
      setLocalError(t('inventory:reason_required'));
      return;
    }

    setLocalError('');

    try {
      await onSubmit({
        materialId: material.id,
        type,
        quantity: parsedQuantity,
        reason: reason.trim(),
      });
      onClose();
    } catch (error) {
      setLocalError(
        getApiErrorMessage(error, 'errors:inventory_move'),
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('inventory:register_movement')}
      subtitle={
        material
          ? `${material.code} · ${material.name} · stock ${material.currentStock}`
          : undefined
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('inventory:type')}
          </span>
          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as InventoryMovementType)
            }
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="IN">{t('status:in')}</option>
            <option value="OUT">{t('status:out')}</option>
            <option value="ADJUSTMENT">{t('status:adjustment')}</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {type === 'ADJUSTMENT' ? t('inventory:new_stock') : t('inventory:quantity')}
          </span>
          <input
            value={quantity}
            onChange={(event) =>
              setQuantity(sanitizeDecimalInput(event.target.value))
            }
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="0.00"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('inventory:reason')}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder={t('inventory:reason')}
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
            disabled={isSubmitting || !material}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting ? t('inventory:registering') : t('inventory:register_movement')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
