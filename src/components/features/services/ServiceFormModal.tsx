import { FormEvent, useEffect, useMemo, useState } from 'react';
import { SERVICE_CATEGORY_SUGGESTIONS } from '../../../constants/service-categories.constants';
import { formatMoney, toMoney } from '../../../lib/money';
import {
  parseDecimalInput,
  sanitizeDecimalInput,
} from '../../../lib/parse-decimal-input';
import type {
  CreateServiceInput,
  SalonService,
  ServiceFormMode,
  UpdateServiceInput,
} from '../../../types/service.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { ToggleSwitch } from '../../ui/form/ToggleSwitch';
import { Modal } from '../../ui/overlay/Modal';
import { useTranslation } from 'react-i18next';

interface ServiceFormModalProps {
  isOpen: boolean;
  mode: ServiceFormMode;
  service?: SalonService | null;
  categorySuggestions?: string[];
  onClose: () => void;
  onCreate: (input: CreateServiceInput) => Promise<void>;
  onUpdate: (
    serviceId: string,
    input: UpdateServiceInput,
  ) => Promise<SalonService | void>;
}

export function ServiceFormModal({
  isOpen,
  mode,
  service,
  categorySuggestions = [],
  onClose,
  onCreate,
  onUpdate,
}: ServiceFormModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    commissionPercentage: '50',
    isActive: true,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestions = useMemo(() => {
    const merged = [...SERVICE_CATEGORY_SUGGESTIONS, ...categorySuggestions];
    return [...new Set(merged.map((item) => item.trim()).filter(Boolean))].sort(
      (left, right) => left.localeCompare(right, 'es'),
    );
  }, [categorySuggestions]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'edit' && service) {
      setForm({
        name: service.name,
        category: service.category,
        price: service.price.toFixed(2),
        commissionPercentage: service.commissionPercentage.toFixed(2),
        isActive: service.isActive,
      });
    } else {
      setForm({
        name: '',
        category: '',
        price: '',
        commissionPercentage: '50',
        isActive: true,
      });
    }

    setErrorMessage('');
  }, [isOpen, mode, service]);

  const parsedPrice = parseDecimalInput(form.price);
  const parsedCommission = parseDecimalInput(form.commissionPercentage);
  const previewCommission =
    parsedPrice !== null && parsedCommission !== null
      ? toMoney((parsedPrice * parsedCommission) / 100)
      : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const name = form.name.trim();
      const category = form.category.trim();
      const price = parseDecimalInput(form.price);
      const commissionPercentage = parseDecimalInput(form.commissionPercentage);

      if (!name) {
        throw new Error(t('services:name_required'));
      }

      if (!category) {
        throw new Error(t('services:category_required'));
      }

      if (price === null || price < 0) {
        throw new Error(t('services:price_invalid'));
      }

      if (
        commissionPercentage === null ||
        commissionPercentage < 0 ||
        commissionPercentage > 100
      ) {
        throw new Error(t('services:commission_range'));
      }

      if (mode === 'create') {
        await onCreate({
          name,
          category,
          price,
          commissionPercentage,
          isActive: form.isActive,
        });
      } else if (service) {
        await onUpdate(service.id, {
          name,
          category,
          price,
          commissionPercentage,
          isActive: form.isActive,
        });
      }

      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('services:save_error'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('services:new') : t('services:edit')}
      subtitle={
        mode === 'create' ? t('services:create_subtitle') : t('services:edit_subtitle')
      }
      maxWidth="lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        {errorMessage ? <AlertBanner message={errorMessage} /> : null}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-heading">
            {t('services:name')}
          </label>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder={t('services:placeholder_name')}
            autoComplete="off"
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-heading">
            {t('services:category')}
          </label>
          <input
            list="service-category-suggestions"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            placeholder={t('services:placeholder_category')}
            autoComplete="off"
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
          <datalist id="service-category-suggestions">
            {suggestions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-heading">
              {t('services:price')}
            </label>
            <input
              inputMode="decimal"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: sanitizeDecimalInput(event.target.value),
                }))
              }
              placeholder="20.00"
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-heading">
              {t('services:commission_pct')}
            </label>
            <input
              inputMode="decimal"
              value={form.commissionPercentage}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  commissionPercentage: sanitizeDecimalInput(event.target.value),
                }))
              }
              placeholder="50"
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
        </div>

        <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-slate-body">
          {previewCommission !== null &&
          parsedPrice !== null &&
          parsedCommission !== null ? (
            <>
              {t('services:preview', {
                price: formatMoney(parsedPrice),
                rate: parsedCommission,
                commission: formatMoney(previewCommission),
              })}
            </>
          ) : (
            t('services:preview_hint')
          )}
        </div>

        <ToggleSwitch
          checked={form.isActive}
          onChange={(isActive) =>
            setForm((current) => ({ ...current, isActive }))
          }
          label={t('services:active_label')}
          description={t('services:active_hint')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
          >
            {t('common:cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting
              ? t('common:saving')
              : mode === 'create'
                ? t('services:create_action')
                : t('common:save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
