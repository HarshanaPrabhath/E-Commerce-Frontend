import { api } from "../../../services/api/api";
import { normalizeImageUrl } from "../../../shared/utils/imageUrl";

const PRODUCT_PAGE_SIZE = 200;
const CATEGORY_PAGE_SIZE = 50;
const MAX_PRODUCT_PAGES = 200;
const MAX_CATEGORY_PAGES = 200;

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeId = (value) => String(value ?? "").trim();

const parseBooleanish = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(value);
};

const unwrapList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.content)) return responseData.content;
  return [];
};

const fetchCategoryProducts = async (categoryId) => {
  const { data } = await api.get(`/public/categories/${categoryId}/products`);
  return unwrapList(data);
};

// ─── Mappers ─────────────────────────────────────────────────────────────────

const toCategory = (item) => ({
  id: normalizeId(item?.categoryId ?? item?.id ?? ""),
  name: item?.categoryName ?? item?.name ?? "",
});

const toProduct = (item) => {
  const category = item?.category;
  const categoryDto = item?.categoryDTO;
  const categoryId =
      item?.categoryId ??
      item?.categoryID ??
      item?.category_id ??
      item?.catId ??
      item?.catID ??
      categoryDto?.categoryId ??
      categoryDto?.id ??
      category?.categoryId ??
      category?.id ??
      (typeof category === "string" || typeof category === "number"
          ? category
          : "");

  const categoryName =
      item?.categoryName ??
      item?.category_name ??
      item?.catName ??
      item?.cat_name ??
      categoryDto?.categoryName ??
      categoryDto?.name ??
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
    image: normalizeImageUrl(item?.image ?? ""),
    categoryId: normalizeId(categoryId),
    categoryName: categoryName ?? "",
  };
};

// ─── Request body builder (with validation) ──────────────────────────────────

const toProductRequestBody = (payload) => {
  const productName = String(payload?.productName ?? "").trim();
  const description = String(payload?.description ?? "").trim();
  const image = normalizeImageUrl(payload?.image ?? "");

  const price = Number(payload?.price ?? 0);
  const quantity = Number(payload?.quantity ?? 0);
  const discount = Number(payload?.discount ?? 0);

  // Validate required string fields
  if (!productName) {
    throw new Error("Product name is required and cannot be empty.");
  }
  if (!image) {
    throw new Error("Image URL is required and cannot be empty.");
  }

  // Validate numeric fields — Number("abc") produces NaN which causes 400s
  if (isNaN(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }
  if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    throw new Error("Quantity must be a valid non-negative integer.");
  }
  if (isNaN(discount) || discount < 0 || discount > 100) {
    throw new Error("Discount must be a number between 0 and 100.");
  }

  return { productName, description, quantity, image, price, discount };
};

const toCategoryId = (payload) =>
  normalizeId(
    payload?.categoryId ??
    payload?.categoryID ??
    payload?.category?.id ??
    payload?.category?.categoryId ??
    ""
  );

const resolveCreatedProductId = (payload) =>
  payload?.productId ??
  payload?.id ??
  payload?.data?.productId ??
  payload?.data?.id ??
  payload?.product?.productId ??
  payload?.product?.id ??
  null;

const usesDefaultImage = (value) =>
  String(value || "").toLowerCase().includes("/images/default.png");

// ─── Error extraction ────────────────────────────────────────────────────────

export const extractApiErrorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

// ─── API ─────────────────────────────────────────────────────────────────────

export const adminProductApi = {
  async getProducts() {
    const firstResponse = await api.get(
      `/public/products?pageNumber=0&pageSize=${PRODUCT_PAGE_SIZE}&sortBy=productName&sortOrder=asc`
    );
    const firstData = firstResponse?.data;
    const firstItems = unwrapList(firstData).map(toProduct);

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

    while (!lastPage && pageNumber < MAX_PRODUCT_PAGES) {
      const { data } = await api.get(
        `/public/products?pageNumber=${pageNumber}&pageSize=${PRODUCT_PAGE_SIZE}&sortBy=productName&sortOrder=asc`
      );
      const current = unwrapList(data).map(toProduct);
      all = [...all, ...current];

      const pageTotalPages = Number(data?.totalPages ?? totalPages);
      const pageLastPage = parseBooleanish(data?.lastPage);
      lastPage =
        pageLastPage ||
        current.length === 0 ||
        (pageTotalPages > 0 && pageNumber >= pageTotalPages - 1);
      pageNumber += 1;
    }

    // `/public/products` may not include category info.
    // Enrich categoryId/categoryName via category-product endpoints.
    let categories = [];
    try {
      categories = await adminProductApi.getCategories();
    } catch {
      categories = [];
    }

    const categoryLinks = new Map();
    await Promise.all(
      categories.map(async (category) => {
        try {
          const items = await fetchCategoryProducts(category.id);
          items.forEach((product) => {
            const productId = normalizeId(product?.productId ?? product?.id ?? "");
            if (!productId) return;
            categoryLinks.set(productId, {
              categoryId: normalizeId(category.id),
              categoryName: category.name || "",
            });
          });
        } catch {
          // Ignore per-category lookup failures and keep base product data.
        }
      })
    );

    return all.map((item) => {
      const linked = categoryLinks.get(normalizeId(item?.id));
      if (!linked) return item;
      return {
        ...item,
        categoryId: item?.categoryId || linked.categoryId,
        categoryName: item?.categoryName || linked.categoryName,
      };
    });
  },

  async getCategories() {
    const firstResponse = await api.get(
        `/public/categories?pageNumber=0&pageSize=${CATEGORY_PAGE_SIZE}&sortBy=categoryName&sortOrder=asc`
    );
    const firstData = firstResponse?.data;
    const firstItems = unwrapList(firstData).map(toCategory);

    // Non-paginated response: plain array — return early
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
    const name = String(payload?.categoryName ?? payload?.name ?? "").trim();
    if (!name) {
      throw new Error("Category name is required.");
    }
    const { data } = await api.post("/public/categories", payload);
    return data;
  },

  async updateCategory(id, payload) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      throw new Error("Category ID is required for update.");
    }
    const { data } = await api.put(`/public/categories/${normalizedId}`, payload);
    return data;
  },

  async deleteCategory(id) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      throw new Error("Category ID is required for delete.");
    }
    const { data } = await api.delete(`/admin/categories/${normalizedId}`);
    return data;
  },

  async createProduct(payload) {
    const categoryId = toCategoryId(payload);
    if (!categoryId) {
      throw new Error("Category is required to create a product.");
    }
    const body = toProductRequestBody(payload); // throws if fields are invalid
    const createUrl = `/admin/categories/${categoryId}/product`;

    // Keep the exact JSON shape backend expects.
    const requestBody = {
      productName: body.productName,
      description: body.description,
      quantity: body.quantity,
      image: body.image,
      price: body.price,
      discount: body.discount,
    };

    const { data } = await api.post(
      createUrl,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const createdImage =
      data?.image ??
      data?.product?.image ??
      data?.data?.image ??
      "";
    const createdId = resolveCreatedProductId(data);
    const mustSyncImage =
      Boolean(createdId) &&
      (usesDefaultImage(createdImage) || String(createdImage || "").trim() !== body.image);

    if (mustSyncImage) {
      await api.put(`/admin/products/${createdId}`, requestBody);
    }

    return data;
  },

  async updateProduct(id, payload) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      throw new Error("Product ID is required for update.");
    }
    const body = toProductRequestBody(payload); // throws if fields are invalid
    const { data } = await api.put(`/admin/products/${normalizedId}`, body);
    return data;
  },

  async deleteProduct(id) {
        const normalizedId = normalizeId(id);
        if (!normalizedId) {
          throw new Error("Product ID is required for delete.");
        }
        await api.delete(`/admin/products/${normalizedId}`);
        // Don't destructure { data } — DELETE often returns no body (204)
  },

  async uploadProductImage(id, file) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      throw new Error("Product ID is required for image upload.");
    }
    if (!file) {
      throw new Error("A file is required for image upload.");
    }
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.put(`/products/${normalizedId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export default adminProductApi;
