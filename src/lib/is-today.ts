import { SALON_TIMEZONE } from './salon-timezone';

function calendarDateInTimeZone(
  instant: Date,
  timeZone: string = SALON_TIMEZONE,
): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

export function isToday(
  value: string | Date | null | undefined,
  timeZone: string = SALON_TIMEZONE,
): boolean {
  if (!value) {
    return false;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    calendarDateInTimeZone(date, timeZone) ===
    calendarDateInTimeZone(new Date(), timeZone)
  );
}
