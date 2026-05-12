import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function HomeCategoriesSection({ isLoading, error, categories }) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Browse Categories
          </h2>
          <div className="h-1.5 w-20 bg-teal-600 rounded-full mt-3" />
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors"
        >
          See All <ArrowRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-slate-500">{error}</p>
      ) : categories.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.categoryId}
              to={`/products?category=${encodeURIComponent(category.categoryName)}`}
              className="h-24 rounded-2xl border border-slate-100 bg-white px-4 py-3 flex items-center justify-center text-center font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
            >
              {category.categoryName}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No categories available.</p>
      )}
    </section>
  );
}

export default HomeCategoriesSection;
