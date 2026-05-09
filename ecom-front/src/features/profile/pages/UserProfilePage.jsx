import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowBack, MdShoppingBag, MdPerson } from "react-icons/md";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { api } from "../../../services/api/api";
import { useAppData } from "../../../app/context/AppDataContext";
import {
  resolveCurrentUserEmail,
  extractOrdersList,
  resolveCurrentUserId,
  resolveOrderDate,
  resolveOrderEmail,
  resolveOrderId,
  resolveOrderItems,
  resolveOrderTotal,
  resolveOrderUserId,
} from "../../../shared/utils/orderData";

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function UserProfilePage() {
  const { user } = useAppData();
  const loggedUser = user?.user || user;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUserId = useMemo(() => resolveCurrentUserId(loggedUser), [loggedUser]);
  const currentUserEmail = useMemo(() => resolveCurrentUserEmail(loggedUser), [loggedUser]);
  const username = loggedUser?.username || "User";
  const email = currentUserEmail || loggedUser?.email || "N/A";

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const { data } = await api.get("/orders");
        setOrders(extractOrdersList(data));
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load orders."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const userOrders = useMemo(
    () => {
      if (currentUserEmail) {
        return orders.filter(
          (order) => resolveOrderEmail(order) === currentUserEmail
        );
      }
      return orders.filter(
        (order) =>
          String(resolveOrderUserId(order) ?? "") === String(currentUserId ?? "")
      );
    },
    [orders, currentUserEmail, currentUserId]
  );

  const totalSpent = useMemo(
    () => userOrders.reduce((sum, order) => sum + resolveOrderTotal(order), 0),
    [userOrders]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/products"
            className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-slate-500 hover:text-teal-600 hover:border-teal-100 transition-all group"
          >
            <MdArrowBack size={18} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl flex items-center justify-center text-white mb-6">
                <MdPerson size={40} />
              </div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Name</p>
              <p className="font-black text-slate-900 text-xl">{username}</p>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-4">Email</p>
              <p className="font-bold text-slate-700 break-all">{email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-600 rounded-[2rem] p-6 text-white">
                <MdShoppingBag size={24} className="mb-3 text-teal-100" />
                <p className="text-2xl font-black">{userOrders.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest">Total Orders</p>
              </div>
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Spent</p>
                <p className="text-xl font-black mt-2">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Your Orders</h2>

            {isLoading ? (
              <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center font-bold text-slate-600">
                Loading orders...
              </div>
            ) : errorMessage ? (
              <div className="bg-white border border-rose-200 rounded-[2rem] p-12 text-center">
                <p className="font-black text-rose-700">Could not load orders</p>
                <p className="text-slate-500 mt-2">{errorMessage}</p>
              </div>
            ) : !userOrders.length ? (
              <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center font-bold text-slate-500">
                No orders found for this user.
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order, index) => {
                  const orderId = resolveOrderId(order);
                  const items = resolveOrderItems(order);
                  return (
                    <article
                      key={`${orderId}-${index}`}
                      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden"
                    >
                      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Order ID</p>
                          <p className="font-black text-slate-900">#{String(orderId).slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-slate-600 font-bold">{formatDate(resolveOrderDate(order))}</p>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-slate-50/60 border-y border-slate-100 space-y-3">
                        {items.map((item, idx) => (
                          <div
                            key={`${orderId}-${item?.productId || item?.productDTO?.productId || idx}-${idx}`}
                            className="flex items-center justify-between"
                          >
                            <p className="text-slate-700 font-semibold">
                              {item?.productName || item?.name || item?.productDTO?.productName || "Product"} x{item?.quantity || 0}
                            </p>
                            <p className="font-black text-slate-900">
                              {formatPrice(
                                Number(
                                  item?.lineTotal ??
                                    item?.orderedProductPrice ??
                                    Number(
                                      item?.unitPrice ??
                                        item?.productDTO?.specialPrice ??
                                        item?.productDTO?.price ??
                                        0
                                    ) * Number(item?.quantity ?? 0)
                                )
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="px-6 py-4 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-semibold">
                          Billing: {resolveOrderEmail(order) || "N/A"}
                        </p>
                        <p className="font-black text-teal-700 text-xl">{formatPrice(resolveOrderTotal(order))}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
