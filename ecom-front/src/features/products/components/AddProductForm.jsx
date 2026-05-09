import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../store/actions";
import toast from "react-hot-toast";

function AddProductForm({ categories = [], categoryLoader = false, categoryError = null }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    quantity: "",
    image: "",
    price: "",
    discount: ""
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    if (!selectedCategoryId && categories?.length) {
      setSelectedCategoryId(String(categories[0].categoryId));
    }
  }, [categories, selectedCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!product.image) {
      toast.error("Please add a product image.");
      return;
    }

    const finalData = {
      ...product,
      quantity: Number(product.quantity),
      price: Number(product.price),
      discount: Number(product.discount)
    };

    dispatch(addProduct(selectedCategoryId, finalData, toast, navigate));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md">
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

      <label className="block mb-2 font-semibold">Category</label>
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded bg-white"
        required
      >
        {categories?.map((item) => (
          <option key={item.categoryId} value={item.categoryId}>
            {item.categoryName}
          </option>
        ))}
      </select>
      {categoryLoader ? (
        <p className="text-sm text-slate-500 mb-4">Loading categories...</p>
      ) : null}
      {categoryError ? (
        <p className="text-sm text-rose-600 mb-4">{categoryError}</p>
      ) : null}

      <label className="block mb-2 font-semibold">Quantity</label>
      <input
        type="number"
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Image URL</label>
      <input
        type="url"
        name="image"
        value={product.image}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        placeholder="https://example.com/images/headphones.jpg"
        required
      />
      {product.image ? (
        <img
          src={product.image}
          alt="Preview"
          className="w-28 h-28 object-cover rounded border mb-4"
        />
      ) : null}

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

export default AddProductForm;
