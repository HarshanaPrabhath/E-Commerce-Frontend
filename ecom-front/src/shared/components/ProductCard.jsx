import { useState } from "react";
import { ShoppingBag, Loader2, Star, ArrowUpRight } from "lucide-react";
import ProductViewModal from "./ProductViewModal";
import { truncateText } from "../utils/truncateText";
import toast from "react-hot-toast";
import { useAppData } from "../../app/context/AppDataContext";
import { normalizeImageUrl } from "../utils/imageUrl";

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

  const { addToCartItem } = useAppData();

  const handleProductView = () => {
    if (!about) {
      setOpenProductViewModel(true);
    }
  };

  const addToCartHandler = async (e) => {
    e.stopPropagation(); // Prevents opening modal when clicking button
    if (btnLoader || !isAvailable) return;

    setBtnLoader(true);
    try {
      const result = await addToCartItem({
        productId, productName, image, description, quantity, price, discount, specialPrice
      }, 1);
      if (!result?.success) {
        toast.error(result?.message || "Failed to add product.");
        return;
      }
      toast.success(result?.message || "Added to cart.");
    } finally {
      setBtnLoader(false);
    }
  };

  const resolvedImage = normalizeImageUrl(image) || "http://localhost:5000/images/default.png";

  return (
      <div
          onClick={handleProductView}
          className="group relative bg-white rounded-[2.5rem] p-3 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(20,184,166,0.15)] border border-transparent hover:border-teal-100 cursor-pointer"
      >
        {/* --- IMAGE SECTION --- */}
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#fdfdfd] border border-slate-50">
          <img
              src={resolvedImage}
              alt={productName}
              className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {specialPrice && (
                <span></span>
            )}
            {!isAvailable && (
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
              Sold Out
            </span>
            )}
          </div>

          {/* Floating Teal Add to Cart Button */}
          {isAvailable && !adminView && !about && (
              <button
                  onClick={addToCartHandler}
                  disabled={btnLoader}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-teal-200 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 active:scale-90"
              >
                {btnLoader ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <ShoppingBag size={18} />
                )}
              </button>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="mt-5 px-3 pb-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">
            {truncateText(productName, 35)}
          </h2>

          <p className="mt-2 text-slate-500 text-xs leading-relaxed line-clamp-2">
            {truncateText(description, 70)}
          </p>

          {/* --- PRICING SECTION --- */}
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex flex-col">
              {specialPrice ? (
                  <>
                <span className="text-[10px] text-slate-400 line-through font-bold leading-none">
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

            <div className="flex items-center text-orange-500 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Details <ArrowUpRight size={14} className="ml-0.5" />
            </div>
          </div>
        </div>

        <ProductViewModal
            open={openProductViewModel}
            setOpen={setOpenProductViewModel}
            product={{
              id: productId,
              productName,
              categoryName: resolvedCategoryName,
              image: resolvedImage,
              description,
              quantity,
              price,
              discount,
              specialPrice,
            }}
            isAvailable={isAvailable}
        />      </div>
  );
};

export default ProductCard;
