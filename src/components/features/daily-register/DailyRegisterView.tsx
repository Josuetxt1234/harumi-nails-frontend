import { useDailyRegisterForm } from '../../../hooks/useDailyRegisterForm';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { RegisterCheckoutPanel } from './RegisterCheckoutPanel';
import { ServiceCatalogPanel } from './ServiceCatalogPanel';

export interface DailyRegisterViewProps {
  requireMesaSelection?: boolean;
}

export function DailyRegisterView({
  requireMesaSelection = false,
}: DailyRegisterViewProps) {
  const {
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
  } = useDailyRegisterForm({ requireMesaSelection });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {(errorMessage || successMessage) && (
        <div className="shrink-0 space-y-2">
          {errorMessage ? <AlertBanner message={errorMessage} /> : null}
          {successMessage ? (
            <AlertBanner message={successMessage} tone="success" />
          ) : null}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
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
        <RegisterCheckoutPanel
          cart={cart}
          clientName={clientName}
          discountAmount={discountAmount}
          hasCardFee={hasCardFee}
          paymentMethod={paymentMethod}
          totals={totals}
          isSubmitting={isSubmitting}
          showMesaSelector={requireMesaSelection}
          mesaUsers={mesaUsers}
          selectedMesaUserId={selectedMesaUserId}
          onMesaUserChange={setSelectedMesaUserId}
          onClientNameChange={setClientName}
          onDiscountChange={setDiscountAmount}
          onHasCardFeeChange={setHasCardFee}
          onPaymentMethodChange={setPaymentMethod}
          onQuantityChange={updateQuantity}
          onRemoveItem={removeItem}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
