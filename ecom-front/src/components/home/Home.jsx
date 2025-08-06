import { useEffect } from "react";
import HeroBanner from "./HeroBanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { BiMessageError } from "react-icons/bi";

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productList);

  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <div className="lg:px-14 sm:px-8">
        <div className="py-6">
          <HeroBanner />
        </div>
        <div className="py-5">
          <div className="flex flex-col justify-center items-center space-y-2">
            <h1 className="text-slate-700 text-4xl font-bold">Products</h1>

            <span className="text-slate-600">
              Discover our handpicked selection of top-rated items just for you
            </span>
          </div>
       
        {isLoading ? (<Loader/>) : errorMessage ? (
                <div className="flex justify-center items-center h-[400px] gap-2">
                  <BiMessageError className="text-slate-800 text-3xl" />
                  <span className="text-slate-800 text-2xl font-medium">
                    {errorMessage}
                  </span>
                </div>):(

        <div className="pb-6 pt-11 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-5">
          {products?.slice(0, 8).map((item, index) => (
            <ProductCard key={index} {...item} />
          ))}
        </div>)}
      </div>
       </div>
    </>
  );
};

export default Home;
