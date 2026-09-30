import type { MesaUserOption } from '../../../types/daily-register.types';

interface MesaSelectorProps {
  mesaUsers: MesaUserOption[];
  selectedMesaUserId: string;
  onChange: (mesaUserId: string) => void;
}

export function MesaSelector({
  mesaUsers,
  selectedMesaUserId,
  onChange,
}: MesaSelectorProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-heading">
        Mesa / Manicurista
      </span>
      <select
        value={selectedMesaUserId}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        <option value="">Selecciona una mesa</option>
        {mesaUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
    </label>
  );
}
