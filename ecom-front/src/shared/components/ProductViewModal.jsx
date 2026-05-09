import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { ShoppingBag, ArrowUpRight, Loader2 } from "lucide-react";
import ProductViewModal from "./ProductViewModal";
import { truncateText } from "../utils/truncateText";
import { addToCart } from "./../../store/actions/index";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const ProductCard = ({
                       productId,
                       productName,
                       category,
                       categoryName,
                       image,
                       description,
                       quantity,
                       price,
                       discount,
                       specialPrice,
                       about = false,
                       adminView = false,
                     }) => {
  const [openProductViewModel, setOpenProductViewModel] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const isAvailable = quantity && Number(quantity) > 0;

  const resolvedCategoryName =
      categoryName || category?.categoryName || category?.name || "General";

  const dispatch = useDispatch();

  const handleProductView = () => {
    if (!about) {
      setOpenProductViewModel(true);
    }
  };

  const addToCartHandler = async (e) => {
    e.stopPropagation(); // Prevents triggering the modal
    if (btnLoader || !isAvailable) return;

    setBtnLoader(true);
    try {
      await dispatch(addToCart({
        productId, productName, image, description, quantity, price, discount, specialPrice
      }, 1, toast));
    } finally {
      setBtnLoader(false);
    }
  };

  return (
      <div
          onClick={handleProductView}
          className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-transparent hover:border-slate-100 cursor-pointer"
      >
        {/* Image Gallery Container */}
        <div className="relative aspect-[1/1] overflow-hidden rounded-[2rem] bg-[#f9f9f9]">
          <img
              src={image || "http://localhost:5000/images/default.png"}
              alt={productName}
              className="w-full h-full object-contain p-4 transition-transform duration-700 scale-95 group-hover:scale-105"
          />

          {/* Hover Overlay - Quick Actions */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Availability Tag */}
          {!isAvailable && (
              <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 flex items-center justify-center">
            <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              Stock Out
            </span>
              </div>
          )}

          {/* Floating Add to Cart (Desktop) */}
          {isAvailable && !adminView && !about && (
              <button
                  onClick={addToCartHandler}
                  disabled={btnLoader}
                  className="absolute bottom-4 right-4 w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 disabled:bg-slate-400"
              >
                {btnLoader ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <ShoppingBag size={20} />
                )}
              </button>
          )}
        </div>

        {/* Product Details */}
        <div className="mt-6 px-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1">
                {resolvedCategoryName}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {truncateText(productName, 40)}
              </h2>
            </div>
            <div className="flex flex-col items-end">
              {specialPrice ? (
                  <>
                <span className="text-xs text-slate-400 line-through font-bold">
                  ${Number(price).toFixed(2)}
                </span>
                    <span className="text-xl font-black text-slate-900">
                  ${Number(specialPrice).toFixed(2)}
                </span>
                  </>
              ) : (
                  <span className="text-xl font-black text-slate-900">
                ${Number(price).toFixed(2)}
              </span>
              )}
            </div>
          </div>

          {/* Description Snippet */}
          <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
            {truncateText(description, 80)}
          </p>

          {/* View Details Link */}
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-slate-400 group-hover:text-orange-500 transition-colors">
            <span className="text-[10px] font-black uppercase tracking-widest">Full Specs</span>
            <ArrowUpRight size={14} className="ml-1 translate-y-0.5" />
          </div>
        </div>

        {/* Modal */}
        <ProductViewModal
            open={openProductViewModel}
            setOpen={setOpenProductViewModel}
            product={{
              id: productId,
              productName,
              categoryName: resolvedCategoryName,
              image,
              description,
              quantity,
              price,
              discount,
              specialPrice,
            }}
            isAvailable={isAvailable}
        />
      </div>
  );
};

export default ProductCard;