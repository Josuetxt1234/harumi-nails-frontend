import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateRegisterTotals } from '../lib/calculate-register-totals';
import { getApiErrorMessage } from '../lib/get-api-error';
import {
  createDailyRegister,
  listMesaUsers,
  listSalonServices,
} from '../services/daily-register.service';
import type {
  CartItem,
  MesaUserOption,
  PaymentMethod,
  SalonService,
} from '../types/daily-register.types';

export interface UseDailyRegisterFormOptions {
  requireMesaSelection?: boolean;
}

export function useDailyRegisterForm(
  options: UseDailyRegisterFormOptions = {},
) {
  const requireMesaSelection = options.requireMesaSelection ?? false;

  const [services, setServices] = useState<SalonService[]>([]);
  const [mesaUsers, setMesaUsers] = useState<MesaUserOption[]>([]);
  const [selectedMesaUserId, setSelectedMesaUserId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [clientName, setClientName] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [hasCardFee, setHasCardFee] = useState(false);
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
        const requests: [
          Promise<SalonService[]>,
          Promise<MesaUserOption[] | null>,
        ] = [
          listSalonServices(),
          requireMesaSelection ? listMesaUsers() : Promise.resolve(null),
        ];

        const [servicesData, mesaUsersData] = await Promise.all(requests);

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
            getApiErrorMessage(error, 'No se pudo cargar el catálogo de servicios.'),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [requireMesaSelection]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((service) => service.category)));
    return unique.sort((left, right) => left.localeCompare(right));
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

  const totals = useMemo(
    () => calculateRegisterTotals(cart, discountAmount, hasCardFee),
    [cart, discountAmount, hasCardFee],
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
    setDiscountAmount(0);
    setHasCardFee(false);
    setPaymentMethod('CASH');
  }, []);

  const submit = useCallback(async () => {
    if (requireMesaSelection && !selectedMesaUserId) {
      setErrorMessage('Selecciona la mesa / manicurista.');
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage('Ingresa el nombre del cliente.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Agrega al menos un servicio al registro.');
      return;
    }

    if (discountAmount > totals.subtotalBase) {
      setErrorMessage('El descuento no puede superar el subtotal base.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const register = await createDailyRegister({
        ...(requireMesaSelection ? { mesaUserId: selectedMesaUserId } : {}),
        clientName: clientName.trim(),
        paymentMethod,
        discountAmount: totals.discountAmount,
        hasCardFee,
        items: cart.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
        })),
      });

      resetForm();
      setSuccessMessage(
        `Registro guardado para ${register.clientName}. Comisión: $${register.totalCommission.toFixed(2)}.`,
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo registrar el trabajo diario.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    cart,
    clientName,
    discountAmount,
    hasCardFee,
    paymentMethod,
    requireMesaSelection,
    resetForm,
    selectedMesaUserId,
    totals.discountAmount,
    totals.subtotalBase,
  ]);

  return {
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
    discountAmount,
    setDiscountAmount,
    hasCardFee,
    setHasCardFee,
    paymentMethod,
    setPaymentMethod,
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
