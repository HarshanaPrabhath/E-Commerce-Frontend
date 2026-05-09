import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminProductApi } from "../../admin/api/adminProductApi";
import { uploadImageToCloudinary } from "../../../shared/utils/cloudinaryUpload";
import { normalizeImageUrl } from "../../../shared/utils/imageUrl";

function AddProductForm({ categories = [], categoryLoader = false, categoryError = null }) {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    quantity: "",
    image: "",
    price: "",
    discount: ""
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!selectedCategoryId && categories?.length) {
      setSelectedCategoryId(String(categories[0].categoryId));
    }
  }, [categories, selectedCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image" && uploadError) {
      setUploadError("");
    }
    setProduct((prev) => ({
      ...prev,
      [name]: name === "image" ? normalizeImageUrl(value) : value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    setUploadError("");
    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setProduct((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded to Cloudinary.");
    } catch (error) {
      const message = error?.message || "Image upload failed.";
      setUploadError(message);
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileChange = (event) => {
    handleImageUpload(event.target.files?.[0]);
  };

  const handleDropImage = (event) => {
    event.preventDefault();
    handleImageUpload(event.dataTransfer?.files?.[0]);
  };

  const handleSubmit = async (e) => {
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

    try {
      await adminProductApi.createProduct({ ...finalData, categoryId: selectedCategoryId });
      toast.success("Product created.");
      navigate("/manage-products");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create product."
      );
    }
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
        placeholder="quantity"
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
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDropImage}
        className="w-full mb-3 px-3 py-4 border border-dashed rounded text-sm text-slate-600 bg-slate-50"
      >
        Drag & drop image here or choose file
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="block w-full mt-2"
        />
        <p className="mt-1 text-xs text-slate-500">
          {isUploadingImage ? "Uploading to Cloudinary..." : "Cloudinary upload enabled"}
        </p>
      </div>
      {uploadError ? <p className="text-sm text-rose-600 mb-3">{uploadError}</p> : null}
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
        disabled={isUploadingImage}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
      >
        {isUploadingImage ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}

export default AddProductForm;
