import ProductCard from "./shared/ProductCard";

const About = () => {
  const products = [
    {
      image: "https://placehold.co/600x400",
      productName: "Wireless Headphones",
      description:
        "High-quality over-ear wireless headphones with noise cancellation.",
      specialPrice: "$79.99",
      price: "$99.99",
    },
    {
      image: "https://placehold.co/600x400",
      productName: "Smart Watch",
      description:
        "Stylish smartwatch with fitness tracking and heart rate monitor.",
      specialPrice: "$129.99",
      price: "$149.99",
    },
    {
      image: "https://placehold.co/600x400",
      productName: "Portable Speaker",
      description:
        "Compact Bluetooth speaker with deep bass and waterproof design.",
      specialPrice: "$39.99",
      price: "$49.99",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-slate-800 text-4xl font-bold text-center mb-12">
        About Us
      </h1>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
        <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:pl-5">
          <p>
            We're dedicated to providing you with high-quality products,
            seamless shopping experiences, and exceptional customer service.
            Whether you're here for the latest trends or everyday essentials,
            we're here to make your journey easy and enjoyable. Thank you for
            choosing us!
          </p>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <img
            className="w-full h-auto rounded-lg shadow-md  transition-transform duration-300 hover:scale-105"
            src="https://placehold.co/600x400"
            alt="about us"
          />
        </div>
      </div>

        <div className="py-7 space-y-8"></div>
      <div>
        <h1 className="text-slate-800 text-4xl mb-6 font-bold text-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default About;
