import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import i18n from '../i18n';
import { calculateRegisterTotals } from '../lib/calculate-register-totals';
import { getApiErrorMessage } from '../lib/get-api-error';
import { formatMoney } from '../lib/money';
import { parseDecimalInput } from '../lib/parse-decimal-input';
import { createDailyRegister, listMesaUsers } from '../services/daily-register.service';
import { getServices } from '../services/services.service';
import type {
  CartItem,
  MesaUserOption,
  PaymentMethod,
  SalonService,
} from '../types/daily-register.types';

async function loadActiveCatalog(): Promise<SalonService[]> {
  const firstPage = await getServices({
    isActive: true,
    page: 1,
    limit: 100,
  });

  if (firstPage.totalPages <= 1) {
    return firstPage.services;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getServices({
        isActive: true,
        page: index + 2,
        limit: 100,
      }),
    ),
  );

  return [
    ...firstPage.services,
    ...remainingPages.flatMap((page) => page.services),
  ];
}

export interface UseDailyRegisterFormOptions {
  onRegistered?: () => void;
}

export function useDailyRegisterForm({
  onRegistered,
}: UseDailyRegisterFormOptions = {}) {
  const { user } = useAuth();
  const isElevated = Boolean(
    user?.roles.includes(SYSTEM_ROLES.ADMIN) ||
      user?.roles.includes(SYSTEM_ROLES.SUPER_ADMIN),
  );
  const lockedMesaLabel = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : i18n.t('pos:your_account');

  const [services, setServices] = useState<SalonService[]>([]);
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [selectedMesaUserId, setSelectedMesaUserId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [clientName, setClientName] = useState('');
  const [discountInput, setDiscountInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoadingServices(true);
      setErrorMessage('');

      try {
        const [servicesData, mesaUsersData] = await Promise.all([
          loadActiveCatalog(),
          isElevated ? listMesaUsers() : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setServices(servicesData);

        if (mesaUsersData) {
          setMesaUsers(mesaUsersData);
          setSelectedMesaUserId(mesaUsersData[0]?.id ?? '');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getApiErrorMessage(error, 'errors:services_load'),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isElevated]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(services.map((service) => service.category)),
    );
    return unique.sort((left, right) => left.localeCompare(right, 'es'));
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        category === 'all' || service.category === category;
      const matchesSearch =
        !normalizedSearch ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [services, search, category]);

  const discountAmount = parseDecimalInput(discountInput) ?? 0;
  const applyCardFee = paymentMethod === 'CARD';

  const totals = useMemo(
    () =>
      calculateRegisterTotals(
        cart,
        discountAmount,
        paymentMethod,
        applyCardFee,
      ),
    [cart, discountAmount, paymentMethod, applyCardFee],
  );

  const addService = useCallback((service: SalonService) => {
    setCart((current) => {
      const existing = current.find((item) => item.serviceId === service.id);

      if (existing) {
        return current.map((item) =>
          item.serviceId === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          serviceId: service.id,
          name: service.name,
          category: service.category,
          unitPrice: service.price,
          commissionRate: service.commissionPercentage,
          quantity: 1,
        },
      ];
    });
    setSuccessMessage('');
  }, []);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.serviceId === serviceId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((serviceId: string) => {
    setCart((current) =>
      current.filter((item) => item.serviceId !== serviceId),
    );
  }, []);

  const resetForm = useCallback(() => {
    setCart([]);
    setClientName('');
    setDiscountInput('');
    setPaymentMethod('CASH');
  }, []);

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
  }, []);

  const submit = useCallback(async () => {
    if (isElevated && !selectedMesaUserId) {
      setErrorMessage(i18n.t('errors:pos_select_mesa'));
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage(i18n.t('errors:pos_client_required'));
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(i18n.t('errors:pos_services_required'));
      return;
    }

    if (discountAmount > totals.subtotalBase) {
      setErrorMessage(i18n.t('errors:pos_discount_invalid'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const register = await createDailyRegister({
        ...(isElevated ? { mesaUserId: selectedMesaUserId } : {}),
        clientName: clientName.trim(),
        paymentMethod,
        discountAmount: totals.discountAmount,
        hasCardFee: applyCardFee,
        items: cart.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
        })),
      });

      resetForm();
      setSuccessMessage(
        i18n.t('pos:saved', {
          client: register.clientName,
          commission: formatMoney(register.totalCommission),
        }),
      );
      onRegistered?.();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'errors:pos_register'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    applyCardFee,
    cart,
    clientName,
    discountAmount,
    isElevated,
    onRegistered,
    paymentMethod,
    resetForm,
    selectedMesaUserId,
    totals.discountAmount,
    totals.subtotalBase,
  ]);

  return {
    isElevated,
    lockedMesaLabel,
    services: filteredServices,
    categories,
    mesaUsers,
    selectedMesaUserId,
    setSelectedMesaUserId,
    cart,
    search,
    setSearch,
    category,
    setCategory,
    clientName,
    setClientName,
    discountInput,
    setDiscountInput,
    paymentMethod,
    setPaymentMethod: handlePaymentMethodChange,
    totals,
    isLoadingServices,
    isSubmitting,
    errorMessage,
    successMessage,
    addService,
    updateQuantity,
    removeItem,
    submit,
  };
}
