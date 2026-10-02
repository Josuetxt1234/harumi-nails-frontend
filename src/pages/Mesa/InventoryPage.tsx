import { useInventory } from '../../hooks/useInventory';
import { useTranslation } from 'react-i18next';
import { LowStockAlertBanner } from '../../components/features/inventory/LowStockAlertBanner';
import { MaterialsTable } from '../../components/features/inventory/MaterialsTable';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';

export function MesaInventoryPage() {
  const inventory = useInventory();
  const { t } = useTranslation('inventory');
  const { t: tCommon } = useTranslation('common');

  return (
    <ModulePage
      title={t('title')}
      subtitle={t('mesa_subtitle')}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto lg:min-h-0">
        <LowStockAlertBanner
          count={inventory.lowStockCount}
          isActive={inventory.lowStockOnly}
          onClick={() => inventory.setLowStockOnly(!inventory.lowStockOnly)}
        />

        {inventory.errorMessage ? (
          <AlertBanner message={inventory.errorMessage} />
        ) : null}

        <section className="flex flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 lg:min-h-0">
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-body">
                {tCommon('search')}
              </span>
              <input
                value={inventory.search}
                onChange={(event) => inventory.setSearch(event.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-body">
                {t('category')}
              </span>
              <select
                value={inventory.categoryId}
                onChange={(event) => inventory.setCategoryId(event.target.value)}
                className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">{t('all_categories')}</option>
                {inventory.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <MaterialsTable
              materials={inventory.materials}
              isLoading={inventory.isLoading}
              showActions={false}
            />
          </div>
        </section>
      </div>
    </ModulePage>
  );
}
