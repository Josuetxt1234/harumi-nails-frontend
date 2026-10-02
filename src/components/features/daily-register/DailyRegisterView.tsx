import { useState } from 'react';
import { useDailyRegisterForm } from '../../../hooks/useDailyRegisterForm';
import { formatMoney } from '../../../lib/money';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { RegisterCheckoutPanel } from './RegisterCheckoutPanel';
import { ServiceCatalogPanel } from './ServiceCatalogPanel';
import { useTranslation } from 'react-i18next';

export interface DailyRegisterViewProps {
  onRegistered?: () => void;
}

type MobilePosTab = 'catalog' | 'checkout';

export function DailyRegisterView({ onRegistered }: DailyRegisterViewProps) {
  const { t } = useTranslation('pos');
  const [mobileTab, setMobileTab] = useState<MobilePosTab>('catalog');
  const {
    isElevated,
    lockedMesaLabel,
    services,
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
  } = useDailyRegisterForm({ onRegistered });

  return (
    <div className="relative flex flex-1 flex-col gap-4 lg:min-h-0">
      {(errorMessage || successMessage) && (
        <div className="shrink-0 space-y-2">
          {errorMessage ? <AlertBanner message={errorMessage} /> : null}
          {successMessage ? (
            <AlertBanner message={successMessage} tone="success" />
          ) : null}
        </div>
      )}

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('catalog')}
          className={[
            'min-h-[44px] rounded-xl px-3 text-xs font-bold',
            mobileTab === 'catalog'
              ? 'bg-brand text-white'
              : 'border border-slate-border bg-white text-slate-heading',
          ].join(' ')}
        >
          {t('select_services')}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('checkout')}
          className={[
            'min-h-[44px] rounded-xl px-3 text-xs font-bold',
            mobileTab === 'checkout'
              ? 'bg-brand text-white'
              : 'border border-slate-border bg-white text-slate-heading',
          ].join(' ')}
        >
          {t('view_ticket', { amount: formatMoney(totals.totalPaid) })}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 pb-24 sm:pb-0 lg:min-h-0 lg:flex-row">
        <div
          className={[
            'flex min-h-[280px] flex-1',
            mobileTab === 'catalog' ? 'flex' : 'hidden',
            'sm:flex',
            'lg:min-h-0',
          ].join(' ')}
        >
          <ServiceCatalogPanel
            services={services}
            categories={categories}
            search={search}
            category={category}
            isLoading={isLoadingServices}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onAddService={addService}
          />
        </div>
        <div
          className={[
            'flex min-h-[420px] flex-1 lg:min-h-0 lg:flex-none',
            mobileTab === 'checkout' ? 'flex' : 'hidden',
            'sm:flex',
          ].join(' ')}
        >
          <RegisterCheckoutPanel
            cart={cart}
            clientName={clientName}
            discountInput={discountInput}
            paymentMethod={paymentMethod}
            totals={totals}
            isSubmitting={isSubmitting}
            isElevated={isElevated}
            lockedMesaLabel={lockedMesaLabel}
            mesaUsers={mesaUsers}
            selectedMesaUserId={selectedMesaUserId}
            onMesaUserChange={setSelectedMesaUserId}
            onClientNameChange={setClientName}
            onDiscountInputChange={setDiscountInput}
            onPaymentMethodChange={setPaymentMethod}
            onQuantityChange={updateQuantity}
            onRemoveItem={removeItem}
            onSubmit={submit}
          />
        </div>
      </div>

      {mobileTab === 'catalog' ? (
        <button
          type="button"
          onClick={() => setMobileTab('checkout')}
          className="fixed inset-x-4 bottom-4 z-20 min-h-[44px] rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg sm:hidden"
        >
          {t('view_ticket', { amount: formatMoney(totals.totalPaid) })}
        </button>
      ) : null}
    </div>
  );
}
