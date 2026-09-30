import { CARD_FEE_RATE, toMoney } from './money';
import type { CartItem, RegisterTotals } from '../types/daily-register.types';

export function calculateRegisterTotals(
  items: CartItem[],
  discountAmount: number,
  hasCardFee: boolean,
): RegisterTotals {
  const subtotalBase = toMoney(
    items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
  );

  const totalCommission = toMoney(
    items.reduce(
      (sum, item) =>
        sum +
        item.unitPrice * item.quantity * (item.commissionRate / 100),
      0,
    ),
  );

  const safeDiscount = toMoney(
    Math.min(Math.max(discountAmount, 0), subtotalBase),
  );
  const amountAfterDiscount = toMoney(subtotalBase - safeDiscount);
  const cardFeeAmount = hasCardFee
    ? toMoney(amountAfterDiscount * CARD_FEE_RATE)
    : 0;
  const totalPaid = toMoney(amountAfterDiscount + cardFeeAmount);

  return {
    subtotalBase,
    discountAmount: safeDiscount,
    amountAfterDiscount,
    cardFeeAmount,
    totalPaid,
    totalCommission,
  };
}
