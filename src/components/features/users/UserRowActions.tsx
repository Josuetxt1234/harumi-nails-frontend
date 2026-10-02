import {
  Ban,
  KeyRound,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import type { ManagedUser } from '../../../types/user.types';
import { useTranslation } from 'react-i18next';

interface UserRowActionsProps {
  user: ManagedUser;
  showDelete?: boolean;
  onEdit: (user: ManagedUser) => void;
  onChangePassword: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

export function UserRowActions({
  user,
  showDelete = true,
  onEdit,
  onChangePassword,
  onToggleStatus,
  onDelete,
}: UserRowActionsProps) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canEdit = hasPermission(PERMISSIONS.USERS_UPDATE);
  const canChangePassword = hasPermission(PERMISSIONS.USERS_FORCE_PASSWORD_RESET);
  const canActivate = hasPermission(PERMISSIONS.USERS_ACTIVATE);
  const canDeactivate = hasPermission(PERMISSIONS.USERS_DEACTIVATE);
  const canToggleStatus =
    user.isActive ? canDeactivate : canActivate;
  const canDelete = showDelete && hasPermission(PERMISSIONS.USERS_DELETE);

  const hasAnyAction = useMemo(
    () => canEdit || canChangePassword || canToggleStatus || canDelete,
    [canEdit, canChangePassword, canToggleStatus, canDelete],
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
        aria-label={t('users:actions_aria')}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-border bg-white py-1 shadow-lg">
          {canEdit ? (
            <button
              type="button"
              onClick={() => runAction(() => onEdit(user))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-heading transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              {t('common:edit')}
            </button>
          ) : null}
          {canChangePassword ? (
            <button
              type="button"
              onClick={() => runAction(() => onChangePassword(user))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-heading transition hover:bg-slate-50"
            >
              <KeyRound className="h-4 w-4" />
              {t('users:change_password')}
            </button>
          ) : null}
          {canToggleStatus ? (
            <button
              type="button"
              onClick={() => runAction(() => onToggleStatus(user))}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-heading transition hover:bg-slate-50"
            >
              {user.isActive ? (
                <>
                  <Ban className="h-4 w-4 text-orange-500" />
                  {t('users:suspend')}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  {t('users:activate')}
                </>
              )}
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => runAction(() => onDelete(user))}
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
