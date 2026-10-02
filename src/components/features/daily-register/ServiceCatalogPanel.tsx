import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SalonService } from '../../../types/daily-register.types';
import { formatMoney } from '../../../lib/money';
import { EmptyState } from '../../ui/feedback/EmptyState';

interface ServiceCatalogPanelProps {
  services: SalonService[];
  categories: string[];
  search: string;
  category: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddService: (service: SalonService) => void;
}

export function ServiceCatalogPanel({
  services,
  categories,
  search,
  category,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onAddService,
}: ServiceCatalogPanelProps) {
  const { t } = useTranslation();
  return (
    <section className="flex min-h-0 w-full flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 shrink-0">
        <h2 className="font-outfit text-lg font-bold text-slate-heading sm:text-xl">
          {t('services:catalog')}
        </h2>
        <p className="mt-1 text-sm text-slate-body">
          {t('services:catalog_hint')}
        </p>
      </div>

      <div className="mb-3 flex w-full shrink-0 flex-col gap-3">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('services:search_service')}
            className="w-full rounded-xl border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="mb-4 flex w-full shrink-0 flex-wrap gap-2 overflow-x-auto py-1 sm:flex-nowrap sm:whitespace-nowrap">
        <CategoryChip
          label={t('common:all')}
          isActive={category === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {categories.map((item) => (
          <CategoryChip
            key={item}
            label={item}
            isActive={category === item}
            onClick={() => onCategoryChange(item)}
          />
        ))}
      </div>

      <div className="min-h-0 flex-1 lg:overflow-y-auto lg:scrollbar-hide">
        {isLoading ? (
          <EmptyState title={t('services:loading')} dashed />
        ) : services.length === 0 ? (
          <EmptyState
            title={t('services:empty')}
            description={t('services:empty_filter')}
            dashed
          />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onAddService(service)}
                className="group flex min-w-0 items-start justify-between rounded-2xl border border-slate-border bg-slate-50/50 px-3 py-3 text-left transition hover:border-brand/40 hover:bg-brand/5 sm:px-4 sm:py-4"
              >
                <div className="min-w-0 flex-1 pr-2 sm:pr-3">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[11px]">
                    {service.category}
                  </p>
                  <p className="mt-1 truncate font-outfit text-xs font-semibold text-slate-heading sm:text-sm">
                    {service.name}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-slate-heading sm:mt-2 sm:text-base">
                    {formatMoney(service.price)}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition group-hover:bg-brand-dark">
                  <Plus className="h-4 w-4" strokeWidth={2.25} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-h-[44px] max-w-full shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition',
        isActive
          ? 'bg-brand text-white'
          : 'border border-slate-border bg-white text-slate-body hover:border-brand/40 hover:text-brand',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
