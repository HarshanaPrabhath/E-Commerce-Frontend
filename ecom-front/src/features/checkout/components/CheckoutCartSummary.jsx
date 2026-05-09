import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { formatPrice } from "../../../shared/utils/formatPrice";

function CheckoutCartSummary({ isLoadingCart, cart, totalPrice }) {
  return (
    <aside className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 h-fit">
      <h2 className="text-xl font-black text-slate-900 mb-4">Cart Summary</h2>
      {isLoadingCart ? (
        <p className="text-slate-500">Loading cart...</p>
      ) : cart?.length ? (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between items-center gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 truncate">{item.productName}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-teal-700">
                {formatPrice(Number(item.specialPrice) * Number(item.quantity))}
              </p>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total</span>
            <span className="text-2xl font-black text-teal-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-slate-500">Your cart is empty.</p>
      )}

      <Link
        to="/cart"
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600"
      >
        <MdArrowBack />
        Back to Cart
      </Link>
    </aside>
  );
}

export default CheckoutCartSummary;
