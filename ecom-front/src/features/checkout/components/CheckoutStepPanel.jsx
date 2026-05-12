import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";

function CheckoutStepPanel({
  step,
  cardHolderName,
  setCardHolderName,
  cardNumber,
  setCardNumber,
  expMonth,
  setExpMonth,
  expYear,
  setExpYear,
  cvv,
  setCvv,
  digitsOnly,
  onContinueToAddress,
  isLoadingAddresses,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  buildAddressLabel,
  addressForm,
  setAddressForm,
  isSavingAddress,
  onAddAddress,
  onContinueToReview,
  paymentMethod,
  selectedAddress,
  totalPrice,
  onPlaceOrder,
  isPlacingOrder,
  isLoadingCart,
  setStep,
}) {
  return (
    <section className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6">
      {step === "payment" ? (
        <PaymentStep
          cardHolderName={cardHolderName}
          setCardHolderName={setCardHolderName}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expMonth={expMonth}
          setExpMonth={setExpMonth}
          expYear={expYear}
          setExpYear={setExpYear}
          cvv={cvv}
          setCvv={setCvv}
          digitsOnly={digitsOnly}
          onContinue={onContinueToAddress}
        />
      ) : null}

      {step === "address" ? (
        <AddressStep
          isLoadingAddresses={isLoadingAddresses}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          buildAddressLabel={buildAddressLabel}
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          isSavingAddress={isSavingAddress}
          onAddAddress={onAddAddress}
          onBackPayment={() => setStep("payment")}
          onContinueReview={onContinueToReview}
        />
      ) : null}

      {step === "review" ? (
        <ReviewStep
          paymentMethod={paymentMethod}
          selectedAddress={selectedAddress}
          buildAddressLabel={buildAddressLabel}
          totalPrice={totalPrice}
          onBackAddress={() => setStep("address")}
          onPlaceOrder={onPlaceOrder}
          isPlacingOrder={isPlacingOrder}
          isLoadingCart={isLoadingCart}
        />
      ) : null}
    </section>
  );
}

export default CheckoutStepPanel;
