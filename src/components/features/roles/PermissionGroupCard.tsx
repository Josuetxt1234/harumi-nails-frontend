import { getPermissionLabel } from '../../../lib/format-permission';
import type { PermissionGroup } from '../../../lib/group-permissions';
import type { PermissionSummary } from '../../../types/permission.types';
import { useTranslation } from 'react-i18next';

interface PermissionGroupCardProps {
  group: PermissionGroup;
  assignedPermissionIds: Set<string>;
  canEdit: boolean;
  togglingPermissionId: string | null;
  onToggle: (permissionId: string, shouldAssign: boolean) => void;
}

export function PermissionGroupCard({
  group,
  assignedPermissionIds,
  canEdit,
  togglingPermissionId,
  onToggle,
}: PermissionGroupCardProps) {
  const { t } = useTranslation('roles');
  const assignedCount = group.permissions.filter((permission) =>
    assignedPermissionIds.has(permission.id),
  ).length;

  return (
    <section className="rounded-2xl border border-slate-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-outfit text-base font-semibold text-slate-heading">
            {t(`group_${group.key}`, { defaultValue: group.key })}
          </h3>
          <p className="text-xs text-slate-body">
            {t('enabled_count', {
              assigned: assignedCount,
              total: group.permissions.length,
            })}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {group.permissions.map((permission) => (
          <PermissionToggleRow
            key={permission.id}
            permission={permission}
            isAssigned={assignedPermissionIds.has(permission.id)}
            isDisabled={
              !canEdit || togglingPermissionId === permission.id
            }
            isLoading={togglingPermissionId === permission.id}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

interface PermissionToggleRowProps {
  permission: PermissionSummary;
  isAssigned: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  onToggle: (permissionId: string, shouldAssign: boolean) => void;
}

function PermissionToggleRow({
  permission,
  isAssigned,
  isDisabled,
  isLoading,
  onToggle,
}: PermissionToggleRowProps) {
  const { t } = useTranslation('roles');
  const actionLabel = getPermissionLabel(
    t,
    permission.name,
    permission.description,
  );

  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition',
        isAssigned
          ? 'border-brand/20 bg-brand/5'
          : 'border-slate-border bg-slate-50/40',
        isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:border-brand/30',
      ].join(' ')}
    >
      <input
        type="checkbox"
        checked={isAssigned}
        disabled={isDisabled}
        onChange={(event) =>
          onToggle(permission.id, event.target.checked)
        }
        className="h-4 w-4 rounded border-slate-border text-brand focus:ring-brand/30"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-heading">
            {actionLabel}
          </span>
          {isLoading ? (
            <span className="text-xs text-brand">{t('saving')}</span>
          ) : null}
        </span>
      </span>
    </label>
  );
}
