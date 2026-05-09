import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminProductApi, extractApiErrorMessage } from "../api/adminProductApi";
import AdminProductForm from "../components/AdminProductForm";
import AdminProductFilters from "../components/AdminProductFilters";
import AdminProductTable from "../components/AdminProductTable";
import { uploadImageToCloudinary } from "../../../shared/utils/cloudinaryUpload";

const initialForm = {
  productName: "",
  description: "",
  quantity: 0,
  price: 0,
  discount: 0,
  image: "",
  categoryId: "",
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  const loadCategories = useCallback(async () => {
    try {
      const nextCategories = await adminProductApi.getCategories();
      setCategories(nextCategories);
      if (nextCategories.length > 0) {
        setForm((prev) =>
          prev.categoryId ? prev : { ...prev, categoryId: nextCategories[0].id }
        );
      }
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to load categories."));
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const nextProducts = await adminProductApi.getProducts();
      setProducts(nextProducts);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to load admin products."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [loadCategories, loadProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "image" && uploadError) {
      setUploadError("");
    }
    setForm((prev) => ({
      ...prev,
      [name]: ["quantity", "price", "discount"].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageFileSelect = async (file) => {
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      setUploadError("Please choose a valid image file.");
      return;
    }

    setUploadError("");
    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (!imageUrl) {
        throw new Error("No image URL returned from Cloudinary.");
      }
      setForm((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded.");
    } catch (error) {
      setUploadError(error?.message || "Image upload failed.");
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = useCallback(() => {
    setEditingId(null);
    setUploadError("");
    setForm({ ...initialForm, categoryId: categories[0]?.id || "" });
  }, [categories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploadError("");
    setSaving(true);
    try {
      if (!editingId && !form.categoryId) {
        toast.error("Please select a category.");
        return;
      }
      if (!form.image?.trim()) {
        toast.error("Please upload or provide an image URL.");
        return;
      }

      const payload = {
        productName: form.productName,
        description: form.description,
        quantity: Number(form.quantity),
        image: form.image,
        price: Number(form.price),
        discount: Number(form.discount),
      };

      if (editingId) {
        await adminProductApi.updateProduct(editingId, payload);
      } else {
        await adminProductApi.createProduct({ ...payload, categoryId: form.categoryId });
      }

      await loadProducts();
      toast.success(editingId ? "Product updated." : "Product created.");
      resetForm();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to save product."));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (product) => {
    setEditingId(product.id);
    setForm({
      productName: product.productName,
      description: product.description,
      quantity: Number(product.quantity),
      price: Number(product.price),
      discount: Number(product.discount || 0),
      image: product.image,
      categoryId: product.categoryId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminProductApi.deleteProduct(id);
      await loadProducts();
      toast.success("Product deleted.");
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to delete product."));
    }
  };

  const filteredProducts = useMemo(() => {
    let next = [...products];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch) {
      next = next.filter((item) => {
        const name = String(item?.productName || "").toLowerCase();
        const category = String(item?.categoryName || "").toLowerCase();
        return name.includes(normalizedSearch) || category.includes(normalizedSearch);
      });
    }

    if (categoryFilter !== "all") {
      next = next.filter((item) => String(item?.categoryId) === categoryFilter);
    }

    if (stockFilter === "in") {
      next = next.filter((item) => Number(item?.quantity) > 0);
    } else if (stockFilter === "out") {
      next = next.filter((item) => Number(item?.quantity) <= 0);
    }

    next.sort((a, b) => {
      if (sortBy === "name-asc") {
        return String(a?.productName || "").localeCompare(String(b?.productName || ""));
      }
      if (sortBy === "name-desc") {
        return String(b?.productName || "").localeCompare(String(a?.productName || ""));
      }
      if (sortBy === "price-asc") {
        return Number(a?.price || 0) - Number(b?.price || 0);
      }
      if (sortBy === "price-desc") {
        return Number(b?.price || 0) - Number(a?.price || 0);
      }
      if (sortBy === "stock-asc") {
        return Number(a?.quantity || 0) - Number(b?.quantity || 0);
      }
      if (sortBy === "stock-desc") {
        return Number(b?.quantity || 0) - Number(a?.quantity || 0);
      }
      return 0;
    });

    return next;
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
      categoryFilter !== "all" ||
      stockFilter !== "all" ||
      sortBy !== "name-asc"
  );

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortBy("name-asc");
  };

  return (
    <section className="min-h-screen bg-[#fcfcfc] px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
              Inventory
            </h1>
            <p className="text-slate-500 font-bold text-sm tracking-widest">
              MANAGEMENT PORTAL
            </p>
          </div>
        </header>

        <AdminProductForm
          editingId={editingId}
          form={form}
          categories={categories}
          saving={saving}
          uploadingImage={uploadingImage}
          uploadError={uploadError}
          onChange={handleChange}
          onImageFileSelect={handleImageFileSelect}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        <AdminProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          filteredCount={filteredProducts.length}
          totalCount={products.length}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        <AdminProductTable
          loading={loading}
          products={filteredProducts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </section>
  );
}

export default AdminProductsPage;
