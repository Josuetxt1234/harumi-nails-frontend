import { useCallback, useEffect, useMemo, useState } from 'react';
import { toMoney } from '../lib/money';
import { listTodayDailyRegisters } from '../services/daily-register.service';

export function useTodayRegisterSummary() {
  const [totalPaidToday, setTotalPaidToday] = useState(0);
  const [commissionToday, setCommissionToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSummary = useCallback(async () => {
    setIsLoading(true);

    try {
      const registers = await listTodayDailyRegisters();
      const safeRegisters = Array.isArray(registers) ? registers : [];

      const paid = toMoney(
        safeRegisters.reduce((sum, register) => sum + register.totalPaid, 0),
      );
      const commission = toMoney(
        safeRegisters.reduce(
          (sum, register) => sum + register.totalCommission,
          0,
        ),
      );

      setTotalPaidToday(paid);
      setCommissionToday(commission);
    } catch {
      setTotalPaidToday(0);
      setCommissionToday(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  return useMemo(
    () => ({
      totalPaidToday,
      commissionToday,
      isLoading,
      refreshSummary,
    }),
    [
      commissionToday,
      isLoading,
      refreshSummary,
      totalPaidToday,
    ],
  );
}
