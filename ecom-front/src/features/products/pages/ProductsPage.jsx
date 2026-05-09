import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, Filter, LayoutGrid } from "lucide-react";
import { BiMessageError } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { api } from "../../../services/api/api";
import ProductCard from "../../../shared/components/ProductCard";
import Loader from "../../../shared/components/Loader";
import Paginations from "../../../shared/components/Paginations";

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
      item?.categoryName ??
      item?.category?.categoryName ??
      item?.category?.name ??
      "General",
  image: item?.image || DEFAULT_IMAGE,
  description: item?.description ?? "",
  quantity: Number(item?.quantity ?? 0),
  price: Number(item?.price ?? 0),
  discount: Number(item?.discount ?? 0),
  specialPrice:
      item?.specialPrice != null
          ? Number(item.specialPrice)
          : Number(item?.price ?? 0),
});

const toPositiveNumber = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1) return fallback;
  return numeric;
};

function ProductsPage({ adminView = false }) {
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
  const [searchInput, setSearchInput] = useState(
      searchParams.get("keyword") || ""
  );

  const page = toPositiveNumber(searchParams.get("page"), 1);
  const pageSize = toPositiveNumber(
      searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE
  );
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
          const isEmpty =
              value === null ||
              value === undefined ||
              value === "" ||
              value === "all";
          const isDefaultSort = key === "sortOrder" && value === "asc";
          const isDefaultPageSize =
              key === "pageSize" && Number(value) === DEFAULT_PAGE_SIZE;
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
        const { data: firstData } = await api.get(
          `/public/categories?${firstQuery.toString()}`
        );
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
      keyword ||
      category !== "all" ||
      sortOrder !== "asc" ||
      pageSize !== DEFAULT_PAGE_SIZE
  );

  return (
      <div className="bg-[#fcfcfc] min-h-screen">
        {/* Header Area */}
        <div className="lg:px-14 sm:px-8 px-4 pt-16 pb-10 2xl:w-[90%] 2xl:mx-auto">

          {/* --- FILTER BAR (Premium Bento Style) --- */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative group">
                <Search
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search artifact..."
                    className="h-14 w-full rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-300 placeholder:font-bold"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <Filter size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none" />
                <select
                    value={category}
                    onChange={(event) => updateParams({ category: event.target.value })}
                    disabled={isLoadingCategories}
                    className="h-14 w-full appearance-none rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                >
                  <option value="all">ALL CATEGORIES</option>
                  {categoryOptions.map((item) => (
                      <option key={item.categoryId} value={item.categoryName}>
                        {item.categoryName.toUpperCase()}
                      </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <LayoutGrid size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
                <select
                    value={sortOrder}
                    onChange={(event) => updateParams({ sortOrder: event.target.value })}
                    className="h-14 w-full appearance-none rounded-2xl border-none bg-slate-50 pl-14 pr-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                >
                  <option value="asc">SORT: A - Z</option>
                  <option value="desc">SORT: Z - A</option>
                </select>
              </div>

              {/* Page Size & Reset */}
              <div className="flex gap-2">
                <select
                    value={pageSize}
                    onChange={(event) =>
                        updateParams({ pageSize: Number(event.target.value) })
                    }
                    className="h-14 flex-1 rounded-2xl border-none bg-slate-50 px-6 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                >
                  <option value={8}>8 PER PAGE</option>
                  <option value={12}>12 PER PAGE</option>
                  <option value={24}>24 PER PAGE</option>
                </select>

                <button
                    type="button"
                    disabled={!hasActiveFilters}
                    onClick={() => {
                      setSearchInput("");
                      setSearchParams(new URLSearchParams());
                    }}
                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-orange-500 disabled:opacity-20 disabled:grayscale transition-all duration-300"
                    aria-label="Reset filters"
                >
                  <RotateCcw size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </section>

          {/* --- MAIN CONTENT AREA --- */}
          {errorMessage ? (
              <div className="flex flex-col justify-center items-center h-[500px] gap-4 bg-rose-50 rounded-[3rem] border border-rose-100">
                <BiMessageError className="text-rose-500 text-6xl animate-bounce" />
                <span className="text-rose-900 text-xl font-black italic tracking-tighter uppercase">{errorMessage}</span>
              </div>
          ) : isLoadingProducts ? (
              <div className="h-[600px] flex items-center justify-center bg-white rounded-[3rem] border border-slate-100">
                <Loader text="CURATING ARTIFACTS" />
              </div>
          ) : (
              <div className="min-h-[600px]">
                {products.length ? (
                    <div className="pb-16 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-8 gap-y-12">
                      {products.map((item) => (
                          <ProductCard
                              key={item.productId}
                              {...item}
                              adminView={adminView}
                          />
                      ))}
                    </div>
                ) : (
                    <div className="h-[500px] flex items-center justify-center bg-white rounded-[3rem] border border-slate-100">
                      <div className="text-center space-y-4">
                        <div className="text-8xl font-black text-slate-100 tracking-tighter italic">VOID</div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                          No results match your current filters.
                        </p>
                        <button
                            onClick={() => setSearchParams(new URLSearchParams())}
                            className="text-teal-600 font-black uppercase tracking-widest text-[10px] hover:text-orange-500 transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* --- PAGINATION --- */}
          {pagination.totalPages > 1 ? (
              <div className="flex justify-center pt-10 pb-20 border-t border-slate-100">
                <Paginations numberOfPage={pagination.totalPages} />
              </div>
          ) : null}
        </div>
      </div>
  );
}

export default ProductsPage;
