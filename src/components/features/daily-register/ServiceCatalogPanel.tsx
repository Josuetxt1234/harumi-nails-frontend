import { Plus, Search } from 'lucide-react';
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
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-4 shrink-0">
        <h2 className="font-outfit text-xl font-bold text-slate-heading">
          Catálogo de servicios
        </h2>
        <p className="mt-1 text-sm text-slate-body">
          Toca un servicio para agregarlo al registro.
        </p>
      </div>

      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar servicio..."
            className="w-full rounded-xl border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="mb-4 flex shrink-0 gap-2 overflow-x-auto pb-1">
        <CategoryChip
          label="Todos"
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

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <EmptyState title="Cargando servicios..." dashed />
        ) : services.length === 0 ? (
          <EmptyState
            title="Sin servicios"
            description="No hay servicios que coincidan con tu búsqueda."
            dashed
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onAddService(service)}
                className="group flex items-start justify-between rounded-2xl border border-slate-border bg-slate-50/50 px-4 py-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                    {service.category}
                  </p>
                  <p className="mt-1 font-outfit text-sm font-semibold text-slate-heading">
                    {service.name}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-heading">
                    {formatMoney(service.price)}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition group-hover:bg-brand-dark">
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
        'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition',
        isActive
          ? 'bg-brand text-white'
          : 'border border-slate-border bg-white text-slate-body hover:border-brand/40 hover:text-brand',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
