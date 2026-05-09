import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../../../shared/components/ProductCard";

function HomeLatestProductsSection({ isLoading, error, products }) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Latest Products
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-slate-900 text-white py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-colors"
        >
          View Catalog <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[420px] bg-white rounded-[2rem] border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-slate-600 text-center">{error}</p>
        </div>
      ) : products.length ? (
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-8">
          {products.slice(0, 8).map((item) => (
            <ProductCard key={item.productId ?? item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-slate-600">No products available.</p>
        </div>
      )}
    </section>
  );
}

export default HomeLatestProductsSection;
