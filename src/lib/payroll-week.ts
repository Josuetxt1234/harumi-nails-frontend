import { SALON_TIMEZONE } from './salon-timezone';

function getCalendarDateInSalon(instant: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SALON_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  const nextYear = next.getUTCFullYear();
  const nextMonth = String(next.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(next.getUTCDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function getWeekdayIndex(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const noonUtc = Date.UTC(year, month - 1, day, 17, 0, 0);
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: SALON_TIMEZONE,
    weekday: 'short',
  }).format(new Date(noonUtc));
  const index: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return index[label] ?? 6;
}

export function getCurrentPayrollWeek(offsetWeeks = 0): {
  startDate: string;
  endDate: string;
} {
  const today = getCalendarDateInSalon();
  const daysFromSaturday = (getWeekdayIndex(today) + 1) % 7;
  const thisSaturday = addCalendarDays(today, -daysFromSaturday);
  const startDate = addCalendarDays(thisSaturday, offsetWeeks * 7);
  const endDate = addCalendarDays(startDate, 6);

  return { startDate, endDate };
}

export function formatPayrollWeekLabel(startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat('es-EC', {
    timeZone: SALON_TIMEZONE,
    day: '2-digit',
    month: 'short',
  });
  const start = formatter.format(new Date(`${startDate}T12:00:00-05:00`));
  const end = formatter.format(new Date(`${endDate}T12:00:00-05:00`));
  return `Sábado ${start} – Viernes ${end}`;
}

export function formatPayrollPeriodRange(
  periodStart: string,
  periodEnd: string,
): string {
  return formatPayrollWeekLabel(
    toSalonDateKey(periodStart),
    toSalonPeriodEndDateKey(periodEnd),
  );
}

function getSalonDateTimeParts(value: string): {
  dateKey: string;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
} | null {
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SALON_TIMEZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  const year = read('year');
  const month = read('month');
  const day = read('day');
  const weekdayLabel = read('weekday');
  const weekdayIndex: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  if (!year || !month || !day) {
    return null;
  }

  return {
    dateKey: `${year}-${month}-${day}`,
    hour: Number(read('hour')),
    minute: Number(read('minute')),
    second: Number(read('second')),
    weekday: weekdayIndex[weekdayLabel ?? ''] ?? 6,
  };
}

export function toSalonDateKey(value: string): string {
  return (
    getSalonDateTimeParts(value)?.dateKey ??
    new Intl.DateTimeFormat('en-CA', {
      timeZone: SALON_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value))
  );
}

export function toSalonPeriodEndDateKey(value: string): string {
  const parts = getSalonDateTimeParts(value);
  if (!parts) {
    return toSalonDateKey(value);
  }

  const isStartOfSalonDay =
    parts.hour === 0 && parts.minute === 0 && parts.second === 0;
  const belongsToNextWeek = isStartOfSalonDay || parts.weekday === 6;

  if (belongsToNextWeek) {
    return addCalendarDays(parts.dateKey, -1);
  }

  return parts.dateKey;
}
