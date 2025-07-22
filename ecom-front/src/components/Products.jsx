import ProductCard from "./ProductCard";
import { BiMessageError } from "react-icons/bi";

const Products = () => {
  const isLoading = false;
  const errorMassage = ""; // You can rename this to 'errorMessage' if needed
  const productList = [
    {
      productId: 1,
      productName: "Wireless Headphones",
      image: "https://placehold.co/600x400",
      description: "High-quality wireless headphones with noise cancellation.Portable Bluetooth speaker with deep bass and 10-hour battery life.",
      quantity: 50,
      price: 120.0,
      discount: 10,
      specialPrice: 108.0,
    },
    {
      productId: 2,
      productName: "Smartwatch Series 5",
      image: "https://placehold.co/600x400",
      description: "Water-resistant smartwatch with fitness tracking and GPS.",
      quantity: 30,
      price: 250.0,
      discount: 20,
    //   specialPrice: 200.0,
    },
    {
      productId: 3,
      productName: "Bluetooth Speaker",
      image: "https://placehold.co/600x400",
      description:
        "Portable Bluetooth speaker with deep bass and 10-hour battery life.",
      quantity: 0,
      price: 80.0,
      discount: 15,
      specialPrice: 68.0,
    },
  ];

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
      {isLoading ? (
        <p>it is loading ....</p>
      ) : errorMassage ? (
        <div className="flex justify-center items-center h-[400px] gap-2">
          <BiMessageError className="text-slate-800 text-3xl" />
          <span className="text-slate-800 text-2xl font-medium">{errorMassage}</span>
        </div>
      ) : (
        <div className="min-h-[700px]">
          <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-5">
            {productList.map((item, index) => (
              <ProductCard key={index} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
