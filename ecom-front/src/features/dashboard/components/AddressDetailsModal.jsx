import { X, MapPin, Cpu, Hash } from "lucide-react";

function AddressDetailsModal({
                                 isOpen,
                                 isLoading,
                                 errorMessage,
                                 address,
                                 onClose,
                             }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* High-End Backdrop Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transform transition-all">

                <div className="p-8 md:p-10">
                    {/* Top Bar */}
                    <div className="flex justify-between items-start mb-10">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                        >
                            <X className="text-slate-400 group-hover:text-rose-500 transition-colors" size={20} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[200px] flex flex-col justify-center">
                        {isLoading ? (
                            <div className="space-y-4 text-center animate-pulse">
                                <Cpu className="mx-auto text-teal-500 mb-2" size={32} />
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Processing_Query...</p>
                            </div>
                        ) : errorMessage ? (
                            <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 text-center">
                                <p className="text-sm font-black text-rose-600 uppercase italic tracking-widest">Access_Denied</p>
                                <p className="text-xs font-bold text-rose-400 mt-1">{errorMessage}</p>
                            </div>
                        ) : address ? (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {/* ID Card - Full Width */}
                                <div className="col-span-2 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                                    <Hash size={16} className="text-teal-500" />
                                    <div>
                                        <p>User Address Information </p>
                                    </div>
                                </div>

                                {/* Info Blocks */}
                                {[
                                    { label: "Locality / Street", val: address?.street },
                                    { label: "Building / Suite", val: address?.buildingName },
                                    { label: "City", val: address?.city },
                                    { label: "Region / State", val: address?.state },
                                    { label: "Geo Zone / Country", val: address?.country },
                                    { label: "Pincode", val: address?.pincode },
                                ].map((item, i) => (
                                    <div key={i} className="group border-l-2 border-slate-100 pl-4 hover:border-teal-500 transition-colors">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 group-hover:text-teal-600 transition-colors">
                                            {item.label}
                                        </p>
                                        <p className="font-bold text-slate-800 text-sm leading-tight">
                                            {item.val || "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">Null_Selection</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddressDetailsModal;