import { Package, Clock3, CircleCheckBig, Activity } from "lucide-react";
import { formatPrice } from "../../../shared/utils/formatPrice";

function DashboardSummaryCards({ summary }) {
    const cardData = [
        {
            label: "Total Orders",
            value: summary.totalOrders,
            icon: Package,
            color: "text-slate-400",
            bg: "bg-white",
            isPrimary: false,
        },
        {
            label: "Total Revenue",
            value: formatPrice(summary.totalRevenue),
            icon: "Rs.", // Custom String Icon
            color: "text-orange-500",
            bg: "bg-slate-900",
            isPrimary: true,
        },
        {
            label: "Settled Orders",
            value: summary.settledOrders ?? 0,
            icon: CircleCheckBig,
            color: "text-teal-500",
            bg: "bg-white",
            isPrimary: false,
        },
        {
            label: "Decline Orders",
            value: summary.declinedOrders,
            icon: Clock3,
            color: "text-orange-600",
            bg: "bg-white",
            isPrimary: false,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, idx) => {
                const Icon = card.icon;

                return (
                    <article
                        key={idx}
                        className={`relative overflow-hidden p-6 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border ${
                            card.isPrimary
                                ? "bg-slate-900 border-slate-800 shadow-2xl shadow-orange-950/20"
                                : "bg-white border-slate-100 shadow-sm"
                        } group`}
                    >
                        {card.isPrimary && (
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none" />
                        )}

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between">
                                {/* DYNAMIC ICON CONTAINER */}
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] ${
                                        card.isPrimary ? "bg-white/10" : "bg-slate-50"
                                    } ${card.color}`}
                                >
                                    {typeof Icon === "string" ? (
                                        <span className="text-sm font-black italic tracking-tighter">
                                            {Icon}
                                        </span>
                                    ) : (
                                        <Icon size={22} />
                                    )}
                                </div>

                                {card.isPrimary && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-teal-500/10 rounded-lg">
                                        <Activity size={12} className="text-teal-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest">Live_Sync</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                <p
                                    className={`text-3xl font-black tracking-tighter italic leading-none truncate ${
                                        card.isPrimary ? "text-white" : "text-slate-900"
                                    }`}
                                >
                                    {card.value}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4 flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${card.isPrimary ? 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-teal-500'}`} />
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export default DashboardSummaryCards;
