import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { api } from "../../../services/api/api";
import { extractOrdersList, resolveOrderId, resolveOrderStatus, resolveOrderTotal } from "../../../shared/utils/orderData";
import AddressDetailsModal from "../components/AddressDetailsModal";
import DashboardSummaryCards from "../components/DashboardSummaryCards";
import OrdersTable from "../components/OrdersTable";

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusOverrides, setStatusOverrides] = useState({});
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const { data } = await api.get("/orders");
        setOrders(extractOrdersList(data));
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || error?.message || "SYNC_ERROR");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const resolveUiStatus = (order) => {
    const orderId = String(resolveOrderId(order));
    return statusOverrides[orderId] || resolveOrderStatus(order);
  };

  const updateUiStatus = (order, nextStatus) => {
    const orderId = String(resolveOrderId(order));
    setStatusOverrides((prev) => ({ ...prev, [orderId]: nextStatus }));
  };

  const summary = useMemo(() => {
    const getStatus = (order) =>
      String(
        statusOverrides[String(resolveOrderId(order))] || resolveOrderStatus(order) || ""
      ).toLowerCase();
    const isDeclined = (status) =>
      status.includes("decline") || status.includes("reject") || status.includes("cancel");
    const isAccepted = (status) =>
      ["order accepted", "accepted", "completed", "delivered", "paid"].includes(status);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const status = getStatus(order);
      return isDeclined(status) ? sum : sum + resolveOrderTotal(order);
    }, 0);
    const settledOrders = orders.filter((order) => isAccepted(getStatus(order))).length;
    const declinedOrders = orders.filter((order) => isDeclined(getStatus(order))).length;
    return {
      totalOrders,
      totalRevenue,
      settledOrders,
      pendingOrders: Math.max(totalOrders - settledOrders - declinedOrders, 0),
      declinedOrders,
    };
  }, [orders, statusOverrides]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
        String(resolveOrderId(o)).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(o?.paymentDTO?.paymentMethod || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const extractAddressesList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.content)) return payload.content;
    if (Array.isArray(payload.addresses)) return payload.addresses;
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.data && Array.isArray(payload.data.content)) return payload.data.content;
    if (payload.data && Array.isArray(payload.data.addresses)) return payload.data.addresses;
    return [];
  };

  const openAddressById = async (addressId) => {
    if (!addressId) return;
    setAddressModalOpen(true);
    setIsAddressLoading(true);
    setAddressError("");
    setSelectedAddress(null);
    try {
      const { data } = await api.get("/addresses");
      const matched = extractAddressesList(data).find(
        (a) => String(a?.addressId ?? a?.id ?? "") === String(addressId)
      );
      matched ? setSelectedAddress(matched) : setAddressError("Address Node Not Found.");
    } catch {
      setAddressError("API Connection Failure.");
    }
    finally { setIsAddressLoading(false); }
  };

  return (
      <section className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* --- DYNAMIC HEADER --- */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <ShieldCheck className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
                    order management
                  </h1>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input
                  type="text"
                  placeholder="SEARCH_ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80 h-14 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 shadow-sm transition-all"
              />
            </div>
          </header>

          {/* --- STATS COMPONENT --- */}
          <DashboardSummaryCards summary={summary} />

          {/* --- TABLE SECTION --- */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Order Registry</h2>
              <span className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Total Entries: {filteredOrders.length}
            </span>
            </div>

            {isLoading ? (
                <div className="p-20 text-center font-black italic text-teal-600 animate-pulse tracking-widest uppercase">Initializing_Data...</div>
            ) : errorMessage ? (
                <div className="p-20 text-center">
                  <p className="font-black text-rose-500 uppercase italic">Connection_Interrupted</p>
                  <p className="text-slate-400 text-xs font-bold mt-2">{errorMessage}</p>
                </div>
            ) : (
                <OrdersTable
                    orders={filteredOrders}
                    resolveStatus={resolveUiStatus}
                    onAccept={(order) => updateUiStatus(order, "Order Accepted")}
                    onDecline={(order) => updateUiStatus(order, "Order Declined")}
                    onAddressClick={openAddressById}
                    formatDate={formatDate}
                />
            )}
          </div>
        </div>

        <AddressDetailsModal
            isOpen={addressModalOpen}
            isLoading={isAddressLoading}
            errorMessage={addressError}
            address={selectedAddress}
            onClose={() => {
              setAddressModalOpen(false);
              setSelectedAddress(null);
              setAddressError("");
            }}
        />
      </section>
  );
}

export default DashboardPage;
