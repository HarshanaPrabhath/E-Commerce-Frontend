import { MdPayment } from "react-icons/md";

function PaymentStep({
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
  onContinue,
}) {
  return (
    <>
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <MdPayment className="text-teal-600" />
        Payment Details
      </h2>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Card Holder Name"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(digitsOnly(e.target.value).slice(0, 19))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Exp Month"
            value={expMonth}
            onChange={(e) => setExpMonth(digitsOnly(e.target.value).slice(0, 2))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Exp Year"
            value={expYear}
            onChange={(e) => setExpYear(digitsOnly(e.target.value).slice(0, 4))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="password"
            inputMode="numeric"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(digitsOnly(e.target.value).slice(0, 4))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl"
      >
        Continue to Delivery Address
      </button>
    </>
  );
}

export default PaymentStep;
