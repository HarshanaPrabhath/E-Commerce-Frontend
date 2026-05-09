import { MdCheckCircle } from "react-icons/md";

function CheckoutHeader() {
  return (
    <div className="flex items-center gap-3">
      <MdCheckCircle className="text-teal-600" size={28} />
      <h1 className="text-3xl font-black text-slate-900">Checkout Flow</h1>
    </div>
  );
}

export default CheckoutHeader;
