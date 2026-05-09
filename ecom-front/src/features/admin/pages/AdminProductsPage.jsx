import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  adminProductApi,
  extractApiErrorMessage,
} from "../api/adminProductApi";

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

  const loadCategories = async () => {
    try {
      const nextCategories = await adminProductApi.getCategories();
      setCategories(nextCategories);
      setForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || nextCategories[0]?.id || "",
      }));
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to load categories."));
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const nextProducts = await adminProductApi.getProducts();
      setProducts(nextProducts);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to load admin products."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price" || name === "discount"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      categoryId: categories[0]?.id || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (!editingId && !form.categoryId) {
        toast.error("No category found. Please create a category first.");
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
        await adminProductApi.createProduct({
          ...payload,
          categoryId: form.categoryId,
        });
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
  };

  const onDelete = async (id) => {
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

  return (
    <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Product CRUD</h1>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white text-sm"
          >
            <Plus size={16} />
            New Product
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-white border border-slate-200 p-4 rounded-md"
        >
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Product name"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Image URL"
            required
          />
          <input
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Quantity"
            required
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Price"
            required
          />
          <input
            name="discount"
            type="number"
            min="0"
            step="0.01"
            value={form.discount}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Discount"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border border-slate-300 px-3 py-2 rounded-md md:col-span-2 xl:col-span-2"
            placeholder="Description"
            required
          />
          <div className="flex items-center gap-2">
            <button
              disabled={saving}
              type="submit"
              className="px-3 py-2 rounded-md bg-teal-600 text-white text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 rounded-md border border-slate-300 text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="bg-white border border-slate-200 rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Qty</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    No products.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{item.productName}</div>
                      <div className="text-slate-500 text-xs">{item.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-md border border-slate-300"
                          aria-label="Edit product"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-md border border-rose-200 text-rose-600"
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminProductsPage;
