import { BiMessageError } from "react-icons/bi";
import ProductCard from "../../../shared/components/ProductCard";
import Loader from "../../../shared/components/Loader";

function ProductsContent({ errorMessage, isLoadingProducts, products, adminView, onClearFilters }) {
  if (errorMessage) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px] gap-4 bg-rose-50 rounded-[3rem] border border-rose-100">
        <BiMessageError className="text-rose-500 text-6xl animate-bounce" />
        <span className="text-rose-900 text-xl font-black italic tracking-tighter uppercase">
          {errorMessage}
        </span>
      </div>
    );
  }

  if (isLoadingProducts) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white rounded-[3rem] border border-slate-100">
        <Loader text="CURATING ARTIFACTS" />
      </div>
    );
  }

  return (
    <div className="min-h-[600px]">
      {products.length ? (
        <div className="pb-16 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-8 gap-y-12">
          {products.map((item) => (
            <ProductCard key={item.productId} {...item} adminView={adminView} />
          ))}
        </div>
      ) : (
        <div className="h-[500px] flex items-center justify-center bg-white rounded-[3rem] border border-slate-100">
          <div className="text-center space-y-4">
            <div className="text-8xl font-black text-slate-100 tracking-tighter italic">VOID</div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
              No results match your current filters.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-teal-600 font-black uppercase tracking-widest text-[10px] hover:text-orange-500 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsContent;
