import CheckoutCartSummary from "../components/CheckoutCartSummary";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutStepPanel from "../components/CheckoutStepPanel";
import CheckoutSteps from "../components/CheckoutSteps";
import useCheckoutFlow from "../hooks/useCheckoutFlow";

function CheckoutPage() {
  const {
    step,
    setStep,
    isLoadingCart,
    isLoadingAddresses,
    isSavingAddress,
    isPlacingOrder,
    paymentMethod,
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
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addressForm,
    setAddressForm,
    totalPrice,
    selectedAddress,
    buildAddressLabel,
    digitsOnly,
    cart,
    handleContinueToAddress,
    handleAddAddress,
    handleContinueToReview,
    handlePlaceOrder,
  } = useCheckoutFlow();

  return (
    <div className="lg:px-20 sm:px-10 px-4 py-16 min-h-screen bg-[#fcfcfc]">
      <div className="max-w-6xl mx-auto space-y-8">
        <CheckoutHeader />

        <CheckoutSteps step={step} setStep={setStep} />

        <div className="grid lg:grid-cols-5 gap-8">
          <CheckoutStepPanel
            step={step}
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
            onContinueToAddress={handleContinueToAddress}
            isLoadingAddresses={isLoadingAddresses}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            buildAddressLabel={buildAddressLabel}
            addressForm={addressForm}
            setAddressForm={setAddressForm}
            isSavingAddress={isSavingAddress}
            onAddAddress={handleAddAddress}
            onContinueToReview={handleContinueToReview}
            paymentMethod={paymentMethod}
            selectedAddress={selectedAddress}
            totalPrice={totalPrice}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            isLoadingCart={isLoadingCart}
            setStep={setStep}
          />

          <CheckoutCartSummary
            isLoadingCart={isLoadingCart}
            cart={cart}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
