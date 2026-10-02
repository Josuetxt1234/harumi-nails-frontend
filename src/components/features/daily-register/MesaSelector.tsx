import type { MesaUserOption } from '../../../types/daily-register.types';
import { useTranslation } from 'react-i18next';

interface MesaSelectorProps {
  mesaUsers: MesaUserOption[];
  selectedMesaUserId: string;
  onChange: (mesaUserId: string) => void;
  locked?: boolean;
  lockedLabel?: string;
}

export function MesaSelector({
  mesaUsers,
  selectedMesaUserId,
  onChange,
  locked = false,
  lockedLabel,
}: MesaSelectorProps) {
  const { t } = useTranslation('pos');

  if (locked) {
    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-heading">
          {t('mesa_label')}
        </p>
        <p className="rounded-xl border border-slate-border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-heading">
          {lockedLabel || t('your_account')}
        </p>
        <p className="mt-1.5 text-xs text-slate-body">{t('auto_assign')}</p>
      </div>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-heading">
        {t('mesa_label')}
      </span>
      <select
        value={selectedMesaUserId}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        <option value="">{t('select_mesa')}</option>
        {mesaUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
    </label>
  );
}
