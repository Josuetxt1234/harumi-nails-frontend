import { useState } from 'react';
import { PERMISSIONS } from '../../../constants/permissions.constants';
import { useAuth } from '../../../context/AuthContext';
import { useDailyRegistersHistory } from '../../../hooks/useDailyRegistersHistory';
import { formatDateTime, getPaymentMethodLabel } from '../../../lib/format-register';
import { formatMoney } from '../../../lib/money';
import type { DailyRegister, PaymentMethod } from '../../../types/daily-register.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { PageHeader } from '../../ui/layout/PageHeader';
import { VoidRegisterDialog } from './VoidRegisterDialog';

export interface DailyRegistersHistoryViewProps {
  showHeader?: boolean;
  enabled?: boolean;
}

export function DailyRegistersHistoryView({
  showHeader = true,
  enabled = true,
}: DailyRegistersHistoryViewProps) {
  const { hasPermission } = useAuth();
  const {
    registers,
    mesaUsers,
    date,
    setDate,
    mesaUserId,
    setMesaUserId,
    paymentMethod,
    setPaymentMethod,
    total,
    isLoading,
    isVoiding,
    errorMessage,
    successMessage,
    voidRegister,
  } = useDailyRegistersHistory({ enabled });

  const [registerToVoid, setRegisterToVoid] = useState<DailyRegister | null>(
    null,
  );

  const canVoid = hasPermission(PERMISSIONS.DAILY_REGISTERS_VOID);

  const handleConfirmVoid = async () => {
    if (!registerToVoid) {
      return;
    }

    try {
      await voidRegister(registerToVoid.id);
      setRegisterToVoid(null);
    } catch {
      // Error handled in hook.
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showHeader ? (
        <PageHeader
          title="Historial de registros"
          subtitle="Consulta y audita los trabajos registrados por mesa."
        />
      ) : null}

      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-slate-border bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-end">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">Fecha</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">Manicurista</span>
            <select
              value={mesaUserId}
              onChange={(event) => setMesaUserId(event.target.value)}
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="all">Todas las mesas</option>
              {mesaUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-heading">Pago</span>
            <select
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as 'all' | PaymentMethod)
              }
              className="rounded-xl border border-slate-border px-4 py-3 text-sm text-slate-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="all">Todos</option>
              <option value="CASH">Efectivo</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="CARD">Tarjeta</option>
            </select>
          </label>

          <p className="text-sm text-slate-body lg:ml-auto">
            {total} registro{total === 1 ? '' : 's'} encontrados
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={errorMessage} />
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 shrink-0">
            <AlertBanner message={successMessage} tone="success" />
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <EmptyState title="Cargando registros..." dashed />
          ) : (registers ?? []).length === 0 ? (
            <EmptyState
              title="Sin registros"
              description="No hay trabajos registrados con los filtros seleccionados."
              dashed
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-border">
              <table className="min-w-full divide-y divide-slate-border">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Hora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Manicurista
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Servicios
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Pago
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-body">
                      Comisión
                    </th>
                    {canVoid ? (
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-body">
                        Acciones
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border bg-white">
                  {(registers ?? []).map((register) => (
                    <tr key={register.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-sm text-slate-body">
                        {formatDateTime(register.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-heading">
                        {register.clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-body">
                        {register.mesaUserName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-body">
                        {(register.details ?? [])
                          .map(
                            (detail) =>
                              `${detail.serviceName} x${detail.quantity}`,
                          )
                          .join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-body">
                        {getPaymentMethodLabel(register.paymentMethod)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-heading">
                        {formatMoney(register.totalPaid)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">
                        {formatMoney(register.totalCommission)}
                      </td>
                      {canVoid ? (
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setRegisterToVoid(register)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Anular
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <VoidRegisterDialog
        isOpen={Boolean(registerToVoid)}
        clientName={registerToVoid?.clientName ?? ''}
        isSubmitting={isVoiding}
        onClose={() => setRegisterToVoid(null)}
        onConfirm={handleConfirmVoid}
      />
    </div>
  );
}
