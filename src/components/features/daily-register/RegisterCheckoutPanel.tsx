import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  CartItem,
  MesaUserOption,
  PaymentMethod,
  RegisterTotals,
} from '../../../types/daily-register.types';
import { formatMoney } from '../../../lib/money';
import { sanitizeDecimalInput } from '../../../lib/parse-decimal-input';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { MesaSelector } from './MesaSelector';

interface RegisterCheckoutPanelProps {
  cart: CartItem[];
  clientName: string;
  discountInput: string;
  paymentMethod: PaymentMethod;
  totals: RegisterTotals;
  isSubmitting: boolean;
  isElevated: boolean;
  lockedMesaLabel: string;
  mesaUsers?: MesaUserOption[];
  selectedMesaUserId?: string;
  onMesaUserChange?: (mesaUserId: string) => void;
  onClientNameChange: (value: string) => void;
  onDiscountInputChange: (value: string) => void;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  onRemoveItem: (serviceId: string) => void;
  onSubmit: () => void;
}

const PAYMENT_OPTIONS: PaymentMethod[] = ['CASH', 'TRANSFER', 'CARD'];

export function RegisterCheckoutPanel({
  cart,
  clientName,
  discountInput,
  paymentMethod,
  totals,
  isSubmitting,
  isElevated,
  lockedMesaLabel,
  mesaUsers = [],
  selectedMesaUserId = '',
  onMesaUserChange,
  onClientNameChange,
  onDiscountInputChange,
  onPaymentMethodChange,
  onQuantityChange,
  onRemoveItem,
  onSubmit,
}: RegisterCheckoutPanelProps) {
  const { t } = useTranslation();
  const isCardPayment = paymentMethod === 'CARD';

  return (
    <section className="flex min-h-[420px] h-full w-full flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-4 shadow-sm sm:min-h-[480px] sm:p-5 lg:h-full lg:min-h-0 lg:w-[420px] lg:shrink-0 lg:p-6">
      <div className="mb-4 shrink-0">
        <h2 className="font-outfit text-xl font-bold text-slate-heading">
          {t('pos:checkout_title')}
        </h2>
        <p className="mt-1 text-sm text-slate-body">
          {t('pos:checkout_hint')}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 pb-2 lg:overflow-y-auto lg:scrollbar-hide">
        <MesaSelector
          mesaUsers={mesaUsers}
          selectedMesaUserId={selectedMesaUserId}
          onChange={onMesaUserChange ?? (() => undefined)}
          locked={!isElevated}
          lockedLabel={lockedMesaLabel}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            {t('pos:client_name')}
          </span>
          <input
            type="text"
            value={clientName}
            onChange={(event) => onClientNameChange(event.target.value)}
            placeholder={t('pos:client_placeholder')}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-heading">
            {t('pos:selected_services')}
          </p>
          {cart.length === 0 ? (
            <EmptyState
              title={t('pos:empty_cart')}
              description={t('pos:empty_cart_hint')}
              dashed
            />
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.serviceId}
                  className="rounded-2xl border border-slate-border px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-heading">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-body">
                        {t('pos:per_unit', {
                          price: formatMoney(item.unitPrice),
                          rate: item.commissionRate,
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.serviceId)}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-muted transition hover:bg-red-50 hover:text-red-500"
                      aria-label={t('pos:remove_item', { name: item.name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-border p-1">
                      <button
                        type="button"
                        onClick={() =>
                          onQuantityChange(item.serviceId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-heading transition hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onQuantityChange(item.serviceId, item.quantity + 1)
                        }
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-heading transition hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-heading">
                      {formatMoney(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-heading">
            {t('pos:payment_method')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_OPTIONS.map((value) => {
              const isActive = paymentMethod === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onPaymentMethodChange(value)}
                  className={[
                    'min-h-[44px] rounded-xl border px-2 py-3 text-xs font-bold transition sm:text-sm',
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : 'border-slate-border bg-white text-slate-heading hover:border-brand/40',
                  ].join(' ')}
                >
                  {t(`pos:${value === 'CASH' ? 'cash' : value === 'TRANSFER' ? 'transfer' : 'card'}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-border bg-slate-50/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-heading">
              {t('pos:subtotal_base')}
            </span>
            <span className="font-outfit text-base font-bold text-slate-heading">
              {formatMoney(totals.subtotalBase)}
            </span>
          </div>
          <p className="text-xs text-slate-body">{t('pos:list_prices')}</p>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-body">
              {t('pos:discount_amount')}
            </span>
            <input
              inputMode="decimal"
              value={discountInput}
              onChange={(event) =>
                onDiscountInputChange(sanitizeDecimalInput(event.target.value))
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <span className="mt-1 block text-right text-xs text-slate-body">
              − {formatMoney(totals.discountAmount)}
            </span>
          </label>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-body">{t('pos:card_fee')}</span>
            <span className="font-semibold text-slate-heading">
              {isCardPayment ? formatMoney(totals.cardFeeAmount) : formatMoney(0)}
            </span>
          </div>
          <p className="text-xs text-slate-body">
            {isCardPayment ? t('pos:card_fee_on') : t('pos:card_fee_off')}
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
              {t('pos:manicurist_commission')}
            </p>
            <p className="mt-1 font-outfit text-2xl font-bold text-emerald-700">
              {formatMoney(totals.totalCommission)}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80">
              {t('pos:commission_intact')}
            </p>
          </div>

          <div className="rounded-xl border border-brand/30 bg-brand/10 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
              {t('pos:total_client')}
            </p>
            <p className="mt-1 font-outfit text-2xl font-bold text-slate-heading">
              {formatMoney(totals.totalPaid)}
            </p>
            <p className="mt-1 text-xs text-slate-body">
              {t('pos:total_formula')}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto border-t border-slate-border bg-white p-3 shadow-lg sm:-mx-5 lg:static lg:mx-0 lg:mt-5 lg:border-0 lg:p-0 lg:shadow-none">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || cart.length === 0}
          className="min-h-[44px] w-full shrink-0 rounded-xl bg-brand px-5 py-4 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t('pos:registering') : t('pos:register_job')}
        </button>
      </div>
    </section>
  );
}
