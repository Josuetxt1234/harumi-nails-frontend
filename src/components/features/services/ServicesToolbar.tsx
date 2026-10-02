import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SERVICE_CATEGORY_SUGGESTIONS } from '../../../constants/service-categories.constants';

interface ServicesToolbarProps {
  categoryFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
  categoryOptions: string[];
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onCreateClick: () => void;
  showCreateButton?: boolean;
}

export function ServicesToolbar({
  categoryFilter,
  statusFilter,
  categoryOptions,
  onCategoryFilterChange,
  onStatusFilterChange,
  onCreateClick,
  showCreateButton = true,
}: ServicesToolbarProps) {
  const { t } = useTranslation('services');
  const mergedCategories = [
    ...new Set([...SERVICE_CATEGORY_SUGGESTIONS, ...categoryOptions]),
  ].sort((left, right) => left.localeCompare(right, 'es'));

  return (
    <div className="mb-6 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="font-outfit text-lg font-semibold text-slate-heading">
          {t('catalog')}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
          className="rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">{t('all_categories')}</option>
          {mergedCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(
              event.target.value as 'all' | 'active' | 'inactive',
            )
          }
          className="rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">{t('all_statuses')}</option>
          <option value="active">{t('actives')}</option>
          <option value="inactive">{t('inactives')}</option>
        </select>

        {showCreateButton ? (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {t('new')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
