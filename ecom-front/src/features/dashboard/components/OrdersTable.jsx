import { formatPrice } from "../../../shared/utils/formatPrice";
import {
  resolveOrderDate,
  resolveOrderEmail,
  resolveOrderId,
  resolveOrderItems,
  resolveOrderTotal,
} from "../../../shared/utils/orderData";

function OrdersTable({
  orders,
  resolveStatus,
  onAccept,
  onDecline,
  onAddressClick,
  formatDate,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Order</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Email</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Items</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Date</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Payment</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Status</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Action</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider">Address</th>
            <th className="text-right px-4 py-3 font-bold uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const orderId = resolveOrderId(order);
            const items = resolveOrderItems(order);
            const uiStatus = String(resolveStatus(order) || "");
            const statusLower = uiStatus.toLowerCase();
            const statusClass = statusLower.includes("decline")
              ? "bg-rose-100 text-rose-700"
              : statusLower.includes("accepted") ||
                  statusLower.includes("completed") ||
                  statusLower.includes("delivered") ||
                  statusLower.includes("paid")
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700";

            return (
              <tr key={`${orderId}-${index}`} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  #{String(orderId).slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {resolveOrderEmail(order) || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <div className="max-w-[220px]">
                    <p className="font-semibold">{items.length} item(s)</p>
                    <p className="text-xs text-slate-500 truncate">
                      {items
                        .map((item) => item?.productDTO?.productName || item?.productName || "Product")
                        .join(", ")}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{formatDate(resolveOrderDate(order))}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
                    {order?.paymentDTO?.paymentMethod || "N/A"}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {order?.paymentDTO?.pgStatus || "UNKNOWN"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusClass}`}>
                    {uiStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAccept(order)}
                      className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onDecline(order)}
                      className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Decline
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {order?.addressId ? (
                    <button
                      type="button"
                      onClick={() => onAddressClick(order.addressId)}
                      className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      {order.addressId}
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-4 py-3 text-right font-black text-slate-900">
                  {formatPrice(resolveOrderTotal(order))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;

