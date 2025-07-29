import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../shared/ProductCard";
import { BiMessageError } from "react-icons/bi";
import { useEffect } from "react";
import { fetchCategories, fetchProducts } from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";

const Products = () => {
  const dispatch = useDispatch();

  const { products, categories, pagination } = useSelector(
    (state) => state.productList
  );
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // const isLoading = false;
  // const errorMassage = "";
  useProductFilter();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
      <Filter categories={categories ? categories : []} />
      {isLoading ? (
        <Loader text="Products Loading" />
      ) : errorMessage ? (
        <div className="flex justify-center items-center h-[400px] gap-2">
          <BiMessageError className="text-slate-800 text-3xl" />
          <span className="text-slate-800 text-2xl font-medium">
            {errorMessage}
          </span>
        </div>
      ) : (
        <div className="min-h-[700px]">
          <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-5">
            {products?.map((item, index) => (
              <ProductCard key={index} {...item} />
            ))}
          </div>
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

export default Products;
