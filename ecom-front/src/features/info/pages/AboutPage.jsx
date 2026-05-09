import ProductCard from "../../../shared/components/ProductCard";
import { FaRocket, FaShieldAlt, FaHeadset } from "react-icons/fa";

const About = () => {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
      productName: "Wireless Headphones",
      description: "High-quality over-ear wireless headphones with noise cancellation.",
      specialPrice: "$79.99",
      price: "$99.99",
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
      productName: "Smart Watch",
      description: "Stylish smartwatch with fitness tracking and heart rate monitor.",
      specialPrice: "$129.99",
      price: "$149.99",
    },
    {
      image: "https://images.unsplash.com/photo-1608156639585-34a072a0be24?q=80&w=600",
      productName: "Portable Speaker",
      description: "Compact Bluetooth speaker with deep bass and waterproof design.",
      specialPrice: "$39.99",
      price: "$49.99",
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-teal-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Our <span className="text-orange-400">Story</span>
          </h1>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg opacity-80">
            Founded with a passion for innovation and a commitment to excellence. 
            We bring the world's best tech right to your doorstep.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {/* Main Info Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-teal-900/5 p-8 md:p-12 border border-teal-50 flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
              We’re redefining the <br /> 
              <span className="text-teal-700">Digital Shopping</span> experience.
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              We're dedicated to providing you with high-quality products,
              seamless shopping experiences, and exceptional customer service.
              Whether you're here for the latest trends or everyday essentials,
              we're here to make your journey easy and enjoyable.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <FaRocket className="text-orange-500" />
                <span className="font-bold text-slate-700 text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <FaShieldAlt className="text-teal-600" />
                <span className="font-bold text-slate-700 text-sm">Secure Payment</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-400/20 blur-2xl rounded-full" />
              <img
                className="relative w-full h-[400px] object-cover rounded-[2rem] shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                alt="Our Team"
              />
            </div>
          </div>
        </div>

        {/* Why Us Section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                <FaRocket />
              </div>
              <h3 className="font-black text-slate-800 text-xl">Innovation</h3>
              <p className="text-slate-500 text-sm">Always bringing you the latest and greatest in technology.</p>
           </div>
           <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                <FaShieldAlt />
              </div>
              <h3 className="font-black text-slate-800 text-xl">Trust</h3>
              <p className="text-slate-500 text-sm">Thousands of satisfied customers worldwide trust our brand.</p>
           </div>
           <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                <FaHeadset />
              </div>
              <h3 className="font-black text-slate-800 text-xl">Support</h3>
              <p className="text-slate-500 text-sm">24/7 dedicated support to help you with your shopping journey.</p>
           </div>
        </div>

        {/* Products Section */}
        <div className="pb-20">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-2">Featured Products</h2>
            <div className="w-20 h-1.5 bg-orange-500 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                productName={product.productName}
                description={product.description}
                specialPrice={product.specialPrice}
                price={product.price}
                about
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
