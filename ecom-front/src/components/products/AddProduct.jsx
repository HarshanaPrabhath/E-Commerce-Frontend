import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { addProduct } from "../../store/actions";
import toast from "react-hot-toast";

function AddProduct() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    quantity: "",
    image: "default.png",
    price: "",
    discount: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert quantity, price, and discount to numbers
    const finalData = {
      ...product,
      quantity: Number(product.quantity),
      price: Number(product.price),
      discount: Number(product.discount)
    };
    console.log("Product Data:", finalData);
    dispatch(addProduct(finalData,toast,navigate));

    // Navigate to Products page after submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mt-10 mb-10 mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <label className="block mb-2 font-semibold">Product Name</label>
      <input
        type="text"
        name="productName"
        value={product.productName}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Description</label>
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Quantity</label>
      <input
        type="number"
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      {/* <label className="block mb-2 font-semibold">Image URL</label>
      <input
        type="text"
        name="image"
        value={product.image}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
      /> */}

      <label className="block mb-2 font-semibold">Price ($)</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        step="0.01"
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Discount (%)</label>
      <input
        type="number"
        name="discount"
        value={product.discount}
        onChange={handleChange}
        step="0.01"
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <button
        type="submit"
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;
