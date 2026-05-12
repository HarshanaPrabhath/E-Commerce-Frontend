import { useEffect, useState } from "react";
import { api } from "../../../services/api/api";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;

const toList = (data) =>
  Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];

function useHomeData() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const { data } = await api.get(
          "/public/products?pageNumber=0&pageSize=8&sortBy=productName&sortOrder=asc"
        );
        setProducts(toList(data));
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Failed to load products."));
      } finally {
        setIsLoading(false);
      }
    };

    const loadCategories = async () => {
      setIsCategoryLoading(true);
      setCategoryError("");
      try {
        const { data } = await api.get(
          "/public/categories?pageNumber=0&pageSize=50&sortBy=categoryName&sortOrder=asc"
        );
        setCategories(toList(data));
      } catch (error) {
        setCategoryError(getErrorMessage(error, "Failed to load categories."));
      } finally {
        setIsCategoryLoading(false);
      }
    };

    loadProducts();
    loadCategories();
  }, []);

  return {
    products,
    categories,
    isLoading,
    isCategoryLoading,
    errorMessage,
    categoryError,
  };
}

export default useHomeData;
