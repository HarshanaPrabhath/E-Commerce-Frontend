import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60 z-0" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Icon Container */}
        <div className="mb-8 p-8 bg-white rounded-[2.5rem] shadow-xl shadow-teal-100/50 text-teal-600 transform hover:rotate-12 transition-transform duration-500">
          <MdShoppingCart size={80} />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Your cart is <span className="text-teal-600">empty</span>
        </h1>
        <p className="text-lg mt-4 text-slate-500 max-w-[280px]">
          Looks like you hasn't added anything to your cart yet.
        </p>

        {/* Call to Action */}
        <div className="mt-10">
          <Link
            className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
            to="/"
          >
            <MdArrowBack 
              size={24} 
              className="group-hover:-translate-x-1 transition-transform" 
            />
            Start Shopping
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;