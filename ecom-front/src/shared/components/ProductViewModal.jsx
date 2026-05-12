import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingBag, Loader2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAppData } from "../../app/context/AppDataContext";
import { normalizeImageUrl } from "../utils/imageUrl";

const DEFAULT_IMAGE = "http://localhost:5000/images/default.png";

function ProductViewModal({ open, setOpen, product, isAvailable }) {
  const { addToCartItem } = useAppData();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setSelectedQuantity(1);
    }
  }, [open, product?.id, product?.productId]);

  if (!open) return null;

  const closeModal = (event) => {
    if (event) event.stopPropagation();
    setOpen(false);
  };

  const resolvedImage = normalizeImageUrl(product?.image) || DEFAULT_IMAGE;
  const maxQuantity = Math.max(1, Number(product?.quantity ?? 1));
  const hasDiscount =
    Number(product?.specialPrice ?? product?.price ?? 0) < Number(product?.price ?? 0);

  const handleAddToCart = async () => {
    if (!isAvailable || isAdding) return;
    setIsAdding(true);
    try {
      const result = await addToCartItem({ ...product }, selectedQuantity);
      if (!result?.success) {
        toast.error(result?.message || "Failed to add product.");
        return;
      }
      toast.success(result?.message || "Added to cart.");
      setOpen(false);
    } finally {
      setIsAdding(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 transition-opacity"
        onClick={closeModal}
        aria-label="Close product view"
      />

      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close product view"
          className="absolute right-6 top-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:text-orange-600 shadow-sm flex items-center justify-center border border-slate-200 transition-all hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-teal-500/5 blur-3xl rounded-full scale-75" />
            <img
              src={resolvedImage}
              alt={product?.productName}
              className="relative w-full h-[300px] md:h-[400px] object-contain mix-blend-multiply transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              {product?.productName || "Product Name"}
            </h2>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {product?.description || "Experience top-tier quality and design with our latest offering."}
          </p>

          <div className="flex items-center gap-4 mb-8">
            {hasDiscount ? (
              <>
                <span className="text-4xl font-black text-teal-600">
                  ${Number(product?.specialPrice).toFixed(2)}
                </span>
                <span className="text-lg font-bold text-slate-300 line-through">
                  ${Number(product?.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-slate-900">
                ${Number(product?.price ?? 0).toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
                disabled={!isAvailable || isAdding || selectedQuantity <= 1}
                className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-8 text-center text-lg font-black text-slate-900">
                {selectedQuantity}
              </span>
              <button
                type="button"
                onClick={() => setSelectedQuantity((prev) => Math.min(maxQuantity, prev + 1))}
                disabled={!isAvailable || isAdding || selectedQuantity >= maxQuantity}
                className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`group relative h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
              ${
                isAvailable
                  ? "bg-teal-600 text-white shadow-xl shadow-teal-100 hover:bg-teal-700 hover:-translate-y-1"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            {isAdding ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ShoppingBag size={20} className="group-hover:animate-bounce" />
            )}
            {isAdding ? "Processing..." : isAvailable ? "Add To Cart" : "Currently Unavailable"}

            {isAvailable && !isAdding && (
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ProductViewModal;
