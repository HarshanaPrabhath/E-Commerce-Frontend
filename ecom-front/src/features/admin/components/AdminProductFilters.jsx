function AdminProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  sortBy,
  setSortBy,
  categories,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <section className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search products"
          className="h-11 px-4 rounded-xl border border-slate-200"
        />
        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          className="h-11 px-4 rounded-xl border border-slate-200 bg-white"
        >
          <option value="all">All stock</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-11 px-4 rounded-xl border border-slate-200 bg-white"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price low-high</option>
          <option value="price-desc">Price high-low</option>
          <option value="stock-asc">Stock low-high</option>
          <option value="stock-desc">Stock high-low</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 font-semibold">
          Showing {filteredCount} of {totalCount} products
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
          className="h-10 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold disabled:opacity-40"
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
}

export default AdminProductFilters;
