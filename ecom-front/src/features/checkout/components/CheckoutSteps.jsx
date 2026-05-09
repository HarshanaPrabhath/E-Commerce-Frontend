function CheckoutSteps({ step, setStep }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 flex flex-wrap gap-4">
      <button
        type="button"
        onClick={() => setStep("payment")}
        className={`px-4 py-2 rounded-xl text-sm font-bold ${
          step === "payment" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        1. Make Payment
      </button>
      <button
        type="button"
        onClick={() => step !== "payment" && setStep("address")}
        className={`px-4 py-2 rounded-xl text-sm font-bold ${
          step === "address" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        2. Delivery Address
      </button>
      <button
        type="button"
        onClick={() => step === "review" && setStep("review")}
        className={`px-4 py-2 rounded-xl text-sm font-bold ${
          step === "review" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        3. Place Order
      </button>
    </div>
  );
}

export default CheckoutSteps;
