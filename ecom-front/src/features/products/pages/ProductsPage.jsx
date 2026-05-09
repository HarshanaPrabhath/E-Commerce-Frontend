import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../../shared/components/ProductCard";
import { BiMessageError } from "react-icons/bi";
import { useEffect } from "react";
import { fetchCategories } from "../../../store/actions";
import Filter from "../components/Filter";
import useProductFilter from "../hooks/useProductFilter";
import Loader from "../../../shared/components/Loader";
import Paginations from "../../../shared/components/Paginations";

const ProductsPage = ({ adminView = false }) => {
  const dispatch = useDispatch();

  const { products, categories, pagination } = useSelector(
    (state) => state.productList
  );
  const { isLoading, errorMessage } = useSelector((state) => state.errors);


  useProductFilter();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
      <Filter categories={categories ? categories : []} />
      {errorMessage ? (
        <div className="flex justify-center items-center h-[400px] gap-2">
          <BiMessageError className="text-slate-800 text-3xl" />
          <span className="text-slate-800 text-2xl font-medium">
            {errorMessage}
          </span>
        </div>
      ) : isLoading ? (
        <Loader text="Products Loading" />
      ) : (
        <div className="min-h-[700px]">
          {products?.length ? (
            <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-5">
              {products.map((item, index) => (
                <ProductCard key={index} {...item} adminView={adminView} />
              ))}
            </div>
          ) : (
            <div className="h-[420px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-700 text-2xl font-bold">
                  No products found
                </p>
                <p className="text-slate-500 mt-2">
                  Try changing filters or check again later.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center pt-10">
        <Paginations
          numberOfPage={pagination?.totalPages }
          totalProducts={pagination?.totalElements}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
