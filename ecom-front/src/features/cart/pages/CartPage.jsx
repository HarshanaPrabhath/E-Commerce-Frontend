import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ItemContent from "../components/ItemContent";
import CartEmpty from "../components/CartEmpty";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { fetchUserCart } from "../../../store/actions";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.carts);
  const { user } = useSelector((state) => state.auth);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        return;
      }
      setIsLoadingCart(true);
      await dispatch(fetchUserCart(toast));
      setIsLoadingCart(false);
    };

    loadCart();
  }, [dispatch, user]);

  const totalPrice = cart?.reduce(
    (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity), 0
  ) ?? 0;

  if (isLoadingCart) {
    return (
      <div className="lg:px-20 sm:px-10 px-4 py-16 bg-[#fcfcfc] min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-semibold">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="lg:px-20 sm:px-10 px-4 py-16 bg-[#fcfcfc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-start mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-600 rounded-2xl shadow-lg shadow-teal-200">
            <MdShoppingCart size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
        </div>
        <p className="text-slate-500 mt-3 ml-1 text-lg">
          You have <span className="text-teal-600 font-bold">{cart.length} items</span> in your selection
        </p>
      </div>

      {/* Table Header - Only visible on desktop */}
      <div className="hidden md:grid grid-cols-5 pb-6 border-b border-slate-200 font-black text-xs uppercase tracking-[0.2em] text-slate-400 items-center gap-4">
        <div className="col-span-2 justify-self-start">Product</div>
        <div className="justify-self-center">Price</div>
        <div className="justify-self-center">Quantity</div>
        <div className="justify-self-center text-right">Total</div>
      </div>

      {/* Cart Items List */}
      <div className="py-2">
        {cart.map((item, i) => (
          <ItemContent key={item.productId ?? i} {...item} />
        ))}
      </div>

      {/* Bottom Summary Section */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Secondary Action: Back to Shop */}
        <Link 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-teal-600 transition-colors group py-2" 
          to="/products"
        >
          <MdArrowBack className="group-hover:-translate-x-1 transition-transform duration-300" /> 
          Continue Shopping
        </Link>

        {/* Primary Action: Checkout Card */}
        <div className="w-full md:w-[420px] bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-3xl font-black text-teal-900 leading-none">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed border-b border-slate-50 pb-6">
              Taxes and shipping calculated at checkout.
            </p>

            <Link to="/checkout" className="block pt-2">
              <button
                className="w-full relative overflow-hidden group bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95"
              >
                {/* Subtle sheen effect on hover */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <MdShoppingCart size={22} className="relative z-10" />
                <span className="relative z-10">Proceed to Checkout</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
