import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../../services/api/api";
import { normalizeImageUrl } from "../../../shared/utils/imageUrl";

const DEFAULT_PAGE_SIZE = 12;
const CATEGORY_PAGE_SIZE = 50;
const MAX_CATEGORY_PAGES = 200;
const DEFAULT_IMAGE = "http://localhost:5000/images/default.png";

const normalizeSortOrder = (value) =>
  String(value || "").toLowerCase() === "desc" ? "desc" : "asc";

const extractItems = (payload) => {
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeCategory = (item) => ({
  categoryId: item?.categoryId ?? item?.id ?? "",
  categoryName: item?.categoryName ?? item?.name ?? "",
});

const normalizeProduct = (item) => ({
  productId: item?.productId ?? item?.id,
  productName: item?.productName ?? item?.name ?? "Unnamed Product",
  categoryName:
    item?.categoryName ?? item?.category?.categoryName ?? item?.category?.name ?? "General",
  image: normalizeImageUrl(item?.image) || DEFAULT_IMAGE,
  description: item?.description ?? "",
  quantity: Number(item?.quantity ?? 0),
  price: Number(item?.price ?? 0),
  discount: Number(item?.discount ?? 0),
  specialPrice:
    item?.specialPrice != null ? Number(item.specialPrice) : Number(item?.price ?? 0),
});

const toPositiveNumber = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1) return fallback;
  return numeric;
};

function useProductsCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalElements: 0,
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");

  const page = toPositiveNumber(searchParams.get("page"), 1);
  const pageSize = toPositiveNumber(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
  const sortOrder = normalizeSortOrder(searchParams.get("sortOrder"));
  const category = searchParams.get("category") || "all";
  const keyword = (searchParams.get("keyword") || "").trim();

  const categoryOptions = useMemo(() => {
    const unique = new Map();
    categories.forEach((item) => {
      const id = String(item?.categoryId ?? "").trim();
      const name = String(item?.categoryName ?? "").trim();
      if (id && name) {
        unique.set(name, { categoryId: id, categoryName: name });
      }
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }, [categories]);

  const updateParams = useCallback(
    (updates, resetPage = true) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        const isEmpty = value === null || value === undefined || value === "" || value === "all";
        const isDefaultSort = key === "sortOrder" && value === "asc";
        const isDefaultPageSize = key === "pageSize" && Number(value) === DEFAULT_PAGE_SIZE;
        const isFirstPage = key === "page" && Number(value) <= 1;

        if (isEmpty || isDefaultSort || isDefaultPageSize || isFirstPage) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      if (resetPage && !Object.prototype.hasOwnProperty.call(updates, "page")) {
        next.delete("page");
      }

      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchInput.trim();
      if (normalized === keyword) return;
      updateParams({ keyword: normalized || null });
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput, keyword, updateParams]);

  useEffect(() => {
    let isCancelled = false;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const firstQuery = new URLSearchParams({
          pageNumber: "0",
          pageSize: String(CATEGORY_PAGE_SIZE),
          sortBy: "categoryName",
          sortOrder: "asc",
        });
        const { data: firstData } = await api.get(`/public/categories?${firstQuery.toString()}`);
        const firstItems = extractItems(firstData).map(normalizeCategory);

        if (Array.isArray(firstData)) {
          if (!isCancelled) {
            setCategories(firstItems);
          }
          return;
        }

        const totalPages = Number(firstData?.totalPages ?? 0);
        let isLastPage = Boolean(firstData?.lastPage);
        let collected = [...firstItems];
        let pageNumber = 1;

        const shouldPaginate = totalPages > 1 || isLastPage === false;
        while (shouldPaginate && !isLastPage && pageNumber < MAX_CATEGORY_PAGES) {
          const query = new URLSearchParams({
            pageNumber: String(pageNumber),
            pageSize: String(CATEGORY_PAGE_SIZE),
            sortBy: "categoryName",
            sortOrder: "asc",
          });
          const { data } = await api.get(`/public/categories?${query.toString()}`);
          const items = extractItems(data).map(normalizeCategory);
          collected = [...collected, ...items];
          const pageTotalPages = Number(data?.totalPages ?? totalPages);
          isLastPage =
            Boolean(data?.lastPage) ||
            items.length === 0 ||
            (pageTotalPages > 0 && pageNumber >= pageTotalPages - 1);
          pageNumber += 1;
        }

        if (!isCancelled) {
          setCategories(collected);
        }
      } catch {
        if (!isCancelled) {
          setCategories([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setErrorMessage("");
      try {
        const params = new URLSearchParams({
          pageNumber: String(page - 1),
          pageSize: String(pageSize),
          sortBy: "productName",
          sortOrder,
        });

        if (category && category !== "all") {
          params.set("category", category);
        }
        if (keyword) {
          params.set("keyword", keyword);
        }

        const { data } = await api.get(`/public/products?${params.toString()}`);
        if (isCancelled) return;

        const content = extractItems(data).map(normalizeProduct);
        const totalPages = Number(data?.totalPages ?? 1);
        const totalElements = Number(data?.totalElements ?? content.length);

        if (totalPages > 0 && page > totalPages) {
          updateParams({ page: totalPages > 1 ? totalPages : null }, false);
          return;
        }
        setProducts(content);
        setPagination({
          totalPages: totalPages > 0 ? totalPages : 1,
          totalElements,
        });
      } catch (error) {
        if (isCancelled) return;
        setProducts([]);
        setPagination({ totalPages: 1, totalElements: 0 });
        setErrorMessage(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to load products."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();
    return () => {
      isCancelled = true;
    };
  }, [page, pageSize, sortOrder, category, keyword, updateParams]);

  const hasActiveFilters = Boolean(
    keyword || category !== "all" || sortOrder !== "asc" || pageSize !== DEFAULT_PAGE_SIZE
  );

  const resetFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  return {
    products,
    pagination,
    errorMessage,
    isLoadingProducts,
    isLoadingCategories,
    searchInput,
    setSearchInput,
    category,
    categoryOptions,
    sortOrder,
    pageSize,
    hasActiveFilters,
    updateParams,
    resetFilters,
  };
}

export default useProductsCatalog;
