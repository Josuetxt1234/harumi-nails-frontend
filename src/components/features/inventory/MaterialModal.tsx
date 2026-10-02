import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  parseDecimalInput,
  sanitizeDecimalInput,
} from '../../../lib/parse-decimal-input';
import type {
  CreateMaterialInput,
  InventoryCategory,
  Material,
  MaterialUnit,
  UpdateMaterialInput,
} from '../../../types/inventory.types';
import { Modal } from '../../ui/overlay/Modal';

interface MaterialModalProps {
  isOpen: boolean;
  material: Material | null;
  categories: InventoryCategory[];
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (input: CreateMaterialInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateMaterialInput) => Promise<void>;
  onCreateCategory: (name: string) => Promise<InventoryCategory>;
}

const UNIT_OPTIONS: MaterialUnit[] = [
  'UNIT',
  'ML',
  'GRAMS',
  'PAIR',
  'BOX',
  'BOTTLE',
];

export function MaterialModal({
  isOpen,
  material,
  categories,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
  onCreateCategory,
}: MaterialModalProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(material);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [unit, setUnit] = useState<MaterialUnit>('UNIT');
  const [minimumStock, setMinimumStock] = useState('0');
  const [costPrice, setCostPrice] = useState('0');
  const [initialStock, setInitialStock] = useState('0');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (material) {
      setCode(material.code);
      setName(material.name);
      setCategoryId(material.categoryId);
      setUnit(material.unit);
      setMinimumStock(String(material.minimumStock));
      setCostPrice(String(material.costPrice));
      setInitialStock('0');
      setStatus(material.status);
    } else {
      setCode('');
      setName('');
      setCategoryId(categories[0]?.id ?? '');
      setUnit('UNIT');
      setMinimumStock('0');
      setCostPrice('0');
      setInitialStock('0');
      setStatus('ACTIVE');
    }

    setNewCategoryName('');
    setLocalError('');
  }, [categories, isOpen, material]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsedMin = parseDecimalInput(minimumStock);
    const parsedCost = parseDecimalInput(costPrice);
    const parsedInitial = parseDecimalInput(initialStock);

    if (!code.trim() || !name.trim()) {
      setLocalError(t('inventory:code_name_required'));
      return;
    }

    if (!categoryId) {
      setLocalError(t('inventory:category_required'));
      return;
    }

    if (parsedMin === null || parsedMin < 0 || parsedCost === null || parsedCost < 0) {
      setLocalError(t('inventory:numbers_invalid'));
      return;
    }

    setLocalError('');

    try {
      if (isEdit && material) {
        await onUpdate(material.id, {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          categoryId,
          unit,
          minimumStock: parsedMin,
          costPrice: parsedCost,
          status,
        });
      } else {
        await onCreate({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          categoryId,
          unit,
          minimumStock: parsedMin,
          costPrice: parsedCost,
          initialStock: parsedInitial && parsedInitial > 0 ? parsedInitial : undefined,
        });
      }
      onClose();
    } catch {
      // El hook muestra el error de API.
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setLocalError(t('inventory:category_name_required'));
      return;
    }

    try {
      const created = await onCreateCategory(trimmed);
      setCategoryId(created.id);
      setNewCategoryName('');
      setLocalError('');
    } catch {
      setLocalError(t('inventory:category_create_failed'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t('inventory:edit_material') : t('inventory:new_material')}
      subtitle={t('inventory:modal_subtitle')}
      maxWidth="lg"
    >
      <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('inventory:code')}
            </span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder={t('inventory:placeholder_code')}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('inventory:name')}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder={t('inventory:placeholder_name')}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('inventory:category')}
          </span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="">{t('inventory:select_category')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder={t('inventory:new_category')}
          />
          <button
            type="button"
            onClick={() => void handleAddCategory()}
            className="rounded-xl border border-slate-border px-4 py-3 text-sm font-semibold text-slate-heading hover:bg-slate-50"
          >
            {t('common:create')}
          </button>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('inventory:unit_measure')}
          </span>
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as MaterialUnit)}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {UNIT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`inventory:unit_${value}`)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('inventory:minimum_stock')}
            </span>
            <input
              value={minimumStock}
              onChange={(event) =>
                setMinimumStock(sanitizeDecimalInput(event.target.value))
              }
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('inventory:cost_price')}
            </span>
            <input
              value={costPrice}
              onChange={(event) =>
                setCostPrice(sanitizeDecimalInput(event.target.value))
              }
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>

        {isEdit ? (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('common:status')}
            </span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as 'ACTIVE' | 'INACTIVE')
              }
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="ACTIVE">{t('common:active')}</option>
              <option value="INACTIVE">{t('common:inactive')}</option>
            </select>
          </label>
        ) : (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-heading">
              {t('inventory:initial_stock')}
            </span>
            <input
              value={initialStock}
              onChange={(event) =>
                setInitialStock(sanitizeDecimalInput(event.target.value))
              }
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder={t('common:optional')}
            />
          </label>
        )}

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
            {isSubmitting
              ? t('common:saving')
              : isEdit
                ? t('common:save')
                : t('inventory:new_material')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
