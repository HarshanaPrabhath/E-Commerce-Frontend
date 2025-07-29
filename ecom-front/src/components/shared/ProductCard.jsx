import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import { truncateText } from "../utils/truncateText";

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
}) => {
  const [openProductViewModel, setOpenProductViewModel] = useState(false);
  const btnLoader = false;
  const [selectedViewProduct, setSelectedViewProduct] = useState("");
  const isAvailable = quantity && Number(quantity) > 0;

  const handleProductView = (product) => {
    setSelectedViewProduct(product);
    setOpenProductViewModel(true);
  };

  return (
    <div className="mb-6  border-0 rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
      <div
        onClick={() => {
          handleProductView({
            id: productId,
            productName,
            image,
            description,
            quantity,
            price,
            discount,
            specialPrice,
          });
        }}
        className="w-full overflow-hidden aspect[3/1]"
      >
        <img
          src={image}
          alt={productName}
          className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="pt-4 pl-4">
        <h2
          onClick={() => {}}
          className="text-2xl font-semibold  cursor-pointer"
        >
          {truncateText(productName,50)}
        </h2>
      </div>
      <div className="pt-4 pl-3 min-h-20 max-h-20">
        <p className="text-gray-600 text-small">{truncateText(description,90)}</p>
      </div>

      <div className="flex pt-2 items-center justify-between mr-8">
        {specialPrice ? (
          <div className="flex flex-col mb-4 ml-5">
            <span className="text-gray-500 line-through">
              ${Number(price).toFixed(2)}
            </span>
            <span className="text-xl font-bold text-slate-700">
              ${Number(specialPrice).toFixed(2)}
            </span>
          </div>
        ) : (
          <div>
            <span className="text-xl font-bold text-slate-700">
              ${Number(price).toFixed(2)}
            </span>
          </div>
        )}
        <button
          disabled={!isAvailable || btnLoader}
          onClick={() => {}}
          className={`bg-blue-500 rounded p-2  text-white flex items-center  ${
            isAvailable
              ? "opacity-100 hover:bg-blue-600 transition-colors duration-300 w-36 justify-center"
              : "opacity-70"
          }`}
        >
          <FaShoppingCart className="text-lg mr-2 " />
          {isAvailable ? "Add to Cart" : "Stock Out"}
        </button>
      </div>

      <ProductViewModal
        open={openProductViewModel}
        setOpen={setOpenProductViewModel}
        product={selectedViewProduct}
        isAvailable={isAvailable}
      />
    </div>
  );
};

export default ProductCard;
