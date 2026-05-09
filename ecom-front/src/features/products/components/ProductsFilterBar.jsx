import { Search, RotateCcw, Filter, LayoutGrid } from "lucide-react";

function ProductsFilterBar({
  searchInput,
  setSearchInput,
  category,
  updateParams,
  isLoadingCategories,
  categoryOptions,
  sortOrder,
  pageSize,
  hasActiveFilters,
  onReset,
}) {
  return (
    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search artifact..."
            className="h-14 w-full rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-300 placeholder:font-bold"
          />
        </div>

        <div className="relative">
          <Filter
            size={14}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"
          />
          <select
            value={category}
            onChange={(event) => updateParams({ category: event.target.value })}
            disabled={isLoadingCategories}
            className="h-14 w-full appearance-none rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="all">ALL CATEGORIES</option>
            {categoryOptions.map((item) => (
              <option key={item.categoryId} value={item.categoryName}>
                {item.categoryName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <LayoutGrid
            size={14}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
          />
          <select
            value={sortOrder}
            onChange={(event) => updateParams({ sortOrder: event.target.value })}
            className="h-14 w-full appearance-none rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="asc">SORT: A - Z</option>
            <option value="desc">SORT: Z - A</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={pageSize}
            onChange={(event) => updateParams({ pageSize: Number(event.target.value) })}
            className="h-14 flex-1 rounded-2xl border-none bg-slate-50 px-6 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value={8}>8 PER PAGE</option>
            <option value={12}>12 PER PAGE</option>
            <option value={24}>24 PER PAGE</option>
          </select>

          <button
            type="button"
            disabled={!hasActiveFilters}
            onClick={onReset}
            className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-orange-500 disabled:opacity-20 disabled:grayscale transition-all duration-300"
            aria-label="Reset filters"
          >
            <RotateCcw size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductsFilterBar;
