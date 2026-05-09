import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../../store/actions";
import toast from "react-hot-toast";

function AddCategoryForm({ onCreated }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setLoading(true);
    const result = await dispatch(
      createCategory({ categoryName: categoryName.trim() }, toast)
    );
    setLoading(false);

    if (result?.success) {
      setCategoryName("");
      if (onCreated) onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Category</h2>

      <label className="block mb-2 font-semibold">Category Name</label>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}

export default AddCategoryForm;
