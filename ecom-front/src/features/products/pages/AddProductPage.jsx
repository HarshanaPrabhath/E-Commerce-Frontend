import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../store/actions";
import AddCategoryForm from "../components/AddCategoryForm";
import AddProductForm from "../components/AddProductForm";

const CATEGORY_QUERY = "pageNumber=0&pageSize=2&sortBy=categoryName&sortOrder=asc";

function AddProductPage() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.productList);
  const { categoryLoader, categoryError } = useSelector((state) => state.errors);

  const loadCategories = useCallback(() => {
    dispatch(fetchCategories(CATEGORY_QUERY));
  }, [dispatch]);

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
