import ProductsContent from "../components/ProductsContent";
import ProductsFilterBar from "../components/ProductsFilterBar";
import ProductsPagination from "../components/ProductsPagination";
import useProductsCatalog from "../hooks/useProductsCatalog";

function ProductsPage({ adminView = false }) {
  const {
    products,
    pagination,
    errorMessage,
    isLoadingProducts,
    isLoadingCategories,
    searchInput,
    setSearchInput,
    category,
    categoryOptions,
    sortOrder,
    pageSize,
    hasActiveFilters,
    updateParams,
    resetFilters,
  } = useProductsCatalog();

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="lg:px-14 sm:px-8 px-4 pt-16 pb-10 2xl:w-[90%] 2xl:mx-auto">
        <ProductsFilterBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          category={category}
          updateParams={updateParams}
          isLoadingCategories={isLoadingCategories}
          categoryOptions={categoryOptions}
          sortOrder={sortOrder}
          pageSize={pageSize}
          hasActiveFilters={hasActiveFilters}
          onReset={resetFilters}
        />

        <ProductsContent
          errorMessage={errorMessage}
          isLoadingProducts={isLoadingProducts}
          products={products}
          adminView={adminView}
          onClearFilters={resetFilters}
        />

        <ProductsPagination totalPages={pagination.totalPages} />
      </div>
    </div>
  );
}

export default ProductsPage;
