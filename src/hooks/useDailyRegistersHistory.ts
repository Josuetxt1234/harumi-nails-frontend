import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../lib/get-api-error';
import {
  listDailyRegisters,
  listMesaUsers,
  voidDailyRegister,
} from '../services/daily-register.service';
import type {
  DailyRegister,
  MesaUserOption,
  PaymentMethod,
} from '../types/daily-register.types';

function getTodayIsoDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface UseDailyRegistersHistoryOptions {
  enabled?: boolean;
}

export function useDailyRegistersHistory(
  options: UseDailyRegistersHistoryOptions = {},
) {
  const enabled = options.enabled ?? true;
  const [registers, setRegisters] = useState<DailyRegister[]>([]);
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [date, setDate] = useState(getTodayIsoDate());
  const [mesaUserId, setMesaUserId] = useState<'all' | string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'all' | PaymentMethod>('all');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiding, setIsVoiding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    async function loadMesaUsers() {
      try {
        const users = await listMesaUsers();
        if (isMounted) {
          setMesaUsers(users);
        }
      } catch {
        // Non-blocking for history view.
      }
    }

    loadMesaUsers();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  const refreshRegisters = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await listDailyRegisters({
        date,
        mesaUserId,
        paymentMethod,
        page: 1,
        limit: 100,
      });

      setRegisters(Array.isArray(response.data) ? response.data : []);
      setTotal(response.meta?.total ?? 0);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo cargar el historial de registros.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [date, enabled, mesaUserId, paymentMethod]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    refreshRegisters();
  }, [enabled, refreshRegisters]);

  const voidRegister = useCallback(
    async (registerId: string) => {
      setIsVoiding(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await voidDailyRegister(registerId);
        setSuccessMessage('Registro anulado correctamente.');
        await refreshRegisters();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'No se pudo anular el registro.'),
        );
        throw error;
      } finally {
        setIsVoiding(false);
      }
    },
    [refreshRegisters],
  );

  return {
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
  };
}
