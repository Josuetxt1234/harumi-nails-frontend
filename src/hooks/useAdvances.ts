import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';
import { getApiErrorMessage } from '../lib/get-api-error';
import { notifyNotificationsChanged } from '../lib/notifications-sync';
import {
  cancelAdvance,
  createAdvance,
  deleteAdvance,
  getAdvances,
  getMyAdvances,
} from '../services/advances.service';
import { listMesaUsers } from '../services/daily-register.service';
import type { Advance, CreateAdvanceInput } from '../types/advance.types';
import type { MesaUserOption } from '../types/daily-register.types';

interface UseAdvancesOptions {
  scope: 'admin' | 'mine';
}

export function useAdvances({ scope }: UseAdvancesOptions) {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [advanceToCancel, setAdvanceToCancel] = useState<Advance | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const refreshAdvances = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response =
        scope === 'mine'
          ? await getMyAdvances({ page: 1, limit: 100 })
          : await getAdvances({ page: 1, limit: 100 });
      setAdvances(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setAdvances([]);
      setErrorMessage(
        getApiErrorMessage(error, 'errors:vouchers_load'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void refreshAdvances();
  }, [refreshAdvances]);

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
        // El modal puede mostrar el error al crear.
      }
    }

    void loadMesaUsers();

    return () => {
      isMounted = false;
    };
  }, [scope]);

  const create = useCallback(
    async (input: CreateAdvanceInput) => {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await createAdvance(input);
        setSuccessMessage(i18n.t('notifications:voucher_created'));
        setIsCreateOpen(false);
        notifyNotificationsChanged();
        await refreshAdvances();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:vouchers_create'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshAdvances],
  );

  const cancel = useCallback(
    async (advanceId: string, reason: string) => {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await cancelAdvance(advanceId, reason);
        setSuccessMessage(i18n.t('notifications:voucher_cancelled'));
        setAdvanceToCancel(null);
        notifyNotificationsChanged();
        await refreshAdvances();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:vouchers_cancel'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshAdvances],
  );

  const remove = useCallback(
    async (advanceId: string) => {
      setIsSubmitting(true);
      setErrorMessage('');

      try {
        await deleteAdvance(advanceId);
        await refreshAdvances();
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, 'errors:vouchers_delete'),
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshAdvances],
  );

  const pendingTotal = useMemo(
    () =>
      advances
        .filter((advance) => advance.status === 'PENDING')
        .reduce((sum, advance) => sum + advance.amount, 0),
    [advances],
  );

  return {
    advances,
    mesaUsers,
    isLoading,
    isSubmitting,
    isCreateOpen,
    setIsCreateOpen,
    advanceToCancel,
    setAdvanceToCancel,
    errorMessage,
    successMessage,
    pendingTotal,
    create,
    cancel,
    remove,
    refreshAdvances,
  };
}
