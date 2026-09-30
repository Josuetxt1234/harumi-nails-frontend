import { Minus, Plus, Trash2 } from 'lucide-react';
import type {
  CartItem,
  MesaUserOption,
  PaymentMethod,
  RegisterTotals,
} from '../../../types/daily-register.types';
import { formatMoney } from '../../../lib/money';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { MesaSelector } from './MesaSelector';

interface RegisterCheckoutPanelProps {
  cart: CartItem[];
  clientName: string;
  discountAmount: number;
  hasCardFee: boolean;
  paymentMethod: PaymentMethod;
  totals: RegisterTotals;
  isSubmitting: boolean;
  showMesaSelector?: boolean;
  mesaUsers?: MesaUserOption[];
  selectedMesaUserId?: string;
  onMesaUserChange?: (mesaUserId: string) => void;
  onClientNameChange: (value: string) => void;
  onDiscountChange: (value: number) => void;
  onHasCardFeeChange: (value: boolean) => void;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  onRemoveItem: (serviceId: string) => void;
  onSubmit: () => void;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'CARD', label: 'Tarjeta' },
];

export function RegisterCheckoutPanel({
  cart,
  clientName,
  discountAmount,
  hasCardFee,
  paymentMethod,
  totals,
  isSubmitting,
  showMesaSelector = false,
  mesaUsers = [],
  selectedMesaUserId = '',
  onMesaUserChange,
  onClientNameChange,
  onDiscountChange,
  onHasCardFeeChange,
  onPaymentMethodChange,
  onQuantityChange,
  onRemoveItem,
  onSubmit,
}: RegisterCheckoutPanelProps) {
  return (
    <section className="flex min-h-0 w-full flex-col rounded-[28px] border border-slate-border bg-white p-5 shadow-sm lg:w-[420px] lg:shrink-0 lg:p-6">
      <div className="mb-4 shrink-0">
        <h2 className="font-outfit text-xl font-bold text-slate-heading">
          Registro y cobro
        </h2>
        <p className="mt-1 text-sm text-slate-body">
          El descuento no afecta la comisión de la manicurista.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto scrollbar-hide">
        {showMesaSelector && onMesaUserChange ? (
          <MesaSelector
            mesaUsers={mesaUsers}
            selectedMesaUserId={selectedMesaUserId}
            onChange={onMesaUserChange}
          />
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-heading">
            Nombre del cliente
          </span>
          <input
            type="text"
            value={clientName}
            onChange={(event) => onClientNameChange(event.target.value)}
            placeholder="Ej. Ana Pérez"
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-heading">
            Servicios seleccionados
          </p>
          {cart.length === 0 ? (
            <EmptyState
              title="Carrito vacío"
              description="Agrega servicios desde el catálogo."
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
                        {formatMoney(item.unitPrice)} c/u · {item.commissionRate}%
                        comisión
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.serviceId)}
                      className="rounded-lg p-1.5 text-slate-muted transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Quitar ${item.name}`}
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
                        className="rounded-lg p-1.5 text-slate-heading transition hover:bg-slate-50 disabled:opacity-40"
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
                        className="rounded-lg p-1.5 text-slate-heading transition hover:bg-slate-50"
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

        <div className="space-y-3 rounded-2xl border border-slate-border bg-slate-50/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-body">Subtotal base</span>
            <span className="font-semibold text-slate-heading">
              {formatMoney(totals.subtotalBase)}
            </span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-body">
              Descuento ($)
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={discountAmount || ''}
              onChange={(event) =>
                onDiscountChange(Number(event.target.value) || 0)
              }
              className="w-full rounded-xl border border-slate-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-border bg-white px-3 py-3">
            <span className="text-sm text-slate-heading">
              Recargo tarjeta (+5%)
            </span>
            <input
              type="checkbox"
              checked={hasCardFee}
              onChange={(event) => onHasCardFeeChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-border text-brand focus:ring-brand/30"
            />
          </label>

          {hasCardFee ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-body">Recargo tarjeta</span>
              <span className="font-semibold text-slate-heading">
                {formatMoney(totals.cardFeeAmount)}
              </span>
            </div>
          ) : null}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Comisión manicurista
            </p>
            <p className="mt-1 font-outfit text-2xl font-bold text-emerald-700">
              {formatMoney(totals.totalCommission)}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80">
              Calculada sobre subtotal base (sin descuento).
            </p>
          </div>

          <div className="rounded-xl border border-brand/30 bg-brand/10 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
              Total a cobrar al cliente
            </p>
            <p className="mt-1 font-outfit text-2xl font-bold text-slate-heading">
              {formatMoney(totals.totalPaid)}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-heading">
            Método de pago
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = paymentMethod === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPaymentMethodChange(option.value)}
                  className={[
                    'rounded-xl border px-2 py-3 text-xs font-bold transition sm:text-sm',
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : 'border-slate-border bg-white text-slate-heading hover:border-brand/40',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || cart.length === 0}
        className="mt-5 shrink-0 rounded-xl bg-brand px-5 py-4 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Trabajo Diario'}
      </button>
    </section>
  );
}
