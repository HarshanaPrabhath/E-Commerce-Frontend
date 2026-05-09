import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdReceiptLong, MdArrowBack, MdCircle } from "react-icons/md";
import { formatPrice } from "../../../shared/utils/formatPrice";

const formatDate = (value) => {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function OrdersPage() {
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  const customerOrders = (orders ?? []).filter(
    (order) => order.userId === user?.userId
  );

  return (
    <div className="lg:px-20 sm:px-10 px-4 py-16 min-h-screen bg-[#fcfcfc]">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-teal-600 rounded-2xl shadow-xl shadow-teal-100">
              <MdReceiptLong size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Order History
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Manage and track your recent purchases, <span className="text-teal-600">{user?.username}</span>
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors group"
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
        </div>

        {!customerOrders.length ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <MdReceiptLong size={40} className="text-slate-300" />
            </div>
            <p className="text-2xl font-black text-slate-800">No orders found</p>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Looks like you haven't placed any orders yet. Start shopping to fill this space!
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-3 bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {customerOrders.map((order) => (
              <article
                key={order.orderId}
                className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-orange-100 transition-all duration-300 group"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/50 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Order ID</p>
                      <p className="text-slate-900 font-black tracking-tight">#{order.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Date Placed</p>
                      <p className="text-slate-700 font-bold">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'paid'
                    ? 'bg-teal-50 text-teal-600' 
                    : 'bg-orange-50 text-orange-600'
                  }`}>
                    <MdCircle size={8} className="animate-pulse" />
                    {order.status || 'Processing'}
                  </div>
                </div>

                {/* Items List */}
                <div className="px-8 py-6 space-y-4">
                  {(order.items ?? []).map((item, idx) => (
                    <div
                      key={`${order.orderId}-${item.productId}-${idx}`}
                      className="flex items-center justify-between group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-teal-600 text-xs">
                          {item.quantity}x
                        </div>
                        <p className="font-bold text-slate-700 group-hover/item:text-teal-700 transition-colors">
                          {item.productName}
                        </p>
                      </div>
                      <p className="font-black text-slate-900">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Details */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 grid sm:grid-cols-2 items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Email</p>
                    <p className="text-sm font-medium text-slate-600">{order.billingEmail}</p>
                    <p className="text-xs text-slate-400 font-medium">Method: <span className="uppercase">{order.paymentMethod}</span></p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-teal-900 tracking-tighter">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;