import { formatPrice } from "../../../shared/utils/formatPrice";

function ReviewStep({
  paymentMethod,
  selectedAddress,
  buildAddressLabel,
  totalPrice,
  onBackAddress,
  onPlaceOrder,
  isPlacingOrder,
  isLoadingCart,
}) {
  return (
    <>
      <h2 className="text-xl font-black text-slate-900">Place Order</h2>
      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-bold text-slate-800">Payment Method:</span>{" "}
          {paymentMethod}
        </p>
        <p>
          <span className="font-bold text-slate-800">Delivery Address:</span>{" "}
          {selectedAddress ? buildAddressLabel(selectedAddress) : "-"}
        </p>
        <p>
          <span className="font-bold text-slate-800">Total Amount:</span>{" "}
          {formatPrice(totalPrice)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackAddress}
          className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
        >
          Back to Address
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || isLoadingCart}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold disabled:opacity-60"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </>
  );
}

export default ReviewStep;
