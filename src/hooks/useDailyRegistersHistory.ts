import { useCallback, useEffect, useState } from 'react';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';
import { getApiErrorMessage } from '../lib/get-api-error';
import { SALON_TIMEZONE } from '../lib/salon-timezone';
import {
  listDailyRegisters,
  listMesaUsers,
  voidDailyRegister,
} from '../services/daily-register.service';
import type {
  DailyRegister,
  DateRangePreset,
  MesaUserOption,
} from '../types/daily-register.types';

interface UseDailyRegistersHistoryOptions {
  enabled?: boolean;
}

const EMPTY_SUMMARY = {
  totalPaid: 0,
  totalCommission: 0,
  servicesCount: 0,
  total: 0,
};

function getSalonIsoDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SALON_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function useDailyRegistersHistory(
  options: UseDailyRegistersHistoryOptions = {},
) {
  const enabled = options.enabled ?? true;
  const { user } = useAuth();
  const canFilterByMesa =
    Boolean(user?.roles.includes(SYSTEM_ROLES.ADMIN)) ||
    Boolean(user?.roles.includes(SYSTEM_ROLES.SUPER_ADMIN));

  const [registers, setRegisters] = useState<DailyRegister[]>([]);
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [dateRange, setDateRange] = useState<DateRangePreset>('TODAY');
  const [startDate, setStartDate] = useState(getSalonIsoDate);
  const [endDate, setEndDate] = useState(getSalonIsoDate);
  const [mesaUserId, setMesaUserId] = useState<'all' | string>('all');
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiding, setIsVoiding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rangeError, setRangeError] = useState('');

  useEffect(() => {
    if (!enabled || !canFilterByMesa) {
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
        // El historial puede funcionar sin el filtro de mesas.
      }
    }

    void loadMesaUsers();

    return () => {
      isMounted = false;
    };
  }, [canFilterByMesa, enabled]);

  const refreshRegisters = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (dateRange === 'CUSTOM' && startDate && endDate && endDate < startDate) {
      setRangeError(i18n.t('history:range_error'));
      setRegisters([]);
      setSummary(EMPTY_SUMMARY);
      setIsLoading(false);
      return;
    }

    setRangeError('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await listDailyRegisters({
        dateRange,
        startDate: dateRange === 'CUSTOM' ? startDate : undefined,
        endDate: dateRange === 'CUSTOM' ? endDate : undefined,
        mesaUserId: canFilterByMesa ? mesaUserId : undefined,
        page: 1,
        limit: 100,
      });

      setRegisters(Array.isArray(response.data) ? response.data : []);
      setSummary({
        total: response.meta?.total ?? 0,
        totalPaid: response.meta?.totalPaid ?? 0,
        totalCommission: response.meta?.totalCommission ?? 0,
        servicesCount: response.meta?.servicesCount ?? 0,
      });
    } catch (error) {
      setRegisters([]);
      setSummary(EMPTY_SUMMARY);
      setErrorMessage(
        getApiErrorMessage(error, 'errors:pos_load'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [canFilterByMesa, dateRange, enabled, endDate, mesaUserId, startDate]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void refreshRegisters();
  }, [enabled, refreshRegisters]);

  const selectQuickRange = useCallback((range: DateRangePreset) => {
    setRangeError('');
    setDateRange(range);
  }, []);

  const selectCustomRange = useCallback(() => {
    const today = getSalonIsoDate();
    setDateRange('CUSTOM');
    setStartDate((current) => current || today);
    setEndDate((current) => current || today);
  }, []);

  const changeStartDate = useCallback((value: string) => {
    setDateRange('CUSTOM');
    setStartDate(value);
  }, []);

  const changeEndDate = useCallback((value: string) => {
    setDateRange('CUSTOM');
    setEndDate(value);
  }, []);

  const voidRegister = useCallback(
    async (registerId: string) => {
      setIsVoiding(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await voidDailyRegister(registerId);
        setSuccessMessage(i18n.t('notifications:register_voided'));
        await refreshRegisters();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:pos_void'),
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
    dateRange,
    startDate,
    endDate,
    rangeError,
    selectQuickRange,
    selectCustomRange,
    changeStartDate,
    changeEndDate,
    mesaUserId,
    setMesaUserId,
    canFilterByMesa,
    summary,
    isLoading,
    isVoiding,
    errorMessage,
    successMessage,
    voidRegister,
  };
}
