import React, { useCallback, useEffect, useState } from "react";
import { adminProductApi } from "../../admin/api/adminProductApi";
import AddCategoryForm from "../components/AddCategoryForm";
import AddProductForm from "../components/AddProductForm";

function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [categoryLoader, setCategoryLoader] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const loadCategories = useCallback(async () => {
    setCategoryLoader(true);
    setCategoryError("");
    try {
      const data = await adminProductApi.getCategories();
      setCategories(data.map((item) => ({
        categoryId: item.id,
        categoryName: item.name,
      })));
    } catch (error) {
      setCategoryError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load categories."
      );
    } finally {
      setCategoryLoader(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="max-w-6xl mt-10 mb-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AddCategoryForm onCreated={loadCategories} />
      <AddProductForm
        categories={categories}
        categoryLoader={categoryLoader}
        categoryError={categoryError}
      />
    </div>
  );
}

export default AddProductPage;
