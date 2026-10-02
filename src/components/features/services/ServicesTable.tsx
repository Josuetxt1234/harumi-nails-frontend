import { formatMoney } from '../../../lib/money';
import type { SalonService } from '../../../types/service.types';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { StatusBadge } from '../../ui/feedback/StatusBadge';
import { ServiceRowActions } from './ServiceRowActions';
import { useTranslation } from 'react-i18next';

interface ServicesTableProps {
  services: SalonService[];
  onEdit: (service: SalonService) => void;
  onToggleStatus: (service: SalonService) => void;
  onDelete: (service: SalonService) => void;
}

export function ServicesTable({
  services,
  onEdit,
  onToggleStatus,
  onDelete,
}: ServicesTableProps) {
  const { t } = useTranslation();

  if (services.length === 0) {
    return (
      <EmptyState
        title={t('services:empty')}
        description={t('services:empty_hint')}
        dashed
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl border border-slate-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-outfit text-sm font-semibold text-slate-heading">
                  {service.name}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {service.category}
                </span>
              </div>
              <ServiceRowActions
                service={service}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-outfit text-lg font-bold text-slate-heading">
                  {formatMoney(service.price)}
                </p>
                <p className="text-xs text-slate-body">
                  {t('services:commission_col')}: {service.commissionPercentage.toFixed(2)}%
                </p>
              </div>
              <StatusBadge isActive={service.isActive} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-border bg-white shadow-sm md:block">
      <div className="overflow-x-auto -mx-4 sm:mx-0 shadow-[inset_-12px_0_16px_-16px_rgba(15,23,42,0.22)]">
        <table className="min-w-full divide-y divide-slate-border">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('inventory:name')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('services:category')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('services:price')}
              </th>
              <th className="hidden px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-xs">
                {t('services:commission_col')}
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('common:status')}
              </th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-body sm:px-6 sm:py-4 sm:text-xs">
                {t('common:actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border">
            {services.map((service) => (
              <tr key={service.id} className="transition hover:bg-slate-50/70">
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <p className="font-outfit text-xs font-semibold text-slate-heading sm:text-sm">
                    {service.name}
                  </p>
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {service.category}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs font-medium text-slate-heading sm:px-6 sm:py-4 sm:text-sm">
                  {formatMoney(service.price)}
                </td>
                <td className="hidden px-2 py-2 text-xs text-slate-body md:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  {service.commissionPercentage.toFixed(2)}%
                </td>
                <td className="px-2 py-2 sm:px-6 sm:py-4">
                  <StatusBadge isActive={service.isActive} />
                </td>
                <td className="px-2 py-2 text-right sm:px-6 sm:py-4">
                  <ServiceRowActions
                    service={service}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
