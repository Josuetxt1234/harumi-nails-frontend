import { Plus } from 'lucide-react';
import { ROLE_OPTIONS, SystemRole } from '../../../constants/roles.constants';

interface UsersToolbarProps {
  statusFilter: 'all' | 'active' | 'inactive';
  roleFilter: 'all' | SystemRole;
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onRoleFilterChange: (value: 'all' | SystemRole) => void;
  onCreateClick: () => void;
  showRoleFilter?: boolean;
  createLabel?: string;
  listTitle?: string;
  showCreateButton?: boolean;
}

export function UsersToolbar({
  statusFilter,
  roleFilter,
  onStatusFilterChange,
  onRoleFilterChange,
  onCreateClick,
  showRoleFilter = true,
  createLabel = 'Create User',
  listTitle = 'User List',
  showCreateButton = true,
}: UsersToolbarProps) {
  const roleFilterOptions = ROLE_OPTIONS.filter(
    (option) => option.value !== 'SUPER_ADMIN',
  );

  return (
    <div className="mb-6 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="font-outfit text-lg font-semibold text-slate-heading">
          {listTitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {showRoleFilter ? (
          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as 'all' | SystemRole)
            }
            className="rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="all">All roles</option>
            {roleFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}

        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(
              event.target.value as 'all' | 'active' | 'inactive',
            )
          }
          className="rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        {showCreateButton ? (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {createLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
