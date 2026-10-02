export function sanitizeDecimalInput(value: string, maxDecimals = 2): string {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  const [integerPart = '', ...fractionParts] = cleaned.split('.');
  const digitsInteger = integerPart.replace(/\./g, '');

  if (fractionParts.length === 0) {
    return digitsInteger;
  }

  const fraction = fractionParts.join('').slice(0, maxDecimals);
  return `${digitsInteger}.${fraction}`;
}

export function parseDecimalInput(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(',', '.');

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
