import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '../../../lib/get-api-error';
import { formatDateTime } from '../../../lib/format-register';
import {
  TABLE_CELL_CLASS,
  TABLE_CELL_SECONDARY_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_HEAD_SECONDARY_CLASS,
  TABLE_SCROLL_CLASS,
} from '../../../lib/table-layout';
import { getMaterialById } from '../../../services/inventory.service';
import type { InventoryMovement, Material } from '../../../types/inventory.types';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { Modal } from '../../ui/overlay/Modal';

interface KardexModalProps {
  isOpen: boolean;
  material: Material | null;
  refreshKey?: number;
  onClose: () => void;
}

const TYPE_STYLES: Record<InventoryMovement['type'], string> = {
  IN: 'bg-emerald-50 text-emerald-700',
  OUT: 'bg-red-50 text-red-700',
  ADJUSTMENT: 'bg-slate-100 text-slate-600',
};

export function KardexModal({
  isOpen,
  material,
  refreshKey = 0,
  onClose,
}: KardexModalProps) {
  const { t } = useTranslation();
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !material) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage('');

    void getMaterialById(material.id)
      .then((detail) => {
        if (isMounted) {
          setMovements(detail.movements);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMovements([]);
          setErrorMessage(
            getApiErrorMessage(error, 'errors:kardex_load'),
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, material, refreshKey]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('inventory:kardex')}
      subtitle={material ? `${material.code} · ${material.name}` : undefined}
      maxWidth="xl"
    >
      {errorMessage ? (
        <p className="mb-4 text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}

      {isLoading ? (
        <EmptyState title={t('inventory:loading_movements')} dashed />
      ) : movements.length === 0 ? (
        <EmptyState
          title={t('inventory:empty_movements')}
          description={t('inventory:empty_movements_hint')}
          dashed
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {movements.map((movement) => (
              <article
                key={movement.id}
                className="rounded-2xl border border-slate-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-slate-body">
                    {formatDateTime(movement.createdAt)}
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLES[movement.type]}`}
                  >
                    {t(`status:${movement.type === 'IN' ? 'in' : movement.type === 'OUT' ? 'out' : 'adjustment'}`)}
                  </span>
                </div>
                <p className="mt-2 font-outfit text-lg font-bold text-slate-heading">
                  {movement.quantity}
                </p>
                <p className="mt-1 text-sm text-slate-body">
                  {t('inventory:new_stock_col')}: {movement.newStock}
                </p>
                {movement.reason ? (
                  <p className="mt-1 text-sm text-slate-body">{movement.reason}</p>
                ) : null}
              </article>
            ))}
          </div>
          <div className={`hidden md:block ${TABLE_SCROLL_CLASS}`}>
          <table className="min-w-full divide-y divide-slate-border">
            <thead className="bg-slate-50">
              <tr>
                <th className={TABLE_HEAD_CELL_CLASS}>{t('common:date')}</th>
                <th className={TABLE_HEAD_CELL_CLASS}>{t('inventory:type')}</th>
                <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>{t('inventory:quantity')}</th>
                <th className={`${TABLE_HEAD_SECONDARY_CLASS} text-right`}>
                  {t('inventory:previous_stock')}
                </th>
                <th className={`${TABLE_HEAD_CELL_CLASS} text-right`}>
                  {t('inventory:new_stock_col')}
                </th>
                <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('inventory:reason')}</th>
                <th className={TABLE_HEAD_SECONDARY_CLASS}>{t('inventory:user')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border bg-white">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className={`${TABLE_CELL_CLASS} whitespace-nowrap text-slate-body`}>
                    {formatDateTime(movement.createdAt)}
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLES[movement.type]}`}
                    >
                      {t(`status:${movement.type === 'IN' ? 'in' : movement.type === 'OUT' ? 'out' : 'adjustment'}`)}
                    </span>
                  </td>
                  <td className={`${TABLE_CELL_CLASS} text-right font-semibold text-slate-heading`}>
                    {movement.quantity}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-right text-slate-body`}>
                    {movement.previousStock}
                  </td>
                  <td className={`${TABLE_CELL_CLASS} text-right font-semibold text-slate-heading`}>
                    {movement.newStock}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                    {movement.reason}
                  </td>
                  <td className={`${TABLE_CELL_SECONDARY_CLASS} text-slate-body`}>
                    {movement.createdByName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </Modal>
  );
}
