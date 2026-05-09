import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  adminProductApi,
  extractApiErrorMessage,
} from "../api/adminProductApi";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminProductApi.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to load categories."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { categoryName: name.trim() };
      if (editingId) {
        await adminProductApi.updateCategory(editingId, payload);
      } else {
        await adminProductApi.createCategory(payload);
      }
      await loadCategories();
      toast.success(editingId ? "Category updated." : "Category created.");
      resetForm();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to save category."));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const onDelete = async (id) => {
    try {
      await adminProductApi.deleteCategory(id);
      await loadCategories();
      toast.success("Category deleted.");
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to delete category."));
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Category CRUD</h1>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white text-sm"
          >
            <Plus size={16} />
            New Category
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row gap-3"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 border border-slate-300 px-3 py-2 rounded-md"
            placeholder="Category name"
            required
          />
          <button
            disabled={saving}
            type="submit"
            className="px-3 py-2 rounded-md bg-teal-600 text-white text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
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
        </form>

        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3">Category Name</th>
                <th className="text-left px-4 py-3 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={2}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={2}>
                    No categories.
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-md border border-slate-300"
                          aria-label="Edit category"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-md border border-rose-200 text-rose-600"
                          aria-label="Delete category"
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

export default AdminCategoriesPage;
