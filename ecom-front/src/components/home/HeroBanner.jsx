import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { bannerList } from "./../utils/index";
import { Link } from "react-router-dom";

const colorList =  [
  "bg-gradient-to-r from-amber-400 to-pink-500",
    "bg-gradient-to-r from-lime-500 to-teal-600",
    "bg-gradient-to-r from-blue-500 to-cyan-500"
  ]

const HeroBanner = () => {
  return (
    <div className="py-2 px-2">
      <Swiper
        grabCursor={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        modules={[Pagination, Navigation, EffectFade, Autoplay]}
        slidesPerView={1}
      >
        {bannerList.map((item, i) => (
          <SwiperSlide key={item.id}>
            <div
              className={`carousel-item sm:h-[500px] h-96 rounded-xl ${
                colorList[i % colorList.length]
              }`}
            >
              <div className="flex items-center justify-center h-full">
                <div className=" hidden lg:flex justify-center w-1/2 p-8">
                  <div className="text-center">
                  <h3 className="text-3xl text-white font-bold">
                    {item.title}
                  </h3>
                  <h1 className="text-5xl text-white font-bold mt-2">
                    {item.subtitle}
                  </h1>
                  <p className="text-white font-bold mt-4">
                    {item.description}
                  </p>
                  <Link
                    className="mt-6 inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                    to="/products"
                  >
                    Shop
                  </Link>
                 
                </div>
              </div>
              <div className="w-full flex justify-center  lg:w-1/2 p-4">
                <img className="rounded-2xl w-auto h-[60vh]" src={item?.image} />
              </div>
            </div>
             </div>
            <div className="text-center"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
