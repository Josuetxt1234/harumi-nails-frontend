import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../lib/money';
import {
  TABLE_CELL_CLASS,
  TABLE_CELL_SECONDARY_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_HEAD_SECONDARY_CLASS,
  TABLE_SCROLL_CLASS,
} from '../../../lib/table-layout';
import type { Material } from '../../../types/inventory.types';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { MaterialStatusBadge } from './MaterialStatusBadge';

interface MaterialsTableProps {
  materials: Material[];
  isLoading?: boolean;
  showActions?: boolean;
  onEdit?: (material: Material) => void;
  onMove?: (material: Material) => void;
  onKardex?: (material: Material) => void;
}

export function MaterialsTable({
  materials,
  isLoading = false,
  showActions = false,
  onEdit,
  onMove,
  onKardex,
}: MaterialsTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <EmptyState title={t('inventory:loading')} dashed />;
  }

  if (materials.length === 0) {
    return (
      <EmptyState
        title={t('inventory:empty')}
        description={t('inventory:empty_hint')}
        dashed
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {materials.map((material) => (
          <article
            key={material.id}
            className={[
              'rounded-2xl border bg-white p-4 shadow-sm',
              material.isLowStock ? 'border-amber-200' : 'border-slate-border',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-outfit text-sm font-semibold text-slate-heading">
                  {material.name}
                </p>
                <p className="mt-1 text-xs text-slate-body">{material.categoryName}</p>
              </div>
              <MaterialStatusBadge
                status={material.status}
                isLowStock={material.isLowStock}
              />
            </div>
            <p
              className={[
                'mt-3 font-outfit text-xl font-bold',
                material.isLowStock ? 'text-amber-700' : 'text-slate-heading',
              ].join(' ')}
            >
              {material.currentStock} {t(`inventory:unit_${material.unit}`)}
            </p>
            {showActions ? (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-border pt-3">
                {onMove ? (
                  <button
                    type="button"
                    onClick={() => onMove(material)}
                    className="min-h-[44px] flex-1 rounded-lg border border-slate-border px-2.5 py-2 text-xs font-semibold text-slate-heading hover:bg-slate-50"
                  >
                    {t('inventory:movement')}
                  </button>
                ) : null}
                {onKardex ? (
                  <button
                    type="button"
                    onClick={() => onKardex(material)}
                    className="min-h-[44px] flex-1 rounded-lg border border-slate-border px-2.5 py-2 text-xs font-semibold text-slate-heading hover:bg-slate-50"
                  >
                    {t('inventory:kardex')}
                  </button>
                ) : null}
                {onEdit ? (
                  <button
                    type="button"
                    onClick={() => onEdit(material)}
                    className="min-h-[44px] flex-1 rounded-lg border border-brand/20 px-2.5 py-2 text-xs font-semibold text-brand hover:bg-brand/5"
                  >
                    {t('common:edit')}
                  </button>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-border bg-white md:block">
      <div className={TABLE_SCROLL_CLASS}>
        <table className="min-w-full divide-y divide-slate-border">
          <thead className="bg-slate-50">
            <tr>
              <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('inventory:code')}</th>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('inventory:name')}</th>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('inventory:category')}</th>
              <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('inventory:stock')}</th>
              <th className={`${TABLE_HEAD_SECONDARY_CLASS} text-right`}>
                {t('inventory:minimum_stock')}
              </th>
              <th className={`${TABLE_HEAD_SECONDARY_CLASS} text-right`}>{t('inventory:cost')}</th>
              <th className={TABLE_HEAD_CELL_CLASS}>{t('common:status')}</th>
              {showActions ? (
                <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('common:actions')}</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border bg-white">
            {materials.map((material) => (
              <tr
                key={material.id}
                className={
                  material.isLowStock ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-slate-50/70'
                }
              >
                <td className={`${TABLE_CELL_SECONDARY_CLASS} font-semibold text-slate-heading`}>
                  {material.code}
                </td>
                <td className={`${TABLE_CELL_CLASS} text-slate-heading`}>{material.name}</td>
                <td className={`${TABLE_CELL_CLASS} text-slate-body`}>{material.categoryName}</td>
                <td className={`${TABLE_CELL_CLASS} text-right font-semibold text-slate-heading`}>
                  {material.currentStock} {t(`inventory:unit_${material.unit}`)}
                </td>
                <td className={`${TABLE_CELL_SECONDARY_CLASS} text-right text-slate-body`}>
                  {material.minimumStock}
                </td>
                <td className={`${TABLE_CELL_SECONDARY_CLASS} text-right text-slate-heading`}>
                  {formatMoney(material.costPrice)}
                </td>
                <td className={TABLE_CELL_CLASS}>
                  <MaterialStatusBadge
                    status={material.status}
                    isLowStock={material.isLowStock}
                  />
                </td>
                {showActions ? (
                  <td className={`${TABLE_CELL_CLASS} text-right`}>
                    <div className="flex justify-end gap-2">
                      {onMove ? (
                        <button
                          type="button"
                          onClick={() => onMove(material)}
                          className="min-h-[44px] rounded-lg border border-slate-border px-2.5 py-2 text-xs font-semibold text-slate-heading hover:bg-slate-50"
                        >
                          {t('inventory:movement')}
                        </button>
                      ) : null}
                      {onKardex ? (
                        <button
                          type="button"
                          onClick={() => onKardex(material)}
                          className="min-h-[44px] rounded-lg border border-slate-border px-2.5 py-2 text-xs font-semibold text-slate-heading hover:bg-slate-50"
                        >
                          {t('inventory:kardex')}
                        </button>
                      ) : null}
                      {onEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(material)}
                          className="min-h-[44px] rounded-lg border border-brand/20 px-2.5 py-2 text-xs font-semibold text-brand hover:bg-brand/5"
                        >
                          {t('common:edit')}
                        </button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
