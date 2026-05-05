import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { bannerList } from "../../../shared/constants/bannerList";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi"; // Added for a modern icon

const colorList = [
  "from-rose-500 via-red-400 to-orange-400",
  "from-emerald-600 via-teal-500 to-cyan-400",
  "from-indigo-600 via-blue-500 to-sky-400"
];

const HeroBanner = () => {
  return (
    <div className="py-14 px-4 lg:px-8 bg-transparent">
      <Swiper
        effect={"fade"}
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        modules={[Pagination, Navigation, EffectFade, Autoplay]}
        className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200"
      >
        {bannerList.map((item, i) => (
          <SwiperSlide key={item.id}>
            <div
              className={`relative overflow-hidden min-h-[500px] lg:h-[650px] bg-gradient-to-br ${
                colorList[i % colorList.length]
              }`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

              <div className="container mx-auto h-full flex flex-col lg:flex-row items-center px-6 lg:px-12 py-12 relative z-10">
                
                {/* Content Side */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1 mt-8 lg:mt-0">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold tracking-widest uppercase animate-fade-in">
                    {item.title}
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-black leading-tight tracking-tight">
                    {item.subtitle}
                  </h1>
                  
                  <p className="text-white/90 text-lg md:text-xl max-w-lg font-medium leading-relaxed">
                    {item.description}
                  </p>
                  
                  <Link
                    to="/products"
                    className="group flex items-center gap-3 bg-white text-slate-900 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-slate-900 hover:text-white hover:shadow-xl active:scale-95"
                  >
                    Explore Now
                    <HiOutlineArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
                  <div className="relative group">
                    {/* Glowing effect behind image */}
                    <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-500" />
                    
                    <img 
                      className="relative z-10 w-auto h-[300px] md:h-[450px] lg:h-[550px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700" 
                      src={item?.image} 
                      alt={item.subtitle}
                    />
                  </div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styles for Swiper pagination/navigation */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;
