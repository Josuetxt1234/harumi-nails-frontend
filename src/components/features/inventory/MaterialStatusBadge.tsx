import { useTranslation } from 'react-i18next';
import type { CatalogStatus } from '../../../types/inventory.types';

export function MaterialStatusBadge({
  status,
  isLowStock,
}: {
  status: CatalogStatus;
  isLowStock: boolean;
}) {
  const { t } = useTranslation('status');

  if (status === 'INACTIVE') {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        {t('inactive')}
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        {t('low_stock')}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {t('available')}
    </span>
  );
}
