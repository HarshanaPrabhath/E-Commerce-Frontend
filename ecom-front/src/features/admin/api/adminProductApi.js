import { api } from "../../../services/api/api";

const PRODUCT_QUERY =
  "pageNumber=0&pageSize=200&sortBy=productName&sortOrder=asc";
const CATEGORY_PAGE_SIZE = 50;
const MAX_CATEGORY_PAGES = 200;

const normalizeId = (value) => String(value ?? "").trim();
const parseBooleanish = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(value);
};

const unwrapList = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (Array.isArray(responseData?.content)) {
    return responseData.content;
  }
  return [];
};

const toCategory = (item) => ({
  id: normalizeId(item?.categoryId ?? item?.id ?? ""),
  name: item?.categoryName ?? item?.name ?? "",
});

const toProduct = (item) => {
  const category = item?.category;
  const categoryId =
    item?.categoryId ??
    item?.categoryID ??
    category?.categoryId ??
    category?.id ??
    (typeof category === "string" || typeof category === "number"
      ? category
      : "");

  const categoryName =
    item?.categoryName ??
    category?.categoryName ??
    category?.name ??
    (typeof category === "string" ? category : "");

  return {
    id: normalizeId(item?.productId ?? item?.id ?? ""),
    productName: item?.productName ?? "",
    description: item?.description ?? "",
    quantity: Number(item?.quantity ?? 0),
    price: Number(item?.price ?? 0),
    discount: Number(item?.discount ?? 0),
    image: item?.image ?? "",
    categoryId: normalizeId(categoryId),
    categoryName: categoryName ?? "",
  };
};

const toProductRequestBody = (payload) => ({
  productName: String(payload?.productName ?? "").trim(),
  description: String(payload?.description ?? "").trim(),
  quantity: Number(payload?.quantity ?? 0),
  image: String(payload?.image ?? "").trim(),
  price: Number(payload?.price ?? 0),
  discount: Number(payload?.discount ?? 0),
});

export const extractApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export const adminProductApi = {
  async getProducts() {
    const { data } = await api.get(`/public/products?${PRODUCT_QUERY}`);
    return unwrapList(data).map(toProduct);
  },

  async getCategories() {
    const firstResponse = await api.get(
      `/public/categories?pageNumber=0&pageSize=${CATEGORY_PAGE_SIZE}&sortBy=categoryName&sortOrder=asc`
    );
    const firstData = firstResponse?.data;
    const firstItems = unwrapList(firstData).map(toCategory);

    // Non-paginated response shape: plain array
    if (Array.isArray(firstData)) {
      return firstItems;
    }

    const totalPages = Number(firstData?.totalPages ?? 0);
    const serverLastPage = parseBooleanish(firstData?.lastPage);
    const shouldPaginate = totalPages > 1 || serverLastPage === false;
    if (!shouldPaginate) {
      return firstItems;
    }

    let pageNumber = 1;
    let all = [...firstItems];
    let lastPage = serverLastPage || false;

    while (!lastPage && pageNumber < MAX_CATEGORY_PAGES) {
      const { data } = await api.get(
        `/public/categories?pageNumber=${pageNumber}&pageSize=${CATEGORY_PAGE_SIZE}&sortBy=categoryName&sortOrder=asc`
      );
      const current = unwrapList(data).map(toCategory);
      all = [...all, ...current];
      const pageTotalPages = Number(data?.totalPages ?? totalPages);
      const pageLastPage = parseBooleanish(data?.lastPage);
      lastPage =
        pageLastPage ||
        current.length === 0 ||
        (pageTotalPages > 0 && pageNumber >= pageTotalPages - 1);
      pageNumber += 1;
    }

    return all;
  },

  async createCategory(payload) {
    const { data } = await api.post("/public/categories", payload);
    return data;
  },

  async updateCategory(id, payload) {
    const { data } = await api.put(`/public/categories/${id}`, payload);
    return data;
  },

  async deleteCategory(id) {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },

  async createProduct(payload) {
    const { categoryId, ...body } = payload;
    if (!categoryId) {
      throw new Error("Category is required.");
    }
    const { data } = await api.post(
      `/admin/categories/${categoryId}/product`,
      toProductRequestBody(body)
    );
    return data;
  },

  async updateProduct(id, payload) {
    const { data } = await api.put(
      `/admin/products/${id}`,
      toProductRequestBody(payload)
    );
    return data;
  },

  async deleteProduct(id) {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  },

  async uploadProductImage(id, file) {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.put(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};

export default adminProductApi;
