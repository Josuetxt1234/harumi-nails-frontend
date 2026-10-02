import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';
import { getApiErrorMessage } from '../lib/get-api-error';
import { getCurrentPayrollWeek, toSalonDateKey, toSalonPeriodEndDateKey } from '../lib/payroll-week';
import { listMesaUsers } from '../services/daily-register.service';
import {
  closePayroll,
  generatePayroll,
  getMyPayrolls,
  getPayrollPreview,
  getPayrolls,
} from '../services/payroll.service';
import type { MesaUserOption } from '../types/daily-register.types';
import type { Payroll, PayrollPreview } from '../types/payroll.types';

interface UsePayrollOptions {
  scope: 'admin' | 'mine';
}

export function usePayroll({ scope }: UsePayrollOptions) {
  const [weekOffset, setWeekOffset] = useState(0);
  const week = useMemo(
    () => getCurrentPayrollWeek(weekOffset),
    [weekOffset],
  );
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [mesaUserId, setMesaUserId] = useState('');
  const [preview, setPreview] = useState<PayrollPreview | null>(null);
  const [generatedPayroll, setGeneratedPayroll] = useState<Payroll | null>(
    null,
  );
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const periodStart = week.startDate;
  const periodEnd = week.endDate;

  useEffect(() => {
    if (scope !== 'admin') {
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
        // La vista previa fallará si no hay mesas.
      }
    }

    void loadMesaUsers();

    return () => {
      isMounted = false;
    };
  }, [scope]);

  const refreshPayrolls = useCallback(async () => {
    setIsLoadingList(true);

    try {
      const response =
        scope === 'mine'
          ? await getMyPayrolls({ page: 1, limit: 50 })
          : await getPayrolls({
              mesaUserId: mesaUserId || undefined,
              page: 1,
              limit: 50,
            });
      const items = Array.isArray(response.data) ? response.data : [];
      setPayrolls(items);

      const match =
        mesaUserId
          ? items.find(
              (payroll) =>
                toSalonDateKey(payroll.periodStart) === periodStart &&
                toSalonPeriodEndDateKey(payroll.periodEnd) === periodEnd &&
                payroll.mesaUserId === mesaUserId,
            )
          : undefined;
      setGeneratedPayroll(match ?? null);
    } catch (error) {
      setPayrolls([]);
      setErrorMessage(
        getApiErrorMessage(error, 'errors:payroll_load'),
      );
    } finally {
      setIsLoadingList(false);
    }
  }, [mesaUserId, periodEnd, periodStart, scope]);

  useEffect(() => {
    void refreshPayrolls();
  }, [refreshPayrolls]);

  useEffect(() => {
    if (scope !== 'admin' || !mesaUserId) {
      setPreview(null);
      return;
    }

    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setIsLoadingPreview(true);
        setErrorMessage('');

        try {
          const data = await getPayrollPreview({
            mesaUserId,
            periodStart,
            periodEnd,
          });
          if (isMounted) {
            setPreview(data);
          }
        } catch (error) {
          if (isMounted) {
            setPreview(null);
            setErrorMessage(
              getApiErrorMessage(error, 'errors:payroll_preview'),
            );
          }
        } finally {
          if (isMounted) {
            setIsLoadingPreview(false);
          }
        }
      })();
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [mesaUserId, periodEnd, periodStart, scope]);

  const generate = useCallback(async () => {
    if (!mesaUserId) {
      setErrorMessage(i18n.t('errors:payroll_select_user'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payroll = await generatePayroll({
        mesaUserId,
        periodStart,
        periodEnd,
      });
      setGeneratedPayroll(payroll);
      setSuccessMessage(i18n.t('notifications:payroll_generated'));
      await refreshPayrolls();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'errors:payroll_generate'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [mesaUserId, periodEnd, periodStart, refreshPayrolls]);

  const close = useCallback(async () => {
    if (!generatedPayroll) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payroll = await closePayroll(generatedPayroll.id);
      setGeneratedPayroll(payroll);
      setSuccessMessage(i18n.t('notifications:payroll_closed'));
      await refreshPayrolls();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'errors:payroll_close'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [generatedPayroll, refreshPayrolls]);

  const totals = {
    grossSales: generatedPayroll?.grossSales ?? preview?.grossSales ?? 0,
    baseCommissionTotal:
      generatedPayroll?.baseCommissionTotal ??
      preview?.baseCommissionTotal ??
      0,
    weekendBonusTotal:
      generatedPayroll?.weekendBonusTotal ?? preview?.weekendBonusTotal ?? 0,
    advancesDeductionTotal:
      generatedPayroll?.advancesDeductionTotal ??
      preview?.advancesDeductionTotal ??
      0,
    netPayable: generatedPayroll?.netPayable ?? preview?.netPayable ?? 0,
    registersCount: preview?.registersCount ?? 0,
    advancesCount: preview?.advancesCount ?? 0,
  };

  return {
    week,
    weekOffset,
    setWeekOffset,
    mesaUsers,
    mesaUserId,
    setMesaUserId,
    preview,
    generatedPayroll,
    payrolls,
    totals,
    isLoadingPreview,
    isLoadingList,
    isSubmitting,
    errorMessage,
    successMessage,
    generate,
    close,
    refreshPayrolls,
  };
}
