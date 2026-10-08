import { getRoleLabel } from '../../../constants/roles.constants';
import type { RoleOption } from '../../../types/user.types';

interface RoleSelectorProps {
  roles: RoleOption[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string) => void;
}

export function RoleSelector({
  roles,
  selectedRoleId,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {roles.map((role) => {
        const isSelected = role.id === selectedRoleId;

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelectRole(role.id)}
            className={[
              'rounded-2xl border px-5 py-4 text-left transition',
              isSelected
                ? 'border-brand bg-brand/10 shadow-sm'
                : 'border-slate-border bg-white hover:border-brand/40 hover:bg-slate-50',
            ].join(' ')}
          >
            <p
              className={[
                'font-outfit text-sm font-semibold',
                isSelected ? 'text-brand' : 'text-slate-heading',
              ].join(' ')}
            >
              {getRoleLabel(role.name)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
