import { Ban, MoreHorizontal, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import type { SalonService } from '../../../types/service.types';
import { useTranslation } from 'react-i18next';

interface ServiceRowActionsProps {
  service: SalonService;
  onEdit: (service: SalonService) => void;
  onToggleStatus: (service: SalonService) => void;
  onDelete: (service: SalonService) => void;
}

export function ServiceRowActions({
  service,
  onEdit,
  onToggleStatus,
  onDelete,
}: ServiceRowActionsProps) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canEdit = hasPermission(PERMISSIONS.SERVICES_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.SERVICES_DELETE);
  const hasAnyAction = useMemo(
    () => canEdit || canDelete,
    [canEdit, canDelete],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  if (!hasAnyAction) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-border text-slate-body transition hover:border-brand hover:text-brand"
        aria-label={t('services:actions_aria')}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-border bg-white py-1 shadow-lg">
          {canEdit ? (
            <button
              type="button"
              onClick={() => runAction(() => onEdit(service))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-heading transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              {t('common:edit')}
            </button>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              onClick={() => runAction(() => onToggleStatus(service))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-heading transition hover:bg-slate-50"
            >
              {service.isActive ? (
                <>
                  <Ban className="h-4 w-4 text-orange-500" />
                  {t('services:deactivate')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {t('services:activate')}
                </>
              )}
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => runAction(() => onDelete(service))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              {t('common:delete')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
