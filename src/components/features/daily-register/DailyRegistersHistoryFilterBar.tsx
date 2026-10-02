import type { DateRangePreset, MesaUserOption } from '../../../types/daily-register.types';
import { useTranslation } from 'react-i18next';

const chipClassName = (isActive: boolean) =>
  [
    'rounded-xl px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-brand text-white shadow-sm'
      : 'border border-slate-border bg-white text-slate-heading hover:border-brand/40 hover:text-brand',
  ].join(' ');

export interface HistoryFilterBarProps {
  dateRange: DateRangePreset;
  startDate: string;
  endDate: string;
  rangeError: string;
  mesaUserId: string;
  mesaUsers: MesaUserOption[];
  canFilterByMesa: boolean;
  onSelectQuickRange: (range: DateRangePreset) => void;
  onSelectCustomRange: () => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMesaUserChange: (value: string) => void;
}

export function HistoryFilterBar({
  dateRange,
  startDate,
  endDate,
  rangeError,
  mesaUserId,
  mesaUsers,
  canFilterByMesa,
  onSelectQuickRange,
  onSelectCustomRange,
  onStartDateChange,
  onEndDateChange,
  onMesaUserChange,
}: HistoryFilterBarProps) {
  const { t } = useTranslation('history');
  const isCustom = dateRange === 'CUSTOM';
  const chips: Array<{ value: DateRangePreset; key: string }> = [
    { value: 'TODAY', key: 'today' },
    { value: 'YESTERDAY', key: 'yesterday' },
    { value: 'THIS_WEEK', key: 'this_week' },
    { value: 'THIS_MONTH', key: 'this_month' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => onSelectQuickRange(chip.value)}
              className={chipClassName(dateRange === chip.value)}
            >
              {t(chip.key)}
            </button>
          ))}
          <button
            type="button"
            onClick={onSelectCustomRange}
            className={chipClassName(isCustom)}
          >
            {t('custom')}
          </button>
        </div>

        {canFilterByMesa ? (
          <label className="flex min-w-[220px] flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">{t('pos:mesa')}</span>
            <select
              value={mesaUserId}
              onChange={(event) => onMesaUserChange(event.target.value)}
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="all">{t('all_stations')}</option>
              {mesaUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {isCustom ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">{t('start_date')}</span>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">{t('end_date')}</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>
      ) : null}

      {rangeError ? (
        <p className="text-sm font-medium text-red-600">{rangeError}</p>
      ) : null}
    </div>
  );
}
