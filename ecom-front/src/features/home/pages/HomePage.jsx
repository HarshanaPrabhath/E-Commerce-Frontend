import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { fetchCategories, fetchProducts } from "../../../store/actions";
import ProductCard from "../../../shared/components/ProductCard";
import { bannerList } from "../../../shared/constants/bannerList";

const HERO_COLORS = [
  "from-teal-600 via-teal-500 to-emerald-400",
  "from-orange-600 via-orange-500 to-amber-400",
  "from-slate-900 via-slate-800 to-slate-700",
];

const BENEFITS = [
  { id: 1, title: "Fast Delivery", desc: "Island-wide shipping in 1-3 days.", icon: Truck },
  { id: 2, title: "Secure Payment", desc: "Protected checkout on every order.", icon: ShieldCheck },
  { id: 3, title: "Easy Returns", desc: "Simple returns with quick processing.", icon: RotateCcw },
  { id: 4, title: "24/7 Support", desc: "Support team is always available.", icon: Headset },
];

function HomePage() {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.productList);
  const { isLoading, errorMessage, categoryLoader, categoryError } = useSelector(
    (state) => state.errors
  );

  useEffect(() => {
    dispatch(fetchProducts("pageNumber=0&sortBy=productName&sortOrder=asc"));
    dispatch(
      fetchCategories("pageNumber=0&pageSize=50&sortBy=categoryName&sortOrder=asc")
    );
  }, [dispatch]);

  const isHomeLoading = isLoading || categoryLoader;
  const homeError = errorMessage || categoryError;

  const topCategories = useMemo(() => {
    const unique = new Map();
    (categories || []).forEach((item) => {
      const id = String(item?.categoryId ?? "").trim();
      const name = String(item?.categoryName ?? "").trim();
      if (id && name) {
        unique.set(name, { categoryId: id, categoryName: name });
      }
    });
    return Array.from(unique.values()).slice(0, 8);
  }, [categories]);

  const spotlightProducts = useMemo(() => {
    const list = products || [];
    const discounted = list.filter((item) => Number(item?.discount ?? 0) > 0);
    if (discounted.length >= 4) {
      return discounted.slice(0, 4);
    }
    return list.slice(0, 4);
  }, [products]);

  return (
    <div className="bg-[#fcfcfc] overflow-x-hidden">
      <section className="py-10 px-4 lg:px-10">
        <Swiper
          effect="fade"
          grabCursor
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Pagination, Navigation, EffectFade, Autoplay]}
          className="rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          {bannerList.map((item, i) => (
            <SwiperSlide key={item.id}>
              <div
                className={`relative min-h-[520px] lg:h-[680px] bg-gradient-to-br ${
                  HERO_COLORS[i % HERO_COLORS.length]
                }`}
              >
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="container mx-auto h-full flex flex-col lg:flex-row items-center px-8 lg:px-20 py-12 relative z-10">
                  <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8 order-2 lg:order-1">
                    <h1 className="text-5xl md:text-7xl text-white font-black leading-[1.1] tracking-tighter">
                      {item.subtitle}
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-lg font-medium leading-relaxed">
                      {item.description}
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-3 bg-white text-slate-900 py-4 px-8 rounded-2xl font-black text-base transition-all hover:bg-orange-500 hover:text-white shadow-xl"
                    >
                      Shop Now
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
                    <img
                      className="w-auto h-[300px] md:h-[480px] lg:h-[580px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                      src={item?.image}
                      alt={item.subtitle}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

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

        {isHomeLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : homeError ? (
          <p className="text-slate-500">{homeError}</p>
        ) : topCategories.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {topCategories.map((category) => (
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

        {isHomeLoading ? (
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[420px] bg-white rounded-[2rem] border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : homeError ? (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-slate-600 text-center">{homeError}</p>
          </div>
        ) : (products || []).length ? (
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-8">
            {(products || []).slice(0, 8).map((item) => (
              <ProductCard key={item.productId ?? item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-slate-600">No products available.</p>
          </div>
        )}
      </section>


      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-teal-600 flex items-center justify-center shadow-inner">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
