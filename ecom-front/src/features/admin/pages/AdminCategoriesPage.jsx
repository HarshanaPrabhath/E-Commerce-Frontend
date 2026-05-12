import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Tag, Loader2, Layers, AlertCircle, X, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminProductApi, extractApiErrorMessage } from "../api/adminProductApi";

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

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { categoryName: name.trim() };
      if (editingId) {
        await adminProductApi.updateCategory(editingId, payload);
      } else {
        await adminProductApi.createCategory(payload);
      }
      await loadCategories();
      toast.success(editingId ? "Category Refined" : "Category Secured");
      resetForm();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Sync Error"));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (category) => {
    setEditingId(category.id);
    setName(category.categoryName || category.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 lg:p-12 font-sans">
        <div className="max-w-6xl mx-auto">

          {/* --- HEADER --- */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Layers size={18} className="text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                  Categories
                </h1>
              </div>
              <p className="text-slate-400 font-bold tracking-[0.2em] text-[10px]">Display Currently Have Categories</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* --- ENTRY TERMINAL (SIDEBAR) --- */}
            <aside className="lg:col-span-4">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] sticky top-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xs font-black uppercase tracking-widest text-orange-500">
                    {editingId ? "Update Protocol" : "New Category"}
                  </h2>
                  {editingId && (
                      <button onClick={resetForm} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <X size={18} />
                      </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Label Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={18} />
                      <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-800 focus:border-teal-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                          placeholder=""
                          required
                      />
                    </div>
                  </div>

                  <button
                      disabled={saving || !name.trim()}
                      type="submit"
                      className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg ${
                          editingId
                              ? 'bg-orange-500 text-white shadow-orange-200 hover:bg-slate-900'
                              : 'bg-teal-600 text-white shadow-teal-200 hover:bg-slate-900'
                      } disabled:opacity-30 active:scale-95`}
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : (editingId ? "Confirm Update" : "Create Category")}
                  </button>
                </form>
              </div>
            </aside>

            {/* --- DATA GRID --- */}
            <main className="lg:col-span-8">
              {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-slate-100">
                    <Loader2 size={32} className="animate-spin text-teal-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Registry</p>
                  </div>
              ) : categories.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="font-black uppercase italic text-slate-400 tracking-widest">No Categories Found</h3>
                    <p className="text-xs text-slate-300 font-bold">Initialize your first class using the sidebar terminal.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white border border-slate-100 rounded-3xl p-5 hover:border-teal-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                                <Tag size={18} />
                              </div>
                              <span className="font-black text-slate-800 uppercase italic tracking-tight text-lg">
                          {item.categoryName || item.name}
                        </span>
                            </div>
                            <ChevronRight size={16} className="text-slate-200 group-hover:text-teal-500 transition-colors" />
                          </div>

                          <div className="flex items-center gap-2 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => onEdit(item)}
                                className="flex-1 py-2 bg-slate-50 hover:bg-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all"
                            >
                              Edit
                            </button>
                            <button
                                onClick={() => adminProductApi.deleteCategory(item.id).then(loadCategories)}
                                className="px-4 py-2 bg-slate-50 hover:bg-rose-500 hover:text-white rounded-xl text-slate-400 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </main>
          </div>
        </div>
      </div>
  );
}

export default AdminCategoriesPage;