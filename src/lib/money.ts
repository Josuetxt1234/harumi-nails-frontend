export function toMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(value: number | null | undefined): string {
  const safeValue =
    typeof value === 'number' && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(safeValue);
}

export const CARD_FEE_RATE = 0.05;
