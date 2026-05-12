import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { bannerList } from "../../../shared/constants/bannerList";

const HERO_COLORS = [
  "from-teal-600 via-teal-500 to-emerald-400",
  "from-orange-600 via-orange-500 to-amber-400",
  "from-slate-900 via-slate-800 to-slate-700",
];

function HomeHeroSlider() {
  return (
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
  );
}

export default HomeHeroSlider;
