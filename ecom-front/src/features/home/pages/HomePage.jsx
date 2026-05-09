import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tv,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { bannerList } from "../../../shared/constants/bannerList";

const colorList = [
  "from-teal-600 via-teal-500 to-emerald-400", // Adjusted to match your teal theme
  "from-orange-600 via-orange-500 to-amber-400", // Adjusted to match your orange theme
  "from-slate-900 via-slate-800 to-slate-700",
];

const categories = [
  { id: 1, name: "Smartphones", items: 120, icon: Smartphone, tone: "bg-teal-50 text-teal-600" },
  { id: 2, name: "Laptops", items: 86, icon: Laptop, tone: "bg-orange-50 text-orange-600" },
  { id: 3, name: "Audio", items: 72, icon: Headphones, tone: "bg-blue-50 text-blue-600" },
  { id: 4, name: "Wearables", items: 64, icon: Watch, tone: "bg-purple-50 text-purple-600" },
  { id: 5, name: "Cameras", items: 39, icon: Camera, tone: "bg-rose-50 text-rose-600" },
  { id: 6, name: "Gaming", items: 58, icon: Gamepad2, tone: "bg-indigo-50 text-indigo-600" },
  { id: 7, name: "TV & Display", items: 44, icon: Tv, tone: "bg-cyan-50 text-cyan-600" },
];

const featuredDeals = [
  {
    id: 1,
    name: "Nova X Pro 5G",
    category: "Smartphones",
    price: "$799",
    oldPrice: "$899",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "AeroBook 14",
    category: "Laptops",
    price: "$1,149",
    oldPrice: "$1,299",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Pulse Buds ANC",
    category: "Audio",
    price: "$149",
    oldPrice: "$199",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Active Watch S9",
    category: "Wearables",
    price: "$269",
    oldPrice: "$329",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
];

const trendingNow = [
  { id: 1, name: "4K Action Camera", sold: 182, amount: "$36,400" },
  { id: 2, name: "Portable SSD 1TB", sold: 144, amount: "$28,800" },
  { id: 3, name: "Noise Cancelling Headset", sold: 130, amount: "$26,000" },
  { id: 4, name: "Smart Home Speaker", sold: 121, amount: "$21,780" },
];

const benefits = [
  { id: 1, title: "Fast Delivery", desc: "Island-wide shipping in 1-3 days.", icon: Truck },
  { id: 2, title: "Secure Payment", desc: "Protected checkout on every order.", icon: ShieldCheck },
  { id: 3, title: "Easy Returns", desc: "Simple returns with quick processing.", icon: RotateCcw },
  { id: 4, title: "24/7 Support", desc: "Support team is always available.", icon: Headset },
];

function HomePage() {
  return (
    <div className="bg-[#fcfcfc] overflow-x-hidden">
      {/* --- HERO SLIDER --- */}
      <section className="py-10 px-4 lg:px-10">
        <Swiper
          effect="fade"
          grabCursor
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Pagination, Navigation, EffectFade, Autoplay]}
          className="rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          {bannerList.map((item, i) => (
            <SwiperSlide key={item.id}>
              <div className={`relative min-h-[550px] lg:h-[700px] bg-gradient-to-br ${colorList[i % colorList.length]}`}>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="container mx-auto h-full flex flex-col lg:flex-row items-center px-8 lg:px-20 py-12 relative z-10">
                  <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-black uppercase tracking-[0.2em]">
                      <Sparkles size={14} className="text-orange-400" /> {item.title}
                    </div>
                    <h1 className="text-5xl md:text-7xl text-white font-black leading-[1.1] tracking-tighter">
                      {item.subtitle}
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-lg font-medium leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Link
                        to="/products"
                        className="group flex items-center gap-3 bg-white text-slate-900 py-5 px-10 rounded-2xl font-black text-lg transition-all hover:bg-orange-500 hover:text-white shadow-xl active:scale-95"
                      >
                        Shop Now
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
                    <img
                      className="w-auto h-[320px] md:h-[500px] lg:h-[600px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-float"
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

      {/* --- CATEGORIES --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            <div className="h-1.5 w-20 bg-teal-600 rounded-full mt-3" />
          </div>
          <Link to="/products" className="group flex items-center gap-2 font-black text-sm uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors">
            See All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to="/products"
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-teal-200"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${item.tone}`}>
                  <Icon size={28} />
                </div>
                <p className="font-black text-slate-800 text-sm tracking-tight">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{item.items} items</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* --- FEATURED DEALS --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[100px]" />
            
            <div className="relative z-10 flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Featured Deals</h2>
              <span className="px-4 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full tracking-widest animate-pulse">Hot Drops</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
              {featuredDeals.map((item) => (
                <article key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} className="fill-orange-500 text-orange-500" />
                        <span className="text-xs font-black text-slate-800">{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{item.category}</p>
                    <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tight line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-2xl font-black text-slate-900">{item.price}</span>
                      <span className="text-sm font-bold text-slate-400 line-through">{item.oldPrice}</span>
                    </div>
                    <Link to="/products" className="mt-6 w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      View details <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
        </div>
      </section>

      {/* --- TRENDING & OFFERS --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest text-center lg:text-left">Trending Now</h2>
            <div className="grid gap-4">
              {trendingNow.map((item) => (
                <div key={item.id} className="group flex items-center justify-between bg-white border border-slate-100 p-6 rounded-[2rem] transition-all hover:border-teal-500 hover:shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center font-black text-teal-600">0{item.id}</div>
                    <div>
                        <p className="font-black text-slate-800 tracking-tight">{item.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.sold} units sold</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-teal-700">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-orange-500 rounded-[3rem] p-10 flex flex-col justify-center text-white overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <h2 className="text-4xl font-black leading-tight">Weekend <br />Mega Sale</h2>
            <p className="text-orange-100 mt-4 font-medium leading-relaxed">
              Get up to 30% off on premium audio and accessories. Use code <span className="text-white font-bold underline">WEEKEND30</span>.
            </p>
            <Link to="/products" className="mt-10 bg-white text-orange-600 py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs inline-flex items-center gap-3 shadow-xl hover:bg-slate-900 hover:text-white transition-all self-start">
              Grab it now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-50 text-teal-600 flex items-center justify-center shadow-inner">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-4">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden text-center md:text-left">
           <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                <div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Stay ahead of <br /> the curve.</h3>
                    <p className="text-teal-200 mt-4 text-lg font-medium">Join 5,000+ tech enthusiasts and get exclusive early access to new drops.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 text-white placeholder:text-teal-300 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                        Join Now
                    </button>
                </div>
           </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
