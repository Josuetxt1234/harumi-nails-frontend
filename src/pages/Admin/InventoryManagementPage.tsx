import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../hooks/useInventory';
import { KardexModal } from '../../components/features/inventory/KardexModal';
import { LowStockAlertBanner } from '../../components/features/inventory/LowStockAlertBanner';
import { MaterialModal } from '../../components/features/inventory/MaterialModal';
import { MaterialsTable } from '../../components/features/inventory/MaterialsTable';
import { MovementModal } from '../../components/features/inventory/MovementModal';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import type { Material } from '../../types/inventory.types';

export function InventoryManagementPage() {
  const { t } = useTranslation('inventory');
  const { t: tCommon } = useTranslation('common');
  const { hasPermission } = useAuth();
  const inventory = useInventory();
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);
  const [materialToMove, setMaterialToMove] = useState<Material | null>(null);
  const [materialKardex, setMaterialKardex] = useState<Material | null>(null);
  const [kardexRefreshKey, setKardexRefreshKey] = useState(0);

  const canCreate = hasPermission(PERMISSIONS.INVENTORY_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.INVENTORY_UPDATE);
  const canReadKardex = hasPermission(PERMISSIONS.INVENTORY_READ);

  return (
    <ModulePage
      title={t('title')}
      subtitle={t('subtitle')}
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
        {inventory.successMessage ? (
          <AlertBanner message={inventory.successMessage} tone="success" />
        ) : null}

        <section className="flex flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:min-h-0">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <label className="flex items-center gap-3 rounded-xl border border-slate-border px-4 py-3">
                <input
                  type="checkbox"
                  checked={inventory.lowStockOnly}
                  onChange={(event) =>
                    inventory.setLowStockOnly(event.target.checked)
                  }
                  className="h-4 w-4 accent-brand"
                />
                <span className="text-sm font-semibold text-slate-heading">
                  {t('low_stock_only')}
                </span>
              </label>
            </div>

            {canCreate ? (
              <button
                type="button"
                onClick={() => {
                  setMaterialToEdit(null);
                  setIsMaterialOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark"
              >
                <Plus className="h-4 w-4" />
                {t('new_material')}
              </button>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <MaterialsTable
              materials={inventory.materials}
              isLoading={inventory.isLoading}
              showActions={canUpdate || canReadKardex}
              onEdit={
                canUpdate
                  ? (material) => {
                      setMaterialToEdit(material);
                      setIsMaterialOpen(true);
                    }
                  : undefined
              }
              onMove={canUpdate ? setMaterialToMove : undefined}
              onKardex={canReadKardex ? setMaterialKardex : undefined}
            />
          </div>
        </section>
      </div>

      <MaterialModal
        isOpen={isMaterialOpen}
        material={materialToEdit}
        categories={inventory.categories}
        isSubmitting={inventory.isSubmitting}
        onClose={() => {
          setIsMaterialOpen(false);
          setMaterialToEdit(null);
        }}
        onCreate={inventory.create}
        onUpdate={inventory.update}
        onCreateCategory={(name) => inventory.addCategory({ name })}
      />

      <MovementModal
        isOpen={Boolean(materialToMove)}
        material={materialToMove}
        isSubmitting={inventory.isSubmitting}
        onClose={() => setMaterialToMove(null)}
        onSubmit={async (input) => {
          await inventory.move(input);
          setKardexRefreshKey((current) => current + 1);
        }}
      />

      <KardexModal
        isOpen={Boolean(materialKardex)}
        material={materialKardex}
        refreshKey={kardexRefreshKey}
        onClose={() => setMaterialKardex(null)}
      />
    </ModulePage>
  );
}
