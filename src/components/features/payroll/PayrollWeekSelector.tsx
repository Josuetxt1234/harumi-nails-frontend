import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPayrollWeekLabel } from '../../../lib/payroll-week';

interface PayrollWeekSelectorProps {
  weekStart: string;
  weekEnd: string;
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
}

export function PayrollWeekSelector({
  weekStart,
  weekEnd,
  weekOffset,
  onWeekOffsetChange,
}: PayrollWeekSelectorProps) {
  const { t } = useTranslation();
  const weekLabel = formatPayrollWeekLabel(weekStart, weekEnd);

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 sm:hidden">
        <p className="text-center text-base font-semibold text-slate-heading">
          {weekLabel}
        </p>
        <div className="grid w-full grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onWeekOffsetChange(weekOffset - 1)}
            className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-lg border border-slate-border px-2 text-[11px] font-semibold text-slate-heading hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">{t('common:previous_week')}</span>
          </button>
          <button
            type="button"
            onClick={() => onWeekOffsetChange(0)}
            disabled={weekOffset === 0}
            aria-current={weekOffset === 0 ? 'date' : undefined}
            className={[
              'inline-flex min-h-[44px] items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition',
              weekOffset === 0
                ? 'cursor-default border border-slate-border bg-slate-50 text-slate-muted'
                : 'border border-brand/40 bg-white text-brand hover:bg-brand/10',
            ].join(' ')}
          >
            <CalendarClock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{t('payroll:current_week')}</span>
          </button>
          <button
            type="button"
            onClick={() => onWeekOffsetChange(weekOffset + 1)}
            className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-lg border border-slate-border px-2 text-[11px] font-semibold text-slate-heading hover:bg-slate-50"
          >
            <span className="truncate">{t('common:next_week')}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>

      <div className="mt-2 hidden flex-row flex-wrap items-center justify-between gap-2 sm:flex">
        <button
          type="button"
          onClick={() => onWeekOffsetChange(weekOffset - 1)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-border text-slate-heading hover:bg-slate-50"
          aria-label={t('common:previous_week')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onWeekOffsetChange(0)}
          disabled={weekOffset === 0}
          aria-current={weekOffset === 0 ? 'date' : undefined}
          className={[
            'inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
            weekOffset === 0
              ? 'cursor-default border border-slate-border bg-slate-50 text-slate-muted'
              : 'border border-brand/40 bg-white text-brand hover:bg-brand/10',
          ].join(' ')}
        >
          <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
          {t('payroll:current_week')}
        </button>
        <p className="font-outfit text-lg font-bold text-slate-heading">
          {weekLabel}
        </p>
        <button
          type="button"
          onClick={() => onWeekOffsetChange(weekOffset + 1)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-border text-slate-heading hover:bg-slate-50"
          aria-label={t('common:next_week')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
