import { useState } from "react";
import toast from "react-hot-toast";
import SetQuantity from "./SetQuantity";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { truncateText } from "../../../shared/utils/truncateText";
import { HiOutlineTrash } from "react-icons/hi"; // Adding a subtle icon for the remove button
import { useAppData } from "../../../app/context/AppDataContext";

const ItemContent = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  cartId,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { increaseCartItem, decreaseCartItem, removeCartItem } = useAppData();

  const productData = {
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    cartId,
  };

  const handleQtyIncrease = (cartItems) => {
    if (isUpdating) return;
    setIsUpdating(true);
    increaseCartItem(cartItems.productId)
      .then((result) => {
        if (!result?.success) {
          toast.error(result?.message || "Failed to update cart quantity.");
        }
      })
      .finally(() => setIsUpdating(false));
  };

  const handleQtyDecrease = (cartItems) => {
    if (isUpdating || Number(quantity) <= 1) return;
    setIsUpdating(true);
    decreaseCartItem(cartItems.productId)
      .then((result) => {
        if (!result?.success) {
          toast.error(result?.message || "Failed to update cart quantity.");
        }
      })
      .finally(() => setIsUpdating(false));
  };

  const removeItemFromCart = (cartItems) => {
    if (isUpdating) return;
    setIsUpdating(true);
    removeCartItem(cartItems)
      .then((result) => {
        if (!result?.success) {
          toast.error(result?.message || "Failed to remove cart item.");
        }
      })
      .finally(() => setIsUpdating(false));
  };

  return (
    <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center py-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-300">
      
      {/* Product Information Section */}
      <div className="md:col-span-2 justify-self-start flex items-center gap-4 lg:gap-6 px-2">
        <div className="shrink-0">
          <img
            src={image}
            alt={productName}
            className="md:h-28 md:w-28 h-16 w-16 object-cover rounded-2xl border border-slate-100 shadow-sm"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="lg:text-lg text-sm font-black text-teal-900 leading-tight">
            {truncateText(productName, 40)}
          </h3>
          <p className="text-xs text-slate-400 mb-2 hidden md:block">
            Quantity: {quantity}
          </p>
          
          <button
            onClick={() => removeItemFromCart(productData)}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors duration-200 text-xs font-bold uppercase tracking-widest"
          >
            <HiOutlineTrash size={16} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Unit Price */}
      <div className="justify-self-center">
        <span className="font-bold text-slate-600">
          {formatPrice(Number(specialPrice))}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="justify-self-center">
        <div className="scale-90 md:scale-100">
          <SetQuantity
            quantity={quantity}
            cardCounter
            handleQtyIncrease={() => handleQtyIncrease(productData)}
            handleQtyDecrease={() => handleQtyDecrease(productData)}
          />
        </div>
      </div>

      {/* Total Price for this item */}
      <div className="justify-self-center">
        <span className="lg:text-lg font-black text-teal-700">
          {formatPrice(Number(quantity) * Number(specialPrice))}
        </span>
      </div>
    </div>
  );
};

export default ItemContent;
