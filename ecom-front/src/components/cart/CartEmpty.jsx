import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="min-h-[800px] flex flex-col justify-center">
      <div className="flex flex-col items-center">
        <MdShoppingCart size={80} className="mb-4 text-slate-800" />
      <div className="text-3xl font-bold text-slate-700">
        Your cart is empty
      </div>
       <div className="text-lg mt-3 font-bold text-slate-700">
        Add some products to get started      </div>
      </div>

      <div className="mt-6">
<Link className="flex gap-2 justify-center text-blue-500 hover:text-blue-600 duration-300" to="/"><MdArrowBack size={24}/>
Start Shopping
</Link>
      </div>
    </div>
  );
};

export default CartEmpty;
